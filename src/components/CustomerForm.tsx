import { useState, useEffect } from 'react';
import { Customer, emptyCustomer, calculateEmiEndMonth } from '@/lib/customer-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
          <Label htmlFor="loan_id">Loan ID *</Label>
          <Input id="loan_id" required value={form.loan_id} onChange={(e) => set('loan_id', e.target.value)} placeholder="LN-00123" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name">Customer name *</Label>
          <Input id="name" required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ramesh Kumar" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="relation_type">Relation</Label>
          <Select value={form.relation_type} onValueChange={(value) => set('relation_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select relation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S/O">S/O (Son of)</SelectItem>
              <SelectItem value="W/O">W/O (Wife of)</SelectItem>
              <SelectItem value="D/O">D/O (Daughter of)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="relation_name">Relation name</Label>
          <Input id="relation_name" value={form.relation_name} onChange={(e) => set('relation_name', e.target.value)} placeholder="Father/Husband/Parent name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dob">Date of birth</Label>
          <Input id="dob" type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="adhar_number">Adhar number</Label>
          <Input id="adhar_number" value={form.adhar_number} onChange={(e) => set('adhar_number', e.target.value)} placeholder="1234-5678-9012" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="mobile">Mobile number *</Label>
          <Input id="mobile" required inputMode="tel" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="9876543210" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="at">AT</Label>
          <Input id="at" value={form.at} onChange={(e) => set('at', e.target.value)} placeholder="House/Shop No." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="po">PO</Label>
          <Input id="po" value={form.po} onChange={(e) => set('po', e.target.value)} placeholder="Post Office" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ps">PS</Label>
          <Input id="ps" value={form.ps} onChange={(e) => set('ps', e.target.value)} placeholder="Police Station" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dist">DIST</Label>
          <Input id="dist" value={form.dist} onChange={(e) => set('dist', e.target.value)} placeholder="District" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="landmark">LANDMARK</Label>
          <Input id="landmark" value={form.landmark} onChange={(e) => set('landmark', e.target.value)} placeholder="Near..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="state">STATE</Label>
          <Input id="state" value={form.state} onChange={(e) => set('state', e.target.value)} placeholder="State" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pin">PIN</Label>
          <Input id="pin" value={form.pin} onChange={(e) => set('pin', e.target.value)} placeholder="123456" />
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
          <Label htmlFor="disb_amount">Disb. amount (₹)</Label>
          <Input id="disb_amount" type="number" min="0" step="0.01" value={form.disb_amount} onChange={(e) => set('disb_amount', e.target.value)} placeholder="500000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b_loan_amount">B. Loan amount (₹)</Label>
          <Input id="b_loan_amount" type="number" min="0" step="0.01" value={form.b_loan_amount} onChange={(e) => set('b_loan_amount', e.target.value)} placeholder="450000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="disb_date">Disb. Date</Label>
          <Input id="disb_date" type="date" value={form.disb_date} onChange={(e) => set('disb_date', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="utr_number">UTR Number</Label>
          <Input id="utr_number" value={form.utr_number} onChange={(e) => set('utr_number', e.target.value)} placeholder="UTR123456789" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="engine_number">Engine Number</Label>
          <Input id="engine_number" value={form.engine_number} onChange={(e) => set('engine_number', e.target.value)} placeholder="ENGINE123456" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="frame_number">Frame Number</Label>
          <Input id="frame_number" value={form.frame_number} onChange={(e) => set('frame_number', e.target.value)} placeholder="FRAME789012" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sales_point">Sales point</Label>
          <Select value={form.sales_point} onValueChange={(value) => set('sales_point', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sales point" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MAA SANTOSHI AUTOMOBILES">MAA SANTOSHI AUTOMOBILES</SelectItem>
              <SelectItem value="ATIKSH BAJAJ">ATIKSH BAJAJ</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
