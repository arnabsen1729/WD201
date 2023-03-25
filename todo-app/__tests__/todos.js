const request = require('supertest')

const db = require('../models/index')
const app = require('../app')

let server, agent

describe('Todo test suite', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
    server = app.listen(3000, () => {})
    agent = request.agent(server)
  })

  afterAll(async () => {
    await db.sequelize.close()
    await server.close()
  })

  test('Create a new todo by POST /todos', async () => {
    const response = await agent.post('/todos').send({
      title: 'Test creating a new todo',
      dueDate: new Date().toISOString(),
      completed: false
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

  test('Mark a todo as completed by PUT /todos/:id/markAsCompleted', async () => {
    // create an uncompleted todo
    const response = await agent.post('/todos').send({
      title: 'Test marking a todo as completed',
      dueDate: new Date().toISOString(),
      completed: false
    })

    expect(response.statusCode).toBe(200)
    const todo = JSON.parse(response.text)
    const markCompleteResponse = await agent.put(
      `/todos/${todo.id}/markAsCompleted`
    )
    expect(markCompleteResponse.statusCode).toBe(200)
    expect(markCompleteResponse.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
    const parseMarkCompleteResponse = JSON.parse(markCompleteResponse.text)
    expect(parseMarkCompleteResponse).toHaveProperty('completed')
    expect(parseMarkCompleteResponse.completed).toBe(true)
  })

  test('Delete a todo by DELETE /todos/:id where the todo exists', async () => {
    // create a todo
    const response = await agent.post('/todos').send({
      title: 'Test deleting a todo',
      dueDate: new Date().toISOString(),
      completed: false
    })

    expect(response.statusCode).toBe(200)
    const todo = JSON.parse(response.text)
    const deleteResponse = await agent.delete(`/todos/${todo.id}`)
    expect(deleteResponse.statusCode).toBe(200)
    expect(deleteResponse.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
    expect(deleteResponse.text).toBe('true')
  })

  test('Delete a todo by DELETE /todos/:id where the todo does not exist', async () => {
    const deleteResponse = await agent.delete('/todos/999')
    expect(deleteResponse.statusCode).toBe(422)
    expect(deleteResponse.headers['content-type']).toEqual(
      expect.stringContaining('json')
    )
    expect(deleteResponse.text).toBe('false')
  })
})
