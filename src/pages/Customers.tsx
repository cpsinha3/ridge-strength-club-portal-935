import { useState, useEffect, useCallback } from 'react';
import db from '@/lib/shared/kliv-database.js';
import { Customer, formatMoney } from '@/lib/customer-types';
import CustomerForm from '@/components/CustomerForm';
import CustomerCard from '@/components/CustomerCard';
import StatCard from '@/components/StatCard';
import EmptyState from '@/components/EmptyState';
import { PageSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Users, Receipt, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function Customers() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const fetchRows = useCallback(async () => {
    const data = await db.query('customers', { order: '_created_at.desc', limit: '500' });
    setRows(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const handleSubmit = async (c: Customer) => {
    const payload = {
      sfdc_id: (c.sfdc_id || '').trim().toUpperCase(),
      name: c.name.trim(),
      mobile: c.mobile.trim(),
      address: c.address || '',
      loan_id: c.loan_id.trim(),
      emi_amount: Number(c.emi_amount || 0),
      emi_tenure: Number(c.emi_tenure || 0),
      starting_month: c.starting_month || '',
      emi_end_month: c.emi_end_month || '',
      sales_point: c.sales_point || '',
      dob: c.dob || '',
      notes: c.notes || '',
    };
    if (editing?._row_id) {
      await db.update('customers', { _row_id: `eq.${editing._row_id}` }, payload);
      toast.success('Customer updated');
    } else {
      await db.insert('customers', payload);
      toast.success('Customer saved');
    }
    setOpen(false);
    setEditing(null);
    await fetchRows();
  };

  const handleDelete = async (c: Customer) => {
    if (!confirm(`Delete ${c.name}?`)) return;
    await db.delete('customers', { _row_id: `eq.${c._row_id}` });
    toast.success('Customer deleted');
    await fetchRows();
  };

  const q = search.toLowerCase().trim();
  const filtered = q
    ? rows.filter((r) =>
        [r.name, r.mobile, r.loan_id, r.sales_point, r.sfdc_id].some((f) => (f || '').toLowerCase().includes(q))
      )
    : rows;

  const totalEmi = rows.reduce((s, r) => s + Number(r.emi_amount || 0), 0);
  const points = new Set(rows.map((r) => r.sales_point).filter(Boolean)).size;

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Records</h1>
          <p className="text-sm text-muted-foreground">Loans, EMI plans and contact details</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}>
          <Plus className="w-4 h-4 mr-1.5" /> Add customer
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard icon={Users} label="Customers" value={String(rows.length)} />
        <StatCard icon={Receipt} label="Monthly EMI total" value={formatMoney(totalEmi)} />
        <StatCard icon={Store} label="Sales points" value={String(points)} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, mobile, loan ID, SFDC ID or sales point"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={rows.length === 0 ? 'No customers yet' : 'No matches'}
          description={rows.length === 0 ? 'Add your first customer record to get started.' : 'Try a different search term.'}
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map((c) => (
            <CustomerCard key={c._row_id} customer={c} onEdit={(x) => { setEditing(x); setOpen(true); }} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit customer' : 'Add customer'}</DialogTitle>
          </DialogHeader>
          <CustomerForm
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => { setOpen(false); setEditing(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
