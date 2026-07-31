import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import db from '@/lib/shared/kliv-database.js';
import { Customer } from '@/lib/customer-types';
import CustomerForm from '@/components/CustomerForm';
import { toast } from 'sonner';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      
      try {
        const result = await db.query('customers', {
          _row_id: `eq.${id}`
        });
        
        if (result.length > 0) {
          setCustomer(result[0]);
        } else {
          toast.error('Customer not found');
          navigate('/customers');
        }
      } catch (error) {
        console.error('Failed to fetch customer:', error);
        toast.error('Failed to load customer details');
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, navigate]);

  const handleSubmit = async (updatedCustomer: Customer) => {
    if (!customer || !id) return;
    
    setSubmitting(true);
    try {
      const payload = {
        sfdc_id: (updatedCustomer.sfdc_id || '').trim().toUpperCase(),
        name: updatedCustomer.name.trim(),
        relation_type: updatedCustomer.relation_type || '',
        relation_name: updatedCustomer.relation_name || '',
        mobile: updatedCustomer.mobile.trim(),
        loan_id: updatedCustomer.loan_id.trim(),
        emi_amount: Number(updatedCustomer.emi_amount || 0),
        emi_tenure: Number(updatedCustomer.emi_tenure || 0),
        disb_amount: Number(updatedCustomer.disb_amount || 0),
        b_loan_amount: Number(updatedCustomer.b_loan_amount || 0),
        disb_date: updatedCustomer.disb_date || '',
        utr_number: updatedCustomer.utr_number || '',
        engine_number: updatedCustomer.engine_number || '',
        frame_number: updatedCustomer.frame_number || '',
        starting_month: updatedCustomer.starting_month || '',
        emi_end_month: updatedCustomer.emi_end_month || '',
        sales_point: updatedCustomer.sales_point || '',
        dob: updatedCustomer.dob || '',
        adhar_number: updatedCustomer.adhar_number || '',
        at: updatedCustomer.at || '',
        po: updatedCustomer.po || '',
        ps: updatedCustomer.ps || '',
        dist: updatedCustomer.dist || '',
        landmark: updatedCustomer.landmark || '',
        state: updatedCustomer.state || '',
        pin: updatedCustomer.pin || '',
        notes: updatedCustomer.notes || '',
      };

      await db.update('customers', { _row_id: `eq.${id}` }, payload);
      toast.success('Customer updated successfully!');
      navigate('/customers');
    } catch (error) {
      console.error('Failed to update customer:', error);
      toast.error('Failed to update customer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-ember" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Customer not found</p>
        <Button onClick={() => navigate('/customers')} className="mt-4">
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Edit className="w-6 h-6 text-ember" />
            Edit Customer
          </h1>
          <p className="text-sm text-muted-foreground">Update customer information for {customer.name}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <CustomerForm
          initial={customer}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/customers')}
          loading={submitting}
        />
      </div>
    </div>
  );
}
