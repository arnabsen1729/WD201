const request = require('supertest')
const cheerio = require('cheerio')

const db = require('../models/index')
const app = require('../app')

let server, agent

function extractCsrfToken (html) {
  const $ = cheerio.load(html)
  return $('input[name=_csrf]').val()
}

describe('Todo test suite', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
    server = app.listen(4000, () => {})
    agent = request.agent(server)
  })

  afterAll(async () => {
    await db.sequelize.close()
    await server.close()
  })

  test('Create a new todo by POST /todos', async () => {
    const home = await agent.get('/')
    const csrfToken = extractCsrfToken(home.text)
    const response = await agent
      .post('/todos')
      .set('Accept', 'application/json')
      .send({
        title: 'Test creating a new todo',
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken
      })

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
    const parseResponse = JSON.parse(response.text)
    expect(parseResponse).toHaveProperty('id')
    expect(parseResponse).toHaveProperty('title')
    expect(parseResponse).toHaveProperty('dueDate')
    expect(parseResponse).toHaveProperty('completed')
  })

  test('Mark a todo as completed by PUT /todos/:id', async () => {
    // create an uncompleted todo
    let home = await agent.get('/')
    let csrfToken = extractCsrfToken(home.text)
    const response = await agent
      .post('/todos')
      .set('Accept', 'application/json')
      .send({
        title: 'Test marking a todo as completed',
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken
      })

    expect(response.statusCode).toBe(200)
    const todo = JSON.parse(response.text)

    home = await agent.get('/')
    csrfToken = extractCsrfToken(home.text)

    const markCompleteResponse = await agent
      .set('Accept', 'application/json')
      .put(`/todos/${todo.id}`)
      .send({ completed: true, _csrf: csrfToken })

    expect(markCompleteResponse.statusCode).toBe(200)
    expect(markCompleteResponse.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
    const parseMarkCompleteResponse = JSON.parse(markCompleteResponse.text)
    expect(parseMarkCompleteResponse).toHaveProperty('completed')
    expect(parseMarkCompleteResponse.completed).toBe(true)
  })

  test('Delete a todo by DELETE /todos/:id where the todo exists', async () => {
    // extract csrf token from home page
    let home = await agent.get('/').set('Accept', 'html')
    let csrfToken = extractCsrfToken(home.text)

    const response = await agent
      .post('/todos')
      .set('Accept', 'application/json')
      .send({
        title: 'Test deleting a todo',
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken
      })

    expect(response.statusCode).toBe(200)
    const todo = JSON.parse(response.text)

    home = await agent.get('/')
    csrfToken = extractCsrfToken(home.text)

    const deleteResponse = await agent
      .delete(`/todos/${todo.id}`)
      .set('Accept', 'application/json')
      .send({ _csrf: csrfToken })
    expect(deleteResponse.statusCode).toBe(200)
    expect(deleteResponse.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
    expect(deleteResponse.text).toBe('true')
  })

  test('Delete a todo by DELETE /todos/:id where the todo does not exist', async () => {
    const home = await agent.get('/').set('Accept', 'html')
    const csrfToken = extractCsrfToken(home.text)
    const deleteResponse = await agent.delete('/todos/999').send({
      _csrf: csrfToken
    })
    expect(deleteResponse.statusCode).toBe(422)
    expect(deleteResponse.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
    expect(deleteResponse.text).toBe('false')
  })
})
