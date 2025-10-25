import express from 'express';
import { Account } from '../models/Account.js';
import { AccountEntry } from '../models/AccountEntry.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all accounts for logged-in user
router.get('/', (req, res) => {
  try {
    const accounts = Account.getAllWithLatestEntry(req.user.id);
    res.json(accounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Get single account with all entries
router.get('/:id', (req, res) => {
  try {
    const account = Account.getWithEntries(req.params.id, req.user.id);
    
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

// Create new account
router.post('/', (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Account name is required' });
    }

    const accountId = Account.create(req.user.id, name.trim());
    const account = Account.findById(accountId, req.user.id);

    res.status(201).json(account);
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Update account
router.put('/:id', (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Account name is required' });
    }

    const success = Account.update(req.params.id, req.user.id, name.trim());
    
    if (!success) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const account = Account.findById(req.params.id, req.user.id);
    res.json(account);
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Failed to update account' });
  }
});

// Delete account
router.delete('/:id', (req, res) => {
  try {
    const success = Account.delete(req.params.id, req.user.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Add entry to account
router.post('/:id/entries', (req, res) => {
  try {
    const { entry_date, cash, investments, debt } = req.body;

    // Verify account belongs to user
    const account = Account.findById(req.params.id, req.user.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (!entry_date) {
      return res.status(400).json({ error: 'Entry date is required' });
    }

    const entryId = AccountEntry.create(
      req.params.id,
      entry_date,
      cash || 0,
      investments || 0,
      debt || 0
    );

    const entry = AccountEntry.findById(entryId, req.params.id);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Create entry error:', error);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// Update entry
router.put('/:accountId/entries/:entryId', (req, res) => {
  try {
    const { entry_date, cash, investments, debt } = req.body;

    // Verify account belongs to user
    const account = Account.findById(req.params.accountId, req.user.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (!entry_date) {
      return res.status(400).json({ error: 'Entry date is required' });
    }

    const success = AccountEntry.update(
      req.params.entryId,
      req.params.accountId,
      entry_date,
      cash || 0,
      investments || 0,
      debt || 0
    );

    if (!success) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    const entry = AccountEntry.findById(req.params.entryId, req.params.accountId);
    res.json(entry);
  } catch (error) {
    console.error('Update entry error:', error);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// Delete entry
router.delete('/:accountId/entries/:entryId', (req, res) => {
  try {
    // Verify account belongs to user
    const account = Account.findById(req.params.accountId, req.user.id);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const success = AccountEntry.delete(req.params.entryId, req.params.accountId);
    
    if (!success) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Delete entry error:', error);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

export default router;

