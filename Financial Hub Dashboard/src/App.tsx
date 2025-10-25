import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { AccountManager } from './components/AccountManager';
import { EntryManager } from './components/EntryManager';
import { api } from './services/api';
import { LogOut } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const authenticated = api.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setUser(api.getUser());
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setUser(api.getUser());
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setUser(null);
    setSelectedAccountId(null);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Hub</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Account List */}
          <div className="lg:col-span-1">
            <AccountManager
              onSelectAccount={setSelectedAccountId}
              selectedAccountId={selectedAccountId}
            />
          </div>

          {/* Main Content - Entry Manager */}
          <div className="lg:col-span-2">
            {selectedAccountId ? (
              <EntryManager accountId={selectedAccountId} />
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                <p>Select an account to view and manage entries</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

