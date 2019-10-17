const express = require('express');
const router = express.Router([]);

const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');

const bodyParser = require('../middleware/bodyParser');
const crud = require('../util/crud');
const auth = require('../middleware/auth');

const { User } = require('../models/User');

router.post('/login', [bodyParser], async (req, res) =>
{
	const schema = {
		email: Joi.string().email().min(12).max(120).required(),
		password: Joi.string().min(5).max(100).required()
	}

	const { error } = Joi.validate(req.body, schema);

	if (error) return res.status(400).send(error.details[0].message);

	const { email, password } =  req.body;

	User.findOne(
		{ email: email },
		'name email password isAdmin',
		async (err, user) =>
		{
			if (err) return res.status(500).send('Server error');

			const passwordMatch = (user ? await bcrypt.compare(password, user.password) : false);

			if (!user || !passwordMatch) return res.status(400).send('Email or password incorrect');

			const token = user.generateAuthToken();

			res.header('x-auth-token', token).send(token);
		});
});

router.post('/new', [auth, bodyParser], async (req, res) =>
{
	const { name, email, password, isAdmin = false } = req.body;

	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(password, salt);

	const data = {
		name: name,
		email: email,
		password: hashed,
		isAdmin: isAdmin
	};

	const { error } = User.validate(data);

	if (error) return res.status(400).send(error.details[0].message);

	const newUser = new User(data);

	crud.create(res, newUser);
});

router.patch('/:id', [ auth, bodyParser ], async (req, res) =>
{
	const { body } = req;
	const id = req.params.id;

	let user;

	try {
		user = await User.findById(id, '-__v');

		if (!user)
			return res.status(404).send(`No user found with id ${id}`);
	} catch (error) { return res.status(400).send(error.errmsg); }

	let data = {
		_id: user._id,
		name: user.name,
		email: user.email,
		password: user.password,
		isAdmin: user.isAdmin
	};

	for (let field in body)
		data[field] = body[field];

	if (data.password) {
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(data.password, salt);
		data.password = hashed;
	}

	const { error } = User.validate(data);

	if (error) return res.status(400).send(error.details[0].message);

	crud.update(res, data, User);
});

router.get('/list', [ auth ], async (req, res) =>
{
	crud.find(res, User);
});

router.get('/:id', [ auth ], async (req, res) =>
{
	const id = req.params.id;
	
	crud.findById(res, id, User)
});

module.exports = router;
