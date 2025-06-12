import React, { useState } from 'react';
import { Search, Filter, Download, TrendingUp, Calendar } from 'lucide-react';
import { Payment } from '../../types';
import { mockPayments } from '../../data/mockData';
import { useTranslation } from '../../i18n/useTranslation';

export const PaymentHistory: React.FC = () => {
  const { t } = useTranslation();
  const [payments] = useState<Payment[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7');

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userPhone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || payment.type === filterType;
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    // Date filter
    const paymentDate = new Date(payment.date);
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
    const matchesDate = dateRange === 'all' || paymentDate >= daysAgo;
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Deposit': return 'bg-blue-100 text-blue-800';
      case 'Subscription': return 'bg-purple-100 text-purple-800';
      case 'Commission': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Card': return '💳';
      case 'Bank Transfer': return '🏦';
      case 'InterKassa': return '💰';
      default: return '💳';
    }
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = filteredPayments.filter(p => p.status === 'Completed');
  const completedAmount = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('paymentHistoryTitle')}</h2>
        <p className="text-gray-600">{t('paymentHistoryDesc')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">{t('totalRevenue')}</p>
              <p className="text-2xl font-bold text-green-600">${completedAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">#</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">{t('totalPayments')}</p>
              <p className="text-2xl font-bold text-blue-600">{filteredPayments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">✓</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-900">{t('completed')}</p>
              <p className="text-2xl font-bold text-purple-600">{completedPayments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">⏳</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-900">{t('pending')}</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredPayments.filter(p => p.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('searchByPhone')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t('allTypes')}</option>
              <option value="Deposit">{t('deposit')}</option>
              <option value="Subscription">{t('subscription')}</option>
              <option value="Commission">{t('commission')}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="Completed">{t('completed')}</option>
              <option value="Pending">{t('pending')}</option>
              <option value="Failed">{t('failed')}</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="7">{t('last7Days')}</option>
              <option value="30">{t('last30Days')}</option>
              <option value="90">{t('last90Days')}</option>
              <option value="all">{t('allTime')}</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            {t('export')}
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paymentId')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('user')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('method')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{payment.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.userPhone}</div>
                    <div className="text-sm text-gray-500">ID: {payment.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">${payment.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(payment.type)}`}>
                      {t(payment.type.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <span className="mr-2">{getMethodIcon(payment.method)}</span>
                      {payment.method === 'Bank Transfer' ? t('bankTransfer') : 
                       payment.method === 'Card' ? t('card') : 
                       payment.method === 'InterKassa' ? t('interKassa') : payment.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {t(payment.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};