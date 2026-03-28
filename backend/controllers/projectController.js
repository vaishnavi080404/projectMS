const Project = require('../models/Project');
const Task = require('../models/Task');

exports.createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const projects = await Project.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ created_at: -1 });
        const count = await Project.countDocuments();
        res.json({ projects, totalPages: Math.ceil(count / limit), currentPage: page });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Not found" });
        res.json(project);
    } catch (err) { res.status(500).json({ error: err.message }); }
};


exports.deleteProject = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        // 1. Find and delete the project
        const project = await Project.findByIdAndDelete(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // 2. Delete all tasks associated with this project (Smooth cleanup!)
        await Task.deleteMany({ project_id: projectId });

        res.json({ message: "Project and all its tasks deleted successfully" });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid Project ID format" });
        }
        next(err);
    }
};