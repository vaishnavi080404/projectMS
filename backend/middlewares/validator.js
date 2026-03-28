const { body, validationResult } = require('express-validator');

// Rules for creating a project
const projectValidationRules = [
    body('name').notEmpty().withMessage('Project name is required').trim(),
    body('description').optional().isLength({ max: 200 }).withMessage('Description too long'),
];

// Rules for creating a task
// Rules for creating/updating a task
const taskValidationRules = [
    // Use .optional() so it only validates IF the field is provided
    body('title').optional().notEmpty().withMessage('Task title cannot be empty'),
    body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
];

// Middleware to check for errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({ errors: errors.array() });
};

module.exports = { projectValidationRules, taskValidationRules, validate };