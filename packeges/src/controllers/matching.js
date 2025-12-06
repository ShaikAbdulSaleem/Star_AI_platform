const User = require('../models/User');
const Connection = require('../models/Connection');

exports.getMatches = async (req, res) => {
  const user = await User.findById(req.user._id).populate('connections');
  
  // Simple matching logic (upgrade with vector embeddings later)
  const matches = await User.find({
    _id: { $ne: req.user._id },
    'profile.sector': user.profile.sector,
    role: user.role === 'innovator' ? 'investor' : 'innovator'
  }).limit(10);

  res.json(matches);
};

exports.sendConnection = async (req, res) => {
  const { to } = req.body;
  const connection = new Connection({ from: req.user._id, to });
  await connection.save();
  res.status(201).json(connection);
};

exports.acceptConnection = async (req, res) => {
  const connection = await Connection.findById(req.params.id);
  if (connection.to.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  
  connection.status = 'accepted';
  connection.roomId = `room_${Date.now()}`;
  await connection.save();
  
  // Add to user connections
  await User.findByIdAndUpdate(connection.from, { $push: { connections: req.user._id } });
  await User.findByIdAndUpdate(req.user._id, { $push: { connections: connection.from } });
  
  res.json(connection);
};
