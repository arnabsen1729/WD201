'use strict'
const { Model, Op } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }

    static getTodos () {
      return this.findAll()
    }

    static overdueTodos () {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date()
          },
          completed: false
        }
      })
    }

    static dueLaterTodos () {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date()
          },
          completed: false
        }
      })
    }

    static dueTodayTodos () {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date()
          },
          completed: false
        }
      })
    }

    static completedTodos () {
      return this.findAll({
        where: {
          completed: true
        }
      })
    }

    static addTodo (title, dueDate) {
      try {
        return this.create({ title, dueDate, completed: false })
      } catch (error) {
        console.error('Error adding a task', error)
      }
    }

    setCompletionStatus(status) {
      try {
        this.update({ completed: status })
      } catch (error) {
        console.error('Error marking a task as completed', error)
      }
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Todo'
    }
  )
  return Todo
}
