const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    await server.close();
  });

  test("Create a new todo by POST /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Test creating a new todo",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    const parseResponse = JSON.parse(response.text);
    expect(parseResponse).toHaveProperty("id");
    expect(parseResponse).toHaveProperty("title");
    expect(parseResponse).toHaveProperty("dueDate");
    expect(parseResponse).toHaveProperty("completed");
  });

  test("Mark a todo as completed by PUT /todos/:id/markAsCompleted", async () => {
    const response = await agent.post("/todos").send({
      title: "Test marking a todo as completed",
      dueDate: new Date().toISOString(),
      completed: false,
    });

    const todo = JSON.parse(response.text);
    const markCompleteResponse = await agent.put(
      `/todos/${todo.id}/markAsCompleted`
    );
    expect(markCompleteResponse.statusCode).toBe(200);
    expect(markCompleteResponse.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
    const parseMarkCompleteResponse = JSON.parse(markCompleteResponse.text);
    expect(parseMarkCompleteResponse).toHaveProperty("completed");
    expect(parseMarkCompleteResponse.completed).toBe(true);
  });
});
