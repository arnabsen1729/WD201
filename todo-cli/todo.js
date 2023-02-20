const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    const today = new Date().toISOString().split("T")[0];
    return all
      .filter((item) => item.dueDate < today)
      .map((item) => {
        return {
          title: item.title,
          dueDate: item.dueDate,
          completed: item.completed,
        };
      });
  };

  const dueToday = () => {
    const today = new Date().toISOString().split("T")[0];
    return all
      .filter((item) => item.dueDate === today)
      .map((item) => {
        return {
          title: item.title,
          completed: item.completed,
        };
      });
  };

  const dueLater = () => {
    const today = new Date().toISOString().split("T")[0];
    return all
      .filter((item) => item.dueDate > today)
      .map((item) => {
        return {
          title: item.title,
          dueDate: item.dueDate,
          completed: item.completed,
        };
      });
  };

  const toDisplayableList = (list) => {
    return list
      .map((item) => {
        return `[${item.completed ? "x" : " "}] ${item.title} ${
          item.dueDate ? `${item.dueDate}` : ""
        }`;
      })
      .join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;