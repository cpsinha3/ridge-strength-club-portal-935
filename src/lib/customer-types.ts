export interface Customer {
  _row_id?: number;
  sfdc_id: string;
  name: string;
  relation_type: string;
  relation_name: string;
  mobile: string;
  loan_id: string;
  emi_amount: number | string;
  emi_tenure: number | string;
  disb_amount: number | string;
  b_loan_amount: number | string;
  disb_date: string;
  utr_number: string;
  starting_month: string;
  emi_end_month: string;
  sales_point: string;
  dob: string;
  adhar_number: string;
  at: string;
  po: string;
  ps: string;
  dist: string;
  landmark: string;
  state: string;
  pin: string;
  notes: string;
}

export const emptyCustomer: Customer = {
  sfdc_id: '',
  name: '',
  relation_type: '',
  relation_name: '',
  mobile: '',
  loan_id: '',
  emi_amount: '',
  emi_tenure: '',
  disb_amount: '',
  b_loan_amount: '',
  disb_date: '',
  utr_number: '',
  starting_month: '',
  emi_end_month: '',
  sales_point: '',
  dob: '',
  adhar_number: '',
  at: '',
  po: '',
  ps: '',
  dist: '',
  landmark: '',
  state: '',
  pin: '',
  notes: '',
};

export function formatMoney(v: number | string) {
  const n = Number(v || 0);
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function formatMonth(v: string) {
  if (!v) return '—';
  const [y, m] = v.split('-');
  if (!y || !m) return v;
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

export function formatDate(v: string) {
  if (!v) return '—';
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function calculateEmiEndMonth(startingMonth: string, tenure: number | string): string {
  if (!startingMonth) return '';
  const months = Number(tenure || 0);
  if (months < 1) return '';
  const [y, m] = startingMonth.split('-').map(Number);
  if (!y || !m || isNaN(y) || isNaN(m)) return '';
  const endDate = new Date(y, m - 1 + months, 1);
  return endDate.toISOString().slice(0, 7); // YYYY-MM format
}
