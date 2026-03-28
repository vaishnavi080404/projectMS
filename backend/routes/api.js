const express = require('express');
const router = express.Router();
const projectCtrl = require('../controllers/projectController');
const taskCtrl = require('../controllers/taskController');

// 1. Import your validation rules and the validate function
const { 
    projectValidationRules, 
    taskValidationRules, 
    validate 
} = require('../middlewares/validator');

// --- Project Routes ---

// Added validation here: projectValidationRules + validate
router.post('/projects', projectValidationRules, validate, projectCtrl.createProject);

router.get('/projects', projectCtrl.getProjects);
router.get('/projects/:id', projectCtrl.getProjectById);
router.delete('/projects/:id', projectCtrl.deleteProject);


// --- Task Routes ---

// Added validation here: taskValidationRules + validate
router.post('/projects/:project_id/tasks', taskValidationRules, validate, taskCtrl.createTask);

router.get('/projects/:project_id/tasks', taskCtrl.getTasksByProject);

// Added validation here for updates as well
router.put('/tasks/:id', taskValidationRules, validate, taskCtrl.updateTask);

router.delete('/tasks/:id', taskCtrl.deleteTask);

module.exports = router;