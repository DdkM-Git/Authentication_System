import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true, required: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
