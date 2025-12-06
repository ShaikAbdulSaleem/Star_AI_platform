const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String, role: { type: String, enum: ['innovator', 'investor'], default: 'innovator' },
  profile: { sector: String, stage: String, mindset: [String] }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
