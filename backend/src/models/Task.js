const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {type: String, enum: ['todo', 'inprogress', 'completed'], default: 'todo'},
    dueDate: Date,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})

module.exports = mongoose.model('Task', TaskSchema);