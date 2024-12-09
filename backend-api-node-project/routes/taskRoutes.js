const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  completeTask,
  deleteTask,
} = require("../controller/taskController");

router.get('/', getTasks);

router.post('/', createTask);

router.patch('/:id', completeTask);

router.delete('/:id', deleteTask);

module.exports = router;

