const todoList = require("../todo");

const { all, add, markAsComplete, overdue, dueToday, dueLater } = todoList();

describe("TodoList Test Suite", () => {
  beforeAll(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    add({
      title: "Today's task",
      dueDate: today.toISOString().split("T")[0],
      completed: false,
    });
    add({
      title: "Yesterday's task",
      dueDate: yesterday.toISOString().split("T")[0],
      completed: false,
    });
    add({
      title: "Tomorrow's task",
      dueDate: tomorrow.toISOString().split("T")[0],
      completed: false,
    });
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
    expect(overdueItems.length).toBe(1);
  });

  test("retrieval of due today items", () => {
    const dueTodayItems = dueToday();
    expect(dueTodayItems.length).toBe(2);
  });

  test(" retrieval of due later items", () => {
    const dueLaterItems = dueLater();
    expect(dueLaterItems.length).toBe(1);
  });
});
