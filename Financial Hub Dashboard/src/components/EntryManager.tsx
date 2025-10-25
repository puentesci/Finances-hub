import { useState, useEffect } from 'react';
import { api, Account, AccountEntry } from '../services/api';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EntryManagerProps {
  accountId: number;
}

export function EntryManager({ accountId }: EntryManagerProps) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split('T')[0],
    cash: 0,
    investments: 0,
    debt: 0,
  });

  useEffect(() => {
    loadAccount();
  }, [accountId]);

  const loadAccount = async () => {
    try {
      setLoading(true);
      const data = await api.getAccount(accountId);
      setAccount(data);
    } catch (error) {
      console.error('Failed to load account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.createEntry(
        accountId,
        formData.entry_date,
        formData.cash,
        formData.investments,
        formData.debt
      );
      setFormData({
        entry_date: new Date().toISOString().split('T')[0],
        cash: 0,
        investments: 0,
        debt: 0,
      });
      setShowAddForm(false);
      await loadAccount();
    } catch (error) {
      console.error('Failed to create entry:', error);
      alert('Failed to create entry');
    }
  };

  const handleDeleteEntry = async (entryId: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      await api.deleteEntry(accountId, entryId);
      await loadAccount();
    } catch (error) {
      console.error('Failed to delete entry:', error);
      alert('Failed to delete entry');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateNetWorth = (entry: AccountEntry) => {
    return entry.cash + entry.investments - entry.debt;
  };

  const getChartData = () => {
    if (!account?.entries) return [];
    
    return account.entries.map((entry) => ({
      date: formatDate(entry.entry_date),
      'Net Worth': calculateNetWorth(entry),
      Cash: entry.cash,
      Investments: entry.investments,
      Debt: -entry.debt,
    }));
  };

  const calculateChange = () => {
    if (!account?.entries || account.entries.length < 2) return null;
    
    const entries = account.entries;
    const latest = calculateNetWorth(entries[entries.length - 1]);
    const previous = calculateNetWorth(entries[entries.length - 2]);
    const change = latest - previous;
    const percentChange = (change / Math.abs(previous)) * 100;
    
    return { amount: change, percent: percentChange };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Loading account data...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Account not found</p>
      </div>
    );
  }

  const change = calculateChange();
  const latestNetWorth = account.entries && account.entries.length > 0
    ? calculateNetWorth(account.entries[account.entries.length - 1])
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{account.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium mb-1">Current Net Worth</p>
            <p className="text-2xl font-bold text-blue-900">{formatCurrency(latestNetWorth)}</p>
            {change && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${change.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change.amount >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{change.amount >= 0 ? '+' : ''}{formatCurrency(change.amount)} ({change.percent.toFixed(2)}%)</span>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium mb-1">Total Entries</p>
            <p className="text-2xl font-bold text-green-900">{account.entries?.length || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium mb-1">Last Updated</p>
            <p className="text-lg font-bold text-purple-900">
              {account.entries && account.entries.length > 0
                ? formatDate(account.entries[account.entries.length - 1].entry_date)
                : 'No entries yet'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add New Entry
        </button>

        {showAddForm && (
          <form onSubmit={handleAddEntry} className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.entry_date}
                  onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cash</label>
                <input
                  type="number"
                  value={formData.cash}
                  onChange={(e) => setFormData({ ...formData, cash: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investments</label>
                <input
                  type="number"
                  value={formData.investments}
                  onChange={(e) => setFormData({ ...formData, investments: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Debt</label>
                <input
                  type="number"
                  value={formData.debt}
                  onChange={(e) => setFormData({ ...formData, debt: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Entry
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Chart */}
      {account.entries && account.entries.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Net Worth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line type="monotone" dataKey="Net Worth" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="Cash" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Investments" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="Debt" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Entries List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Entry History</h3>
        </div>

        {!account.entries || account.entries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No entries yet. Add your first entry to start tracking!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cash</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Investments</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debt</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Worth</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {account.entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(entry.entry_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(entry.cash)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(entry.investments)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                      {formatCurrency(entry.debt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      {formatCurrency(calculateNetWorth(entry))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

