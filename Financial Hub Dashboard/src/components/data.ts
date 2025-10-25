export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'investment' | 'debt';
  amount: number;
  changePercent: number;
  goal: number;
  goalPercent: number;
  chartData: { month: string; value: number }[];
}

export const accountsData: Account[] = [
  {
    id: '1',
    name: 'Checking Account',
    type: 'cash',
    amount: 5240,
    changePercent: 3.2,
    goal: 10000,
    goalPercent: 52,
    chartData: [
      { month: 'Jan', value: 4200 },
      { month: 'Feb', value: 4100 },
      { month: 'Mar', value: 4500 },
      { month: 'Apr', value: 4400 },
      { month: 'May', value: 4800 },
      { month: 'Jun', value: 4900 },
      { month: 'Jul', value: 5240 },
    ],
  },
  {
    id: '2',
    name: 'Savings Account',
    type: 'cash',
    amount: 12850,
    changePercent: 5.7,
    goal: 20000,
    goalPercent: 64,
    chartData: [
      { month: 'Jan', value: 11000 },
      { month: 'Feb', value: 11200 },
      { month: 'Mar', value: 11500 },
      { month: 'Apr', value: 11800 },
      { month: 'May', value: 12100 },
      { month: 'Jun', value: 12400 },
      { month: 'Jul', value: 12850 },
    ],
  },
  {
    id: '3',
    name: '401k Retirement',
    type: 'investment',
    amount: 45320,
    changePercent: 12.4,
    goal: 100000,
    goalPercent: 45,
    chartData: [
      { month: 'Jan', value: 38000 },
      { month: 'Feb', value: 39500 },
      { month: 'Mar', value: 40200 },
      { month: 'Apr', value: 41800 },
      { month: 'May', value: 43000 },
      { month: 'Jun', value: 44100 },
      { month: 'Jul', value: 45320 },
    ],
  },
  {
    id: '4',
    name: 'Stock Portfolio',
    type: 'investment',
    amount: 23100,
    changePercent: -2.3,
    goal: 50000,
    goalPercent: 46,
    chartData: [
      { month: 'Jan', value: 24500 },
      { month: 'Feb', value: 25000 },
      { month: 'Mar', value: 24200 },
      { month: 'Apr', value: 23800 },
      { month: 'May', value: 23500 },
      { month: 'Jun', value: 23200 },
      { month: 'Jul', value: 23100 },
    ],
  },
  {
    id: '5',
    name: 'Credit Card',
    type: 'debt',
    amount: 2340,
    changePercent: -8.1,
    goal: 0,
    goalPercent: 100,
    chartData: [
      { month: 'Jan', value: 3200 },
      { month: 'Feb', value: 3100 },
      { month: 'Mar', value: 2900 },
      { month: 'Apr', value: 2700 },
      { month: 'May', value: 2600 },
      { month: 'Jun', value: 2450 },
      { month: 'Jul', value: 2340 },
    ],
  },
  {
    id: '6',
    name: 'Student Loan',
    type: 'debt',
    amount: 18500,
    changePercent: -3.5,
    goal: 0,
    goalPercent: 72,
    chartData: [
      { month: 'Jan', value: 20000 },
      { month: 'Feb', value: 19750 },
      { month: 'Mar', value: 19500 },
      { month: 'Apr', value: 19250 },
      { month: 'May', value: 19000 },
      { month: 'Jun', value: 18750 },
      { month: 'Jul', value: 18500 },
    ],
  },
];
