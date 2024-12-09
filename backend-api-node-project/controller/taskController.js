require("dotenv").config();
const Task = require('../models/task');

const getTasks = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  try {
    let query = {};

    if (status === 'completed') {
      query.isCompleted = true;
    } else if (status === 'incomplete') {
      query.isCompleted = false;
    }

    const tasks = await Task.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const totalTasks = await Task.countDocuments();
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      data: tasks,
      currentPage: parseInt(page),
      totalPages,
      totalTasks,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err });
  }
};

const createTask = async (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ message: 'Title and Due Date are required.' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      isCompleted: false,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err });
  }
};

const completeTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndUpdate(
        id,
        { isCompleted: true },
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task completed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err });
  }
};

module.exports = {
  getTasks,
  createTask,
  completeTask,
  deleteTask
};
