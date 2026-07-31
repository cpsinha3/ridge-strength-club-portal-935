import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '@/lib/shared/kliv-database.js';
import { Customer } from '@/lib/customer-types';
import CustomerForm from '@/components/CustomerForm';
import { toast } from 'sonner';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddCustomer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (customer: Customer) => {
    setLoading(true);
    try {
      const payload = {
        sfdc_id: (customer.sfdc_id || '').trim().toUpperCase(),
        name: customer.name.trim(),
        mobile: customer.mobile.trim(),
        address: customer.address || '',
        loan_id: customer.loan_id.trim(),
        emi_amount: Number(customer.emi_amount || 0),
        emi_tenure: Number(customer.emi_tenure || 0),
        starting_month: customer.starting_month || '',
        emi_end_month: customer.emi_end_month || '',
        sales_point: customer.sales_point || '',
        dob: customer.dob || '',
        notes: customer.notes || '',
      };

      await db.insert('customers', payload);
      toast.success('Customer added successfully!');
      navigate('/customers');
    } catch (error) {
      console.error('Failed to add customer:', error);
      toast.error('Failed to add customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-ember" />
            Add New Customer
          </h1>
          <p className="text-sm text-muted-foreground">Create a new customer record</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/customers')}
          loading={loading}
        />
      </div>
    </div>
  );
}
