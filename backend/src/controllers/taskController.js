const Task = require("../models/Task");


exports.getTasks = async(req, res) =>{
    const tasks = await Task.find({createdBy: req.user.id});
    res.json(tasks);
}

exports.createTask = async (req, res) =>{
    console.log("checking")
    const {title, description , status, dueDate} = req.body;
    const task = new Task({title, description , status, dueDate, createdBy: req.user.id});
    await task.save();
    res.json(task);
}

exports.updateTask = async (req, res)=>{
    const task = await Task.findByIdAndUpdate(
        {_id: req.params.id, createdBy: req.user.id},
        req.body,
        {new: true}
    );
    res.json(task);
}


exports.deleteTask = async(req, res) =>{
    await Task.findByIdAndDelete({_id: req.params.id, createdBy: req.user.id});
    res.json({message:"Task Deleted"});
}