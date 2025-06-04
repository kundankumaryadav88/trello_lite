const express = require('express');
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {deleteTask, updateTask, createTask, getTasks} = require("../controllers/taskController");

router.use(auth);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;