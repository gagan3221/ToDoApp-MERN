const mongoose = require("mongoose");
const Todos = require("../models/todoModel");

const getTodos = async (req, res) => {
  try {
    const uid = req.user._id;
    const todos = await Todos.find({ uid }).sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ error: "error.message" });
  }
};

const getTodo = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such document" });
  }

  try {
    const todo = await Todos.findById({ _id: id });

    if (!todo) {
      return res.status(404).json({ message: "No such document" });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createTodo = async (req, res) => {
  const { todo } = req.body;

  try {
    const uid = req.user._id;
    const todos = await Todos.create({
      todo,
      uid,
    });
    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such document." });
  }

  try {
    const todos = await Todos.findByIdAndDelete({ _id: id });

    if (!todos) {
      return res.status(404).json({ message: "No such document" });
    }

    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTodo = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such document." });
  }

  try {
    const todos = await Todos.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!todos) {
      return res.status(404).json({ message: "No such document" });
    }

    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTodoStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such document." });
  }

  try {
    const todo = await Todos.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "No such document" });
    }

    // Calculate duration if status is changing from ongoing to paused or completed
    if (todo.status === 'ongoing' && (status === 'paused' || status === 'completed')) {
      const now = new Date();
      const lastStart = new Date(todo.lastStartTime);
      const sessionDuration = Math.floor((now - lastStart) / 1000);
      todo.activeDuration += sessionDuration;
      todo.lastStartTime = null;
    } else if (status === 'ongoing' && todo.status !== 'ongoing') {
      // Starting timer
      todo.lastStartTime = new Date();
    }

    todo.status = status;
    todo.activities.push({ status, timestamp: new Date() });

    await todo.save();

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo,
  updateTodoStatus,
};
