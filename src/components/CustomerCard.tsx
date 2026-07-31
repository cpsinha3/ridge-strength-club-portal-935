import { Customer, formatMoney, formatMonth, formatDate } from '@/lib/customer-types';
import { Phone, MapPin, CalendarClock, Store, Cake, Pencil, Trash2, Receipt, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  customer: Customer;
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
}

export default function CustomerCard({ customer: c, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-base leading-tight">{c.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-muted-foreground font-mono">{c.loan_id}</p>
            {c.sfdc_id && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-carbon-lighter px-1.5 py-0.5 rounded">
                <Hash className="w-3 h-3" /> {c.sfdc_id}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button size="icon" variant="ghost" onClick={() => onEdit(c)} aria-label="Edit">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(c)} aria-label="Delete">
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4 shrink-0" /> <span>{c.mobile || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Cake className="w-4 h-4 shrink-0" /> <span>{formatDate(c.dob)}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Receipt className="w-4 h-4 shrink-0" />
          <span>{formatMoney(c.emi_amount)} × {c.emi_tenure || 0} months</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarClock className="w-4 h-4 shrink-0" />
          <span>
            {c.starting_month ? (
              <>
                {formatMonth(c.starting_month)}
                {c.emi_end_month && <> → {formatMonth(c.emi_end_month)}</>}
              </>
            ) : '—'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Store className="w-4 h-4 shrink-0" /> <span>{c.sales_point || '—'}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> <span>{c.address || '—'}</span>
        </div>
      </div>

      {c.notes && <p className="text-xs text-muted-foreground border-t border-border pt-2">{c.notes}</p>}
    </div>
  );
}
