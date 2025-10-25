import { Card } from './ui/card';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { accountsData } from './data/accountsData';
import { Progress } from './ui/progress';

interface AccountsSidebarProps {
  selectedAccount: string;
  onAccountSelect: (accountId: string) => void;
}

export function AccountsSidebar({ selectedAccount, onAccountSelect }: AccountsSidebarProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-slate-900">All accounts</h2>
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-slate-100"
        >
          <SlidersHorizontal className="h-5 w-5 text-slate-600" />
        </Button>
      </div>

      <div className="space-y-4">
        {accountsData.map((account) => (
          <button
            key={account.id}
            onClick={() => onAccountSelect(account.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
              selectedAccount === account.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  account.changePercent >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <h3 className="text-slate-900">{account.name}</h3>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">% change</span>
                <span className={account.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {account.changePercent > 0 ? '+' : ''}{account.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total amount</span>
                <span className="text-slate-900">${account.totalAmount.toLocaleString()}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">% to goal</span>
                  <span className="text-slate-900">{account.percentToGoal}%</span>
                </div>
                <Progress 
                  value={account.percentToGoal} 
                  className="h-2"
                  indicatorClassName={
                    account.percentToGoal >= 75 ? 'bg-green-500' :
                    account.percentToGoal >= 50 ? 'bg-blue-500' :
                    'bg-red-500'
                  }
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
