import db from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  static create(username, password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = stmt.run(username, hashedPassword);
    return result.lastInsertRowid;
  }

  static findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT id, username, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

