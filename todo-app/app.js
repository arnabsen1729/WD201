const express = require('express')
const { Todo } = require('./models')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
  const allTodos = await Todo.getTodos()
  const overdueTodos = await Todo.overdueTodos()
  const dueLaterTodos = await Todo.dueLaterTodos()
  const dueTodayTodos = await Todo.dueTodayTodos()
  if (req.accepts('html')) {
    return res.render('index', { overdueTodos, dueLaterTodos, dueTodayTodos })
  } else {
    return res.json(allTodos)
  }
})

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.getTodos()
    return res.json(todos)
  } catch (error) {
    return res.status(400).send({ error: error.message })
  }
})

app.post('/todos', async (req, res) => {
  try {
    const todo = await Todo.addTodo(req.body.title, req.body.dueDate)
    return res.json(todo)
  } catch (error) {
    return res.status(422).send({ error: error.message })
  }
})

app.put('/todos/:id/markAsCompleted', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id)
    await todo.markAsCompleted()
    return res.json(todo)
  } catch (error) {
    return res.status(422).send({ error: error.message })
  }
})

app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id)
    todo.destroy()
    return res.status(200).send(true)
  } catch (error) {
    return res.status(422).send(false)
  }
})

module.exports = app
