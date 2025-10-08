import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.mongo.js';
import { MONGO_URI } from '../server.js';

export default {
  async init() {
    await mongoose.connect(MONGO_URI);
    // Seed demo user: test@example.com / secret123
    const exists = await User.findOne({ email: 'test@example.com' });
    if (!exists) {
      const hash = await bcrypt.hash('secret123', 12);
      await User.create({ email: 'test@example.com', password_hash: hash });
    }
  },
  async findUserByEmail(email) {
    return User.findOne({ email });
  },
  async createUser(email, passwordHash) {
    await User.create({ email, password_hash: passwordHash });
  }
};
