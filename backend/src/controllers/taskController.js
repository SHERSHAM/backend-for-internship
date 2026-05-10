const Task = require('../models/Task');

// GET /api/v1/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const tasks = await Task.find(filter).populate('user', 'name email').sort('-createdAt');
    res.status(200).json({ success: true, count: tasks.length, tasks });
  } catch (err) { next(err); }
};

// GET /api/v1/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    // Users can only view their own tasks; admins can view all
    if (req.user.role !== 'admin' && task.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task.' });
    }
    res.status(200).json({ success: true, task });
  } catch (err) { next(err); }
};

// POST /api/v1/tasks
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, task });
  } catch (err) { next(err); }
};

// PUT /api/v1/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    if (req.user.role !== 'admin' && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task.' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, task });
  } catch (err) { next(err); }
};

// DELETE /api/v1/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    if (req.user.role !== 'admin' && task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task.' });
    }

    await task.deleteOne();
    res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (err) { next(err); }
};
