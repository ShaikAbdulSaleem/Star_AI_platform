const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  idea: {
    problem: String,
    solution: String,
    market: String,
    team: String,
    revenueModel: String
  },
  aiAnalysis: {
    failureReasons: [String],
    challenges: [String],
    risks: [{
      type: String,
      level: { type: Number, min: 0, max: 10 },
      mitigation: String
    }],
    milestones: [{
      name: String,
      week: Number,
      actions: [String],
      completed: { type: Boolean, default: false }
    }]
  },
  status: { type: String, enum: ['idea', 'mvp', 'funded'], default: 'idea' }
}, { timestamps: true });

module.exports = mongoose.model('Startup', StartupSchema);
