import { useState, useEffect } from 'react';
import { api, Account } from '../services/api';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface AccountManagerProps {
  onSelectAccount: (accountId: number) => void;
  selectedAccountId: number | null;
}

export function AccountManager({ onSelectAccount, selectedAccountId }: AccountManagerProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAccountName, setNewAccountName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await api.getAccounts();
      setAccounts(data);
      if (data.length > 0 && !selectedAccountId) {
        onSelectAccount(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName.trim()) return;

    try {
      await api.createAccount(newAccountName);
      setNewAccountName('');
      setShowAddForm(false);
      await loadAccounts();
    } catch (error) {
      console.error('Failed to create account:', error);
      alert('Failed to create account');
    }
  };

  const handleUpdateAccount = async (id: number) => {
    if (!editingName.trim()) return;

    try {
      await api.updateAccount(id, editingName);
      setEditingId(null);
      setEditingName('');
      await loadAccounts();
    } catch (error) {
      console.error('Failed to update account:', error);
      alert('Failed to update account');
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (!confirm('Are you sure you want to delete this account? All entries will be lost.')) {
      return;
    }

    try {
      await api.deleteAccount(id);
      await loadAccounts();
      if (selectedAccountId === id && accounts.length > 1) {
        const nextAccount = accounts.find((a) => a.id !== id);
        if (nextAccount) onSelectAccount(nextAccount.id);
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Loading accounts...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Accounts</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Account
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddAccount} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="Account name (e.g., Savings, Investment)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewAccountName('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                <X size={18} />
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {accounts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No accounts yet. Create your first account to get started!</p>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedAccountId === account.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
              onClick={() => onSelectAccount(account.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {editingId === account.id ? (
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateAccount(account.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditingName('');
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-gray-900">{account.name}</h3>
                      <p className="text-sm text-gray-500">
                        Net Worth: {formatCurrency(account.netWorth || 0)}
                      </p>
                    </>
                  )}
                </div>
                {editingId !== account.id && (
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditingId(account.id);
                        setEditingName(account.name);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

