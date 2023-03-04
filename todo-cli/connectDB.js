const Sequelize = require("sequelize");

const database = "todo_db";
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "postgres",
});

const connect = async () => {
  return sequelize.authenticate();
};

module.exports = {
  connect,
  sequelize,
};
