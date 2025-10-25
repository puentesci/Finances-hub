import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { accountsData } from './data/accountsData';

interface AccountChartProps {
  selectedAccount: string;
  selectedCategory: 'cash' | 'investments' | 'debt';
  onAccountChange: (account: string) => void;
  onCategoryChange: (category: 'cash' | 'investments' | 'debt') => void;
}

export function AccountChart({ 
  selectedAccount, 
  selectedCategory,
  onAccountChange,
  onCategoryChange 
}: AccountChartProps) {
  const account = accountsData.find(acc => acc.id === selectedAccount);
  const chartData = account?.[selectedCategory] || [];
  const changePercent = account?.changePercent || 0;
  
  const lineColor = changePercent >= 0 ? '#10b981' : '#ef4444';

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-slate-600">Account #</span>
          <Select value={selectedAccount} onValueChange={onAccountChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {accountsData.map(acc => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Change:</span>
          <span className={changePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={lineColor}
              strokeWidth={3}
              dot={{ fill: lineColor, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-2 border-t pt-4">
        <button
          onClick={() => onCategoryChange('cash')}
          className={`flex-1 py-3 px-4 border-2 rounded-lg transition-colors ${
            selectedCategory === 'cash'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          CASH
        </button>
        <button
          onClick={() => onCategoryChange('investments')}
          className={`flex-1 py-3 px-4 border-2 rounded-lg transition-colors ${
            selectedCategory === 'investments'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          INVESTMENTS
        </button>
        <button
          onClick={() => onCategoryChange('debt')}
          className={`flex-1 py-3 px-4 border-2 rounded-lg transition-colors ${
            selectedCategory === 'debt'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          DEBT
        </button>
      </div>
    </Card>
  );
}
