import { useState } from 'react';
import { Header } from './components/Header';
import { AccountChart } from './components/AccountChart';
import { AccountsSidebar } from './components/AccountsSidebar';

export default function App() {
  const [selectedAccount, setSelectedAccount] = useState('account1');
  const [selectedCategory, setSelectedCategory] = useState<'cash' | 'investments' | 'debt'>('investments');

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AccountChart 
              selectedAccount={selectedAccount}
              selectedCategory={selectedCategory}
              onAccountChange={setSelectedAccount}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          
          <div className="lg:col-span-1">
            <AccountsSidebar 
              selectedAccount={selectedAccount}
              onAccountSelect={setSelectedAccount}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
