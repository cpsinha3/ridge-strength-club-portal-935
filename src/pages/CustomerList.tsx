import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '@/lib/shared/kliv-database.js';
import { Customer, formatMoney } from '@/lib/customer-types';
import { PageSkeleton } from '@/components/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Download, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  const fetchCustomers = async () => {
    try {
      const data = await db.query('customers', { 
        order: '_created_at.desc', 
        limit: '1000' 
      });
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const searchTerm = search.toLowerCase();
      const filtered = customers.filter((customer) =>
        Object.values(customer).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
      setFilteredCustomers(filtered);
    }
  }, [search, customers]);

  const handleDelete = async (id: number | undefined, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    if (!id) return;
    
    try {
      await db.delete('customers', { _row_id: `eq.${id}` });
      toast.success('Customer deleted successfully');
      await fetchCustomers();
    } catch (error) {
      console.error('Failed to delete customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const handleExport = () => {
    const headers = ['SFDC ID', 'Name', 'Mobile', 'Loan ID', 'EMI Amount', 'Tenure', 'Disb. Amount', 'Start Month', 'End Month', 'Sales Point', 'Address', 'DOB', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...filteredCustomers.map((c) => [
        c.sfdc_id || '',
        c.name || '',
        c.mobile || '',
        c.loan_id || '',
        c.emi_amount || 0,
        c.emi_tenure || 0,
        c.disb_amount || 0,
        c.starting_month || '',
        c.emi_end_month || '',
        c.sales_point || '',
        c.address || '',
        c.dob || '',
        c.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Customers (Raw Data)</h1>
            <p className="text-sm text-muted-foreground">
              {filteredCustomers.length} {filteredCustomers.length === 1 ? 'record' : 'records'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={fetchCustomers} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search all fields..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-carbon-lighter border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-chalk">SFDC ID</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">Name</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">Mobile</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">Loan ID</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">EMI Amount</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">Tenure</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">Disb. Amount</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">Start Month</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">End Month</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">Sales Point</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">Address</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">DOB</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">Notes</th>
                <th className="px-4 py-3 text-left font-medium text-chalk">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-8 text-center text-muted-foreground">
                    {search ? 'No customers match your search' : 'No customers found'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._row_id} className="hover:bg-carbon-lighter/50">
                    <td className="px-4 py-3 text-chalk font-mono text-xs">{customer.sfdc_id || '-'}</td>
                    <td className="px-4 py-3 text-chalk font-medium">{customer.name || '-'}</td>
                    <td className="px-4 py-3 text-chalk">{customer.mobile || '-'}</td>
                    <td className="px-4 py-3 text-chalk font-mono text-xs">{customer.loan_id || '-'}</td>
                    <td className="px-4 py-3 text-chalk font-medium">{formatMoney(customer.emi_amount || 0)}</td>
                    <td className="px-4 py-3 text-chalk">{customer.emi_tenure || 0} months</td>
                    <td className="px-4 py-3 text-chalk font-medium">{formatMoney(customer.disb_amount || 0)}</td>
                    <td className="px-4 py-3 text-chalk text-xs">{customer.starting_month || '-'}</td>
                    <td className="px-4 py-3 text-chalk text-xs">{customer.emi_end_month || '-'}</td>
                    <td className="px-4 py-3 text-chalk">{customer.sales_point || '-'}</td>
                    <td className="px-4 py-3 text-chalk text-xs max-w-xs truncate">{customer.address || '-'}</td>
                    <td className="px-4 py-3 text-chalk text-xs">{customer.dob || '-'}</td>
                    <td className="px-4 py-3 text-chalk text-xs max-w-xs truncate">{customer.notes || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => navigate(`/customer/${customer._row_id}/edit`)}
                          title="Edit"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(customer._row_id, customer.name)}
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
        <div>
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}
