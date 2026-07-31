import { useState, useEffect } from 'react';
import { Customer, emptyCustomer, calculateEmiEndMonth } from '@/lib/customer-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Props {
  initial?: Customer;
  onSubmit: (c: Customer) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CustomerForm({ initial, onSubmit, onCancel, loading = false }: Props) {
  const [form, setForm] = useState<Customer>(initial ?? emptyCustomer);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof Customer, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Auto-calculate EMI end month when starting_month or emi_tenure changes
  useEffect(() => {
    const endMonth = calculateEmiEndMonth(form.starting_month, form.emi_tenure);
    if (endMonth !== form.emi_end_month) {
      setForm((f) => ({ ...f, emi_end_month: endMonth }));
    }
  }, [form.starting_month, form.emi_tenure]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sfdc_id">SFDC ID</Label>
          <Input id="sfdc_id" value={form.sfdc_id} onChange={(e) => set('sfdc_id', e.target.value)} placeholder="001AB..." className="uppercase" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Customer name *</Label>
          <Input id="name" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ramesh Kumar" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mobile">Mobile number *</Label>
          <Input id="mobile" required inputMode="tel" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="9876543210" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="loan_id">Loan ID *</Label>
          <Input id="loan_id" required value={form.loan_id} onChange={(e) => set('loan_id', e.target.value)} placeholder="LN-00123" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dob">Date of birth</Label>
          <Input id="dob" type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="emi_amount">EMI amount (₹)</Label>
          <Input id="emi_amount" type="number" min="0" step="0.01" value={form.emi_amount} onChange={(e) => set('emi_amount', e.target.value)} placeholder="4500" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="emi_tenure">EMI tenure (months)</Label>
          <Input id="emi_tenure" type="number" min="0" value={form.emi_tenure} onChange={(e) => set('emi_tenure', e.target.value)} placeholder="12" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="starting_month">Starting month</Label>
          <Input id="starting_month" type="month" value={form.starting_month} onChange={(e) => set('starting_month', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sales_point">Sales point</Label>
          <Input id="sales_point" value={form.sales_point} onChange={(e) => set('sales_point', e.target.value)} placeholder="Ridge Main Branch" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="House, street, city, pincode" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Optional remarks" />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving || loading}>Cancel</Button>
        <Button type="submit" disabled={saving || loading}>{saving || loading ? 'Saving…' : 'Save customer'}</Button>
      </div>
    </form>
  );
}
