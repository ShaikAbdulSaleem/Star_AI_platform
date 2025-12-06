const Startup = require('../models/Startup');
const AIAnalyzer = require('../utils/aiAnalyzer');

exports.createAnalysis = async (req, res) => {
  try {
    const analysis = AIAnalyzer.analyzeStartup(req.body.idea);
    const startup = new Startup({
      userId: req.user._id,
      title: req.body.title,
      idea: req.body.idea,
      aiAnalysis: analysis
    });
    await startup.save();
    res.status(201).json(startup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalysis = async (req, res) => {
  const startups = await Startup.find({ userId: req.user._id }).populate('userId', 'name');
  res.json(startups);
};
