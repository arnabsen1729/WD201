const express = require("express");
const { Todo } = require("./models");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.getTodos();
    return res.json(todos);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.addTodo(req.body.title, req.body.dueDate);
    return res.json(todo);
  } catch (error) {
    return res.status(422).send({ error: error.message });
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    await todo.markAsCompleted();
    return res.json(todo);
  } catch (error) {
    return res.status(422).send({ error: error.message });
  }
});

app.delete("/todos/:id", (req, res) => {
  return res.status(200).send({ message: `Todo ${req.params.id} deleted` });
});

module.exports = app;
