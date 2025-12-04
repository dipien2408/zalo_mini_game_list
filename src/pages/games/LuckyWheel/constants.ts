export interface Prize {
  id: string;
  label: string;
  value: number;
  color: string;
  probability: number; // hehe you will never get it :))
  isSpecial?: boolean;
}

export const PRIZES: Prize[] = [
  { id: 'miss', label: 'Chúc may mắn lần sau', value: 0, color: '#94a3b8', probability: 30 }, 
  { id: '100', label: '100đ', value: 100, color: '#60a5fa', probability: 30 }, 
  { id: '200', label: '200đ', value: 200, color: '#34d399', probability: 15 },
  { id: '300', label: '300đ', value: 300, color: '#facc15', probability: 10 },
  { id: '500', label: '500đ', value: 500, color: '#fb923c', probability: 9 }, 
  { id: '1000', label: '1.000đ', value: 1000, color: '#f87171', probability: 5 },
  { id: 'special', label: 'ĐẶC BIỆT', value: 10000, color: '#c084fc', probability: 1, isSpecial: true }, 
];

export const INITIAL_SPINS = 2;
export const SPIN_DURATION = 3000;