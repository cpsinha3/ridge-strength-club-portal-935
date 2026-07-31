import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import db from '@/lib/shared/kliv-database.js';
import StatCard from '@/components/StatCard';
import { PageSkeleton } from '@/components/LoadingSkeleton';
import { Building2, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();
  const [salesPoints, setSalesPoints] = useState<any[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get sales points with counts
        const result = await db.query('customers', {
          select: 'sales_point',
        });

        // Count customers by sales point
        const salesPointCounts: Record<string, number> = {};
        let totalCount = 0;

        result.forEach((customer: any) => {
          const point = customer.sales_point || 'Unknown';
          salesPointCounts[point] = (salesPointCounts[point] || 0) + 1;
          totalCount++;
        });

        // Convert to array and sort by count
        const sorted = Object.entries(salesPointCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setSalesPoints(sorted);
        setTotalCustomers(totalCount);
      } catch (err) {
        console.log('Failed to fetch sales points:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="/idfc-first-bank-logo.svg" 
                alt="IDFC First Bank" 
                className="h-16 mx-auto mb-6"
              />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Sales Point Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Track customer distribution across all sales points in real-time
              </p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto mb-12"
            >
              <StatCard
                icon={Building2}
                label="Sales Points"
                value={salesPoints.length}
                sub="Active locations"
              />
              <StatCard
                icon={Users}
                label="Total Customers"
                value={totalCustomers}
                sub="Across all points"
              />
              <StatCard
                icon={TrendingUp}
                label="Top Location"
                value={salesPoints[0]?.name || 'N/A'}
                sub={`${salesPoints[0]?.count || 0} customers`}
              />
              <div className="flex items-center justify-center p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-ember text-white font-medium hover:bg-ember-glow transition-colors"
                >
                  Login to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sales Points Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Sales Points Overview
        </motion.h2>

        {salesPoints.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No sales points found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {salesPoints.map((point, index) => (
              <motion.div
                key={point.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg hover:border-ember/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {point.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {point.count} customer{point.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-ember/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-ember" />
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Market Share</span>
                    <span className="font-medium text-ember">
                      {((point.count / totalCustomers) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-ember h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(point.count / totalCustomers) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 w-full py-2 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-ember/10 hover:text-ember transition-colors"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200 dark:border-slate-700">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          © 2024 IDFC First Bank. All rights reserved.
        </p>
      </div>
    </div>
  );
}