export interface AccountData {
  id: string;
  name: string;
  changePercent: number;
  totalAmount: number;
  percentToGoal: number;
  cash: { month: string; value: number }[];
  investments: { month: string; value: number }[];
  debt: { month: string; value: number }[];
}

export const accountsData: AccountData[] = [
  {
    id: 'account1',
    name: 'Account #1',
    changePercent: 12.45,
    totalAmount: 45230,
    percentToGoal: 78,
    cash: [
      { month: 'Jan', value: 8000 },
      { month: 'Feb', value: 8500 },
      { month: 'Mar', value: 8200 },
      { month: 'Apr', value: 9000 },
      { month: 'May', value: 9500 },
      { month: 'Jun', value: 10200 },
    ],
    investments: [
      { month: 'Jan', value: 25000 },
      { month: 'Feb', value: 27000 },
      { month: 'Mar', value: 26500 },
      { month: 'Apr', value: 29000 },
      { month: 'May', value: 31500 },
      { month: 'Jun', value: 35030 },
    ],
    debt: [
      { month: 'Jan', value: 15000 },
      { month: 'Feb', value: 14200 },
      { month: 'Mar', value: 13500 },
      { month: 'Apr', value: 12800 },
      { month: 'May', value: 12000 },
      { month: 'Jun', value: 11000 },
    ],
  },
  {
    id: 'account2',
    name: 'Account #2',
    changePercent: -3.28,
    totalAmount: 28750,
    percentToGoal: 45,
    cash: [
      { month: 'Jan', value: 5000 },
      { month: 'Feb', value: 4800 },
      { month: 'Mar', value: 4600 },
      { month: 'Apr', value: 4500 },
      { month: 'May', value: 4300 },
      { month: 'Jun', value: 4200 },
    ],
    investments: [
      { month: 'Jan', value: 32000 },
      { month: 'Feb', value: 31500 },
      { month: 'Mar', value: 30800 },
      { month: 'Apr', value: 29500 },
      { month: 'May', value: 28200 },
      { month: 'Jun', value: 24550 },
    ],
    debt: [
      { month: 'Jan', value: 8000 },
      { month: 'Feb', value: 8200 },
      { month: 'Mar', value: 8500 },
      { month: 'Apr', value: 8800 },
      { month: 'May', value: 9100 },
      { month: 'Jun', value: 9400 },
    ],
  },
  {
    id: 'account3',
    name: 'Account #3',
    changePercent: 8.92,
    totalAmount: 62100,
    percentToGoal: 92,
    cash: [
      { month: 'Jan', value: 12000 },
      { month: 'Feb', value: 12500 },
      { month: 'Mar', value: 13000 },
      { month: 'Apr', value: 13800 },
      { month: 'May', value: 14500 },
      { month: 'Jun', value: 15200 },
    ],
    investments: [
      { month: 'Jan', value: 38000 },
      { month: 'Feb', value: 39500 },
      { month: 'Mar', value: 41000 },
      { month: 'Apr', value: 42500 },
      { month: 'May', value: 44800 },
      { month: 'Jun', value: 46900 },
    ],
    debt: [
      { month: 'Jan', value: 5000 },
      { month: 'Feb', value: 4600 },
      { month: 'Mar', value: 4200 },
      { month: 'Apr', value: 3800 },
      { month: 'May', value: 3400 },
      { month: 'Jun', value: 3000 },
    ],
  },
  {
    id: 'account4',
    name: 'Account #4',
    changePercent: -1.15,
    totalAmount: 19850,
    percentToGoal: 38,
    cash: [
      { month: 'Jan', value: 6000 },
      { month: 'Feb', value: 5900 },
      { month: 'Mar', value: 5800 },
      { month: 'Apr', value: 5700 },
      { month: 'May', value: 5600 },
      { month: 'Jun', value: 5500 },
    ],
    investments: [
      { month: 'Jan', value: 18000 },
      { month: 'Feb', value: 17800 },
      { month: 'Mar', value: 17200 },
      { month: 'Apr', value: 16500 },
      { month: 'May', value: 15800 },
      { month: 'Jun', value: 14350 },
    ],
    debt: [
      { month: 'Jan', value: 3500 },
      { month: 'Feb', value: 3600 },
      { month: 'Mar', value: 3700 },
      { month: 'Apr', value: 3800 },
      { month: 'May', value: 3900 },
      { month: 'Jun', value: 4000 },
    ],
  },
];
