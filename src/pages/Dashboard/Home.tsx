import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useAuth } from '../../context/UserContext';
import PageMeta from "../../components/common/PageMeta";
import api from '../../axiosInstance';

const WalletAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('3d');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics?range=${timeRange}`);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);


  // Chart options for wallet balances
  const balanceChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['E-Wallet', 'Main Wallet'],
    },
    yaxis: {
      title: { text: 'Amount (₹)' },
      labels: {
        formatter: function (val) {
          return "₹" + (val || 0).toFixed(2);
        }
      }
    },
    fill: { opacity: 1 },
    colors: ['#3B82F6', '#10B981'],
    tooltip: {
      y: {
        formatter: function (val) {
          return "₹" + (val || 0).toFixed(2);
        }
      }
    }
  };

  // Chart options for transaction types
  const transactionTypeOptions = {
    chart: { type: 'donut' },
    labels: ['Pay-In', 'Pay-Out', 'Transfers', 'Charges'],
    colors: ['#10B981', '#EF4444', '#3B82F6', '#F59E0B'],
    legend: { position: 'bottom' },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: 200 },
        legend: { position: 'bottom' }
      }
    }],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => {
                const total = (analytics?.payIns?.totalAmount || 0) +
                  (analytics?.payOuts?.totalAmount || 0) +
                  (analytics?.ewalletTransactions?.debitAmount || 0) +
                  (analytics?.ewalletTransactions?.totalCharges || 0);
                return '₹' + (total || 0).toFixed(2);
              }
            }
          }
        }
      }
    }
  };

  // Chart options for daily volume
  const volumeChartOptions = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      categories: analytics?.dailyData?.dates || [],
      labels: { rotate: -45 }
    },
    yaxis: {
      title: { text: 'Amount (₹)' },
      labels: {
        formatter: function (val) {
          return "₹" + (val || 0).toFixed(2);
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    colors: ['#10B981', '#EF4444', '#3B82F6'],
    tooltip: {
      y: {
        formatter: function (val) {
          return "₹" + (val || 0).toFixed(2);
        }
      }
    }
  };

  // Check for negative balances
  const hasNegativeBalance =
    (user.role === 'Admin' || user.role === 'Manager')
      ? ((analytics?.totalEWalletBalance || 0) < 0 || (analytics?.totalMainWalletBalance || 0) < 0)
      : ((analytics?.eWalletBalance || 0) < 0 || (analytics?.mainWalletBalance || 0) < 0);


  const renderBalanceCard = (title, value, icon, color) => {
    const isNegative = value < 0;
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color.bg} ${color.text}`}>
            {icon}
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </p>
            <p className={`text-2xl font-semibold ${isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
              ₹{(value || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3">
      <PageMeta
        title="Analytics Dashboard"
        description="Comprehensive view of wallet transactions and balances"
      />

      {/* Time Range Selector */}
      {/* <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          {rangeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTimeRange(option.value)}
              className={`px-4 py-2 text-sm font-medium ${timeRange === option.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                } border border-gray-300 dark:border-gray-600 ${option.value === '3d' ? 'rounded-l-md' : ''} ${option.value === '1y' ? 'rounded-r-md' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>  */}
      <>
        {/* Negative Balance Alert */}
        {hasNegativeBalance && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Negative Balance Alert
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>
                    {(user.role === 'Admin' || user.role === 'Manager') ? (
                      <>
                        {(analytics?.totalEWalletBalance || 0) < 0 && (
                          <>Total E-Wallet has negative balance: <span className="font-bold">₹{(analytics?.totalEWalletBalance || 0).toFixed(2)}</span></>
                        )}
                        {(analytics?.totalEWalletBalance || 0) < 0 && (analytics?.totalMainWalletBalance || 0) < 0 && ' and '}
                        {(analytics?.totalMainWalletBalance || 0) < 0 && (
                          <>Total Main Wallet has negative balance: <span className="font-bold">₹{(analytics?.totalMainWalletBalance || 0).toFixed(2)}</span></>
                        )}
                      </>
                    ) : (
                      <>
                        {(analytics?.eWalletBalance || 0) < 0 && (
                          <>Your E-Wallet has negative balance: <span className="font-bold">₹{(analytics?.eWalletBalance || 0).toFixed(2)}</span></>
                        )}
                        {(analytics?.eWalletBalance || 0) < 0 && (analytics?.mainWalletBalance || 0) < 0 && ' and '}
                        {(analytics?.mainWalletBalance || 0) < 0 && (
                          <>Your Main Wallet has negative balance: <span className="font-bold">₹{(analytics?.mainWalletBalance || 0).toFixed(2)}</span></>
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* E-Wallet Balance */}
          {renderBalanceCard(
            user.role === 'Admin' || user.role === 'Manager' ? 'Total E-Wallet Balance' : 'Your E-Wallet Balance',
            user.role === 'Admin' || user.role === 'Manager' ? analytics?.totalEWalletBalance : analytics?.eWalletBalance,
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
            { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-300' }
          )}

          {/* Main Wallet Balance */}
          {renderBalanceCard(
            user.role === 'Admin' || user.role === 'Manager' ? 'Total Main Wallet Balance' : 'Your Main Wallet Balance',
            user.role === 'Admin' || user.role === 'Manager' ? analytics?.totalMainWalletBalance : analytics?.mainWalletBalance,
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>,
            { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-300' }
          )}

          {/* Pay-In Summary */}
          {renderBalanceCard(
            `Total Pay-In (${timeRange})`,
            analytics?.payIns?.totalAmount,
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
            { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-300' }
          )}

          {/* Pay-Out Summary */}
          {renderBalanceCard(
            `Total Pay-Out (${timeRange})`,
            analytics?.payOuts?.totalAmount,
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
            { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-300' }
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Wallet Balances */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Wallet Balances</h3>
            <Chart
              options={balanceChartOptions}
              series={[{
                name: 'Current Balance',
                data: [
                  user.role === 'Admin' || user.role === 'Manager' ? analytics?.totalEWalletBalance : analytics?.eWalletBalance,
                  user.role === 'Admin' || user.role === 'Manager' ? analytics?.totalMainWalletBalance : analytics?.mainWalletBalance
                ].map(val => val || 0)
              }]}
              type="bar"
              height={350}
            />
          </div>

          {/* Transaction Types */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Distribution</h3>
            <Chart
              options={transactionTypeOptions}
              series={[
                analytics?.payIns?.totalAmount || 0,
                analytics?.payOuts?.totalAmount || 0,
                analytics?.ewalletTransactions?.debitAmount || 0,
                analytics?.ewalletTransactions?.totalCharges || 0
              ]}
              type="donut"
              height={350}
            />
          </div>
        </div>

        {/* Daily Volume */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Transaction Volume</h3>
          <Chart
            options={volumeChartOptions}
            series={[
              {
                name: 'Pay-In',
                data: analytics?.dailyData?.payIns || []
              },
              {
                name: 'Pay-Out',
                data: analytics?.dailyData?.payOuts || []
              },
              {
                name: 'Transfers',
                data: analytics?.dailyData?.transfers || []
              }
            ]}
            type="area"
            height={350}
          />
        </div>

        {/* Transactions Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* E-Wallet Transactions */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                E-Wallet Transactions
              </h4>

              <div className="space-y-3">
                {[
                  { label: 'Total Credits', value: analytics?.ewalletTransactions?.creditAmount || 0 },
                  { label: 'Credit Count', value: analytics?.ewalletTransactions?.creditCount || 0 },
                  { label: 'Total Debits', value: analytics?.ewalletTransactions?.debitAmount || 0 },
                  { label: 'Debit Count', value: analytics?.ewalletTransactions?.debitCount || 0 },
                  // { label: 'Total Charges', value: analytics?.ewalletTransactions?.totalCharges || 0 }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                    <span className="font-medium dark:text-gray-300">
                      {item.label.includes('Amount') || item.label.includes('Charges')
                        ? `₹${(item.value || 0).toFixed(2)}`
                        : item.value || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Wallet Transactions */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
                Main Wallet Transactions
              </h4>

              <div className="space-y-3">
                {[
                  { label: 'Total Credits', value: analytics?.mainWalletTransactions?.creditAmount || 0 },
                  { label: 'Credit Count', value: analytics?.mainWalletTransactions?.creditCount || 0 },
                  { label: 'Total Debits', value: analytics?.mainWalletTransactions?.debitAmount || 0 },
                  { label: 'Debit Count', value: analytics?.mainWalletTransactions?.debitCount || 0 },
                  // { label: 'Total Charges', value: analytics?.mainWalletTransactions?.totalCharges || 0 }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                    <span className="font-medium dark:text-gray-300">
                      {item.label.includes('Amount') || item.label.includes('Charges')
                        ? `₹${(item.value || 0).toFixed(2)}`
                        : item.value || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default WalletAnalytics;