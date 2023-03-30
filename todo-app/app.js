const express = require('express')
const { Todo } = require('./models')
const bodyParser = require('body-parser')
const path = require('path')
const csurf = require('tiny-csrf')
const cookieParser = require('cookie-parser')

const app = express()
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser('secret token'))
app.use(csurf('m7DdIYoarUfAhXTeGqepY5gMbBApfX4J', ['POST', 'PUT', 'DELETE']))

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
  const overdueTodos = await Todo.overdueTodos()
  const dueLaterTodos = await Todo.dueLaterTodos()
  const dueTodayTodos = await Todo.dueTodayTodos()
  const completedTodos = await Todo.completedTodos()
  return res.render('index', {
    overdueTodos,
    dueLaterTodos,
    dueTodayTodos,
    completedTodos,
    csrfToken: req.csrfToken()
  })
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
    if (req.accepts('html')) {
      return res.redirect('/')
    } else {
      return res.json(todo)
    }
  } catch (error) {
    return res.status(422).send({ error: error.message })
  }
})

app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id)
    await todo.setCompletionStatus(req.body.completed)
    if (req.accepts('html')) {
      return res.redirect('/')
    } else {
      return res.json(todo)
    }
  } catch (error) {
    return res.status(422).send({ error: error.message })
  }
})

app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id)
    todo.destroy()
    if (req.accepts('html')) {
      return res.redirect('/')
    } else {
      return res.status(200).send(true)
    }
  } catch (error) {
    return res.status(422).send(false)
  }
})

module.exports = app
