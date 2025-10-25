import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AccountChart } from './AccountChart';
import { accountsData } from './data';

interface DashboardProps {
  selectedAccountId: string;
  onAccountChange: (id: string) => void;
}

export function Dashboard({ selectedAccountId, onAccountChange }: DashboardProps) {
  const selectedAccount = accountsData.find(acc => acc.id === selectedAccountId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="text-slate-600">Account</span>
        <Select value={selectedAccountId} onValueChange={onAccountChange}>
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {accountsData.map(account => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="p-6">
        <AccountChart data={selectedAccount?.chartData || []} />
      </Card>

      <Tabs defaultValue="cash" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cash">CASH</TabsTrigger>
          <TabsTrigger value="investments">INVESTMENTS</TabsTrigger>
          <TabsTrigger value="debt">Debt</TabsTrigger>
        </TabsList>
        <TabsContent value="cash" className="mt-4">
          <Card className="p-6">
            <h3 className="mb-4 text-slate-900">Cash Accounts</h3>
            <div className="space-y-2">
              {accountsData
                .filter(acc => acc.type === 'cash')
                .map(acc => (
                  <div key={acc.id} className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-600">{acc.name}</span>
                    <span className="text-slate-900">${acc.amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="investments" className="mt-4">
          <Card className="p-6">
            <h3 className="mb-4 text-slate-900">Investment Accounts</h3>
            <div className="space-y-2">
              {accountsData
                .filter(acc => acc.type === 'investment')
                .map(acc => (
                  <div key={acc.id} className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-600">{acc.name}</span>
                    <span className="text-slate-900">${acc.amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="debt" className="mt-4">
          <Card className="p-6">
            <h3 className="mb-4 text-slate-900">Debt Accounts</h3>
            <div className="space-y-2">
              {accountsData
                .filter(acc => acc.type === 'debt')
                .map(acc => (
                  <div key={acc.id} className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-600">{acc.name}</span>
                    <span className="text-red-600">-${acc.amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
