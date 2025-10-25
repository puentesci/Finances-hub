import db from '../config/database.js';

export class Account {
  static create(userId, name) {
    const stmt = db.prepare('INSERT INTO accounts (user_id, name) VALUES (?, ?)');
    const result = stmt.run(userId, name);
    return result.lastInsertRowid;
  }

  static findByUserId(userId) {
    const stmt = db.prepare('SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  }

  static findById(id, userId) {
    const stmt = db.prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?');
    return stmt.get(id, userId);
  }

  static update(id, userId, name) {
    const stmt = db.prepare('UPDATE accounts SET name = ? WHERE id = ? AND user_id = ?');
    const result = stmt.run(name, id, userId);
    return result.changes > 0;
  }

  static delete(id, userId) {
    const stmt = db.prepare('DELETE FROM accounts WHERE id = ? AND user_id = ?');
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }

  static getWithEntries(accountId, userId) {
    const account = this.findById(accountId, userId);
    if (!account) return null;

    const entriesStmt = db.prepare(`
      SELECT * FROM account_entries 
      WHERE account_id = ? 
      ORDER BY entry_date ASC
    `);
    const entries = entriesStmt.all(accountId);

    return { ...account, entries };
  }

  static getAllWithLatestEntry(userId) {
    const accounts = this.findByUserId(userId);
    
    return accounts.map(account => {
      const latestEntry = db.prepare(`
        SELECT * FROM account_entries 
        WHERE account_id = ? 
        ORDER BY entry_date DESC 
        LIMIT 1
      `).get(account.id);

      const netWorth = latestEntry 
        ? (latestEntry.cash + latestEntry.investments - latestEntry.debt)
        : 0;

      return {
        ...account,
        latestEntry,
        netWorth
      };
    });
  }
}

