const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendAdminMail = require('../utils/sendAdminMail');

exports.signup = async (req, res) => {
  const { email, password, age, isAdmin } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed, age, isAdmin });
  await user.save();

  if (!isAdmin) {
    await sendAdminMail(email);
  }

  res.json({ message: 'User created' });
};
exports.login = async (req, res) =>{
    const {email, password} = req.body; 
    const user = await User.findOne({email});
    if(!user || !(await bcrypt.compare(password, user.password))){
        return res.status(401).json({message: 'Invalid Credentials'});
    }
    const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);
    res.json({token});
}