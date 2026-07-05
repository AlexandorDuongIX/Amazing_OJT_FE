export interface Promotion {
  key: string;
  name: string;
  code: string;
  value: string; // Ví dụ: '15%' hoặc '$50'
  validFrom: string; // Định dạng YYYY-MM-DD
  validTo: string;   // Định dạng YYYY-MM-DD
  status: 'Active' | 'Expired' | 'Pending';
}

export const mockPromotions: Promotion[] = [
  {
    key: '1',
    name: 'Summer Sale 2026',
    code: 'SUMMER26',
    value: '15%',
    validFrom: '2026-06-01',
    validTo: '2026-08-31',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Welcome New User',
    code: 'WELCOME50',
    value: '$50',
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    status: 'Active',
  },
  {
    key: '3',
    name: 'Black Friday Shock',
    code: 'BF2025',
    value: '30%',
    validFrom: '2025-11-20',
    validTo: '2025-11-30',
    status: 'Expired',
  },
];