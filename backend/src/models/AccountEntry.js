import db from '../config/database.js';

export class AccountEntry {
  static create(accountId, entryDate, cash, investments, debt) {
    const stmt = db.prepare(`
      INSERT INTO account_entries (account_id, entry_date, cash, investments, debt) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(accountId, entryDate, cash, investments, debt);
    return result.lastInsertRowid;
  }

  static findByAccountId(accountId) {
    const stmt = db.prepare(`
      SELECT * FROM account_entries 
      WHERE account_id = ? 
      ORDER BY entry_date ASC
    `);
    return stmt.all(accountId);
  }

  static update(id, accountId, entryDate, cash, investments, debt) {
    const stmt = db.prepare(`
      UPDATE account_entries 
      SET entry_date = ?, cash = ?, investments = ?, debt = ? 
      WHERE id = ? AND account_id = ?
    `);
    const result = stmt.run(entryDate, cash, investments, debt, id, accountId);
    return result.changes > 0;
  }

  static delete(id, accountId) {
    const stmt = db.prepare('DELETE FROM account_entries WHERE id = ? AND account_id = ?');
    const result = stmt.run(id, accountId);
    return result.changes > 0;
  }

  static findById(id, accountId) {
    const stmt = db.prepare('SELECT * FROM account_entries WHERE id = ? AND account_id = ?');
    return stmt.get(id, accountId);
  }
}

