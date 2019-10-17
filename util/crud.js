async function find(res, Class, sort = null)
{
	try {
		if (sort === null) sort = '_id';

		const result = await Class.find().sort(sort);
	
		if (!result)
			return res.status(404).send(`No ${Class.modelName} found`);
		else if (result.length < 1)
			return res.status(200).send(`No results`);
	
		return res.status(200).send(result);
	} catch (error) { res.status(400).send(error.errmsg); }
}

async function findById(res, id, Class)
{
	try {
		const result = await Class.findById(id);

		if (!result)
			return res.status(404).send(`No ${Class.modelName} found with id ${id}`);
	
		return res.status(200).send(result);
	} catch (error) { res.status(400).send(error.errmsg); }
}

async function create(res, Obj)
{
	try {
		const result = await Obj.save();

		return res.status(200).send(result);
	} catch (error) { res.status(400).send(error.errmsg); }
}

async function update(res, data, Class)
{
	try {
		const Obj = await Class.findByIdAndUpdate(data._id);

		if (!Obj)
			return res.status(404).send(`Could not update. No ${Class.modelName} found with id ${data._id}`);

		Obj.set(data);

		const result = await Obj.save();

		return res.status(200).send(result);        
	} catch (error) { res.status(400).send(error.errmsg); }
}

async function destroy(res, id, Class)
{
	try {
		const result = await Class.findByIdAndRemove(id);

		if (!result)
			return res.status(404).send(`Could not delete. No ${Class.modelName} found with id ${id}`);

		return res.status(200).send(result);
	} catch (error) { res.status(400).send(error.errmsg); }
}

module.exports.find = find;
module.exports.findById = findById;
module.exports.create = create;
module.exports.update = update;
module.exports.destroy = destroy;
