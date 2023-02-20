const todoList = require("../todo");

const { all, add, markAsComplete } = todoList();

describe("TodoList Test Suite", () => {
  test("add a todo item", () => {
    expect(all.length).toBe(0);
    add({
      title: "Buy milk",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    expect(all.length).toBe(1);
  });

  test("mark as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
});
