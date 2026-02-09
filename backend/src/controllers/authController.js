const User = require('../models/User');
const Student = require('../models/Student');
const Lecturer = require('../models/Lecturer');
const { generateToken } = require('../utils/jwt');

const login = async (req, res) => {
  try {
    const { id, password, role } = req.body;
    
    let user;
    
    if (role === 'student' || role === 'parent') {
      user = await User.findOne({ where: { rollNo: id, role } });
    } else {
      user = await User.findOne({ where: { email: id, role } });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = generateToken(user.id, user.role);
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        rollNo: user.rollNo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verify = async (req, res) => {
  try {
    const { email, rollNo, password } = req.body;
    
    const user = await User.findOne({ where: { email, rollNo } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.password = password;
    user.isVerified = true;
    await user.save();
    
    res.json({ message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login, verify };
