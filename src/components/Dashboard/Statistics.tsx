import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockStatistics } from '../../data/mockData';

export const Statistics: React.FC = () => {
  const stats = mockStatistics;

  const netProfit = stats.totalIncome - stats.totalExpenses;
  const profitMargin = ((netProfit / stats.totalIncome) * 100).toFixed(1);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Statistics</h2>
        <p className="text-gray-600">Financial overview and platform analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-900">Total Income</p>
              <p className="text-3xl font-bold text-green-600">${stats.totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">${stats.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+8.2% from last month</span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Net Profit</p>
              <p className="text-3xl font-bold text-blue-600">${netProfit.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>Margin: {profitMargin}%</span>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">New Users Today</p>
              <p className="text-3xl font-bold text-purple-600">{stats.newUsersToday}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>{stats.newUsersThisMonth} this month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Withdrawals Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Withdrawals</h3>
          <div className="space-y-3">
            {stats.dailyWithdrawals.map((day, index) => {
              const maxAmount = Math.max(...stats.dailyWithdrawals.map(d => d.amount));
              const percentage = (day.amount / maxAmount) * 100;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-sm font-medium text-gray-900 text-right">
                    ${day.amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Withdrawals Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Withdrawals</h3>
          <div className="space-y-3">
            {stats.monthlyWithdrawals.map((month, index) => {
              const maxAmount = Math.max(...stats.monthlyWithdrawals.map(m => m.amount));
              const percentage = (month.amount / maxAmount) * 100;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{month.month}</div>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-sm font-medium text-gray-900 text-right">
                    ${month.amount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Withdrawal Status</h3>
            <div className="p-2 bg-yellow-100 rounded-full">
              <ArrowDownRight className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">{stats.pendingWithdrawals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="font-semibold text-green-600">{stats.completedWithdrawals}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-900">Total</span>
              <span className="font-bold text-gray-900">
                {stats.pendingWithdrawals + stats.completedWithdrawals}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Growth Rate</h3>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Daily Growth</span>
              <span className="font-semibold text-green-600">+5.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Weekly Growth</span>
              <span className="font-semibold text-green-600">+18.7%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Growth</span>
              <span className="font-semibold text-green-600">+45.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Ratios</h3>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expense Ratio</span>
              <span className="font-semibold text-blue-600">36.0%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">User Retention</span>
              <span className="font-semibold text-blue-600">87.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Revenue per User</span>
              <span className="font-semibold text-blue-600">$274.32</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};