import React, { useState } from 'react';
import { Search, Filter, Check, X, Clock, Eye } from 'lucide-react';
import { WithdrawalRequest } from '../../types';
import { mockWithdrawals } from '../../data/mockData';
import { useTranslation } from '../../i18n/useTranslation';

export const WithdrawalRequests: React.FC = () => {
  const { t } = useTranslation();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(mockWithdrawals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.userPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.cardNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || withdrawal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <Check className="w-4 h-4" />;
      case 'Processing': return <Clock className="w-4 h-4" />;
      case 'Unpaid': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  const updateWithdrawalStatus = (id: string, newStatus: 'Paid' | 'Unpaid' | 'Processing') => {
    setWithdrawals(withdrawals.map(withdrawal =>
      withdrawal.id === id ? { ...withdrawal, status: newStatus } : withdrawal
    ));
  };

  const totalPendingAmount = filteredWithdrawals
    .filter(w => w.status === 'Processing' || w.status === 'Unpaid')
    .reduce((sum, w) => sum + w.amount, 0);

  const totalPaidAmount = filteredWithdrawals
    .filter(w => w.status === 'Paid')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('withdrawalRequestsTitle')}</h2>
        <p className="text-gray-600">{t('withdrawalRequestsDesc')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-900">{t('pendingAmount')}</p>
              <p className="text-2xl font-bold text-yellow-600">${totalPendingAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center">
            <Check className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">{t('totalPaid')}</p>
              <p className="text-2xl font-bold text-green-600">${totalPaidAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">#</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">{t('totalRequests')}</p>
              <p className="text-2xl font-bold text-blue-600">{filteredWithdrawals.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center">
            <X className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-900">{t('unpaid')}</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredWithdrawals.filter(w => w.status === 'Unpaid').length}
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
              placeholder={t('searchByPhoneOrCard')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="Paid">{t('paid')}</option>
              <option value="Processing">{t('processing')}</option>
              <option value="Unpaid">{t('unpaid')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('requestId')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('user')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('cardDetails')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('requestDate')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{withdrawal.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{withdrawal.userPhone}</div>
                    <div className="text-sm text-gray-500">ID: {withdrawal.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{withdrawal.cardNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">${withdrawal.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(withdrawal.status)}`}>
                      {getStatusIcon(withdrawal.status)}
                      <span className="ml-1">{t(withdrawal.status.toLowerCase())}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(withdrawal.requestDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {withdrawal.status !== 'Paid' && (
                        <>
                          <button
                            onClick={() => updateWithdrawalStatus(withdrawal.id, 'Processing')}
                            className="text-yellow-600 hover:text-yellow-900 p-1 hover:bg-yellow-50 rounded transition-colors"
                            disabled={withdrawal.status === 'Processing'}
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateWithdrawalStatus(withdrawal.id, 'Paid')}
                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {withdrawal.status === 'Processing' && (
                        <button
                          onClick={() => updateWithdrawalStatus(withdrawal.id, 'Unpaid')}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quickActions')}</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const processingRequests = withdrawals.filter(w => w.status === 'Processing');
              processingRequests.forEach(w => updateWithdrawalStatus(w.id, 'Paid'));
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t('markAllProcessingAsPaid')}
          </button>
          <button
            onClick={() => {
              const unpaidRequests = withdrawals.filter(w => w.status === 'Unpaid');
              unpaidRequests.forEach(w => updateWithdrawalStatus(w.id, 'Processing'));
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            {t('processAllUnpaid')}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {t('exportReport')}
          </button>
        </div>
      </div>
    </div>
  );
};