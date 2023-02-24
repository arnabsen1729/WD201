const todoList = require("../todo");
const {
  getRandomTitle,
  getRandomBoolean,
  getRandomDateInPast,
  getRandomDateInFuture,
} = require("../utils");
const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();

describe("TodoList Test Suite", () => {
  beforeAll(() => {
    // 5 todos with due dates as today
    for (let i = 0; i < 5; i++) {
      add({
        title: getRandomTitle(),
        dueDate: new Date().toISOString().split("T")[0],
        completed: false,
      });
    }

    // 5 todos with due dates in the past
    for (let i = 0; i < 5; i++) {
      add({
        title: getRandomTitle(),
        dueDate: getRandomDateInPast(),
        completed: getRandomBoolean(),
      });
    }

    // 5 todos with due dates in the future
    for (let i = 0; i < 5; i++) {
      add({
        title: getRandomTitle(),
        dueDate: getRandomDateInFuture(),
        completed: getRandomBoolean(),
      });
    }
  });

  test("creating a new todo", () => {
    const length = all.length;
    add({
      title: "Buy milk",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    expect(all.length).toBe(length + 1);
  });

  test("marking a todo as completed", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("retrieval of overdue items", () => {
    const overdueItems = overdue();
    add({
      title: "Buy milk",
      dueDate: getRandomDateInPast(),
      completed: false,
    });
    expect(overdue().length).toBe(overdueItems.length + 1);
  });

  test("retrieval of due today items", () => {
    const dueTodayItems = dueToday();
    add({
      title: "Buy milk",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    expect(dueToday().length).toBe(dueTodayItems.length + 1);
  });

  test(" retrieval of due later items", () => {
    const dueLaterItems = dueLater();
    add({
      title: "Buy milk",
      dueDate: getRandomDateInFuture(),
      completed: false,
    });
    expect(dueLater().length).toBe(dueLaterItems.length + 1);
  });
});
