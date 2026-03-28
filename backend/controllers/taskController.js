const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, project_id: req.params.project_id });
        await task.save();
        res.status(201).json(task);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getTasksByProject = async (req, res) => {
    try {
        const { status, sortBy = 'due_date' } = req.query;
        let query = { project_id: req.params.project_id };
        if (status) query.status = status;

        const tasks = await Task.find(query).sort({ [sortBy]: 1 });
        res.json(tasks);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Update a task (Lead can change Title/Topic, Description, Status, etc.)
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
    try {
        // We take everything from the body so the Lead has full control
        const updateData = req.body;
        
        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            updateData, // This will update whatever fields are sent (title, desc, etc.)
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        res.json({
            message: "Task updated successfully",
            task
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid Task ID format" });
        }
        next(err);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid Task ID format" });
        }
        next(err);
    }
};