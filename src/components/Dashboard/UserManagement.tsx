import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Ban, CheckCircle, Users } from 'lucide-react';
import { User } from '../../types';
import { mockUsers } from '../../data/mockData';
import { useTranslation } from '../../i18n/useTranslation';

export const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.subscriptionPlan === filterPlan;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Basic': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Enterprise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' as 'Active' | 'Inactive' | 'Suspended' }
        : user
    ));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('userManagementTitle')}</h2>
        <p className="text-gray-600">{t('userManagementDesc')}</p>
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

          {/* Plan Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t('allPlans')}</option>
              <option value="Basic">{t('basic')}</option>
              <option value="Premium">{t('premium')}</option>
              <option value="Enterprise">{t('enterprise')}</option>
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
              <option value="Active">{t('active')}</option>
              <option value="Inactive">{t('inactive')}</option>
              <option value="Suspended">{t('suspended')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('user')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('plan')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('balance')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('registered')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.phoneNumber}</div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(user.subscriptionPlan)}`}>
                      {t(user.subscriptionPlan.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${user.accountBalance.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {t(user.status.toLowerCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-1 rounded transition-colors ${
                          user.status === 'Active' 
                            ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        }`}
                      >
                        {user.status === 'Active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">{t('totalUsers')}</p>
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">{t('activeUsers')}</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">$</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-900">{t('totalBalance')}</p>
              <p className="text-2xl font-bold text-purple-600">
                ${users.reduce((sum, user) => sum + user.accountBalance, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-900">{t('enterpriseUsers')}</p>
              <p className="text-2xl font-bold text-orange-600">
                {users.filter(u => u.subscriptionPlan === 'Enterprise').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};