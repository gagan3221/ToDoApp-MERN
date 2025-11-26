const express = require("express");
const {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  getTodo,
  updateTodoStatus,
} = require("../controllers/todoController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello. Done!" });
});

router.use(requireAuth);

router.get("/", getTodos);

router.post("/", createTodo);

// Status route must come before /:id routes
router.patch("/:id/status", updateTodoStatus);

router.get("/:id", getTodo);

router.delete("/:id", deleteTodo);

router.patch("/:id", updateTodo);

module.exports = router;
