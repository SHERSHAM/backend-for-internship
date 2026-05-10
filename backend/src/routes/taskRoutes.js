const express = require('express');
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskRules, validate } = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task CRUD endpoints (JWT required)
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks (admin sees all, user sees own)
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [todo, in-progress, done] }
 *               priority: { type: string, enum: [low, medium, high] }
 *     responses:
 *       201:
 *         description: Task created
 */
router.route('/').get(protect, getTasks).post(protect, taskRules, validate, createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Task data
 *       404:
 *         description: Task not found
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated task
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.route('/:id')
  .get(protect, getTask)
  .put(protect, taskRules, validate, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
