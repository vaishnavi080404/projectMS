const mongoose = require('mongoose'); // <--- YOU WERE MISSING THIS LINE

const TaskSchema = new mongoose.Schema({
    project_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    assigned_to: { 
        type: String, 
        default: 'Unassigned' 
    },
    status: { 
        type: String, 
        enum: ['todo', 'in-progress', 'done'], 
        default: 'todo' 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'medium' 
    },
    due_date: { 
        type: Date 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    }
});

// DO NOT FORGET THIS EXPORT LINE AT THE BOTTOM
module.exports = mongoose.model('Task', TaskSchema);