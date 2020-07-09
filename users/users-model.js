const db = require("../database/config");

async function add(user) {
  const [id] = await db("users").insert(user);
  return findById(id);
}

function find() {
  const users = db("users").select("*");
  return users;
}

function findBy(filter) {
  const results = db("users")
    .select("id", "username", "password")
    .where(filter);
  return results;
}

function findById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

module.exports = {
	add,
	find,
	findBy,
	findById,
}