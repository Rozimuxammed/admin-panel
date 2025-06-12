import React, { useState } from 'react';
import { Send, Bell, Eye, Trash2, Plus, Users, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Notification } from '../../types';
import { mockNotifications } from '../../data/mockData';

export const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isCreating, setIsCreating] = useState(false);
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    title: '',
    message: '',
    type: 'Info',
    recipients: 'All'
  });

  const handleCreateNotification = () => {
    if (newNotification.title && newNotification.message) {
      const notification: Notification = {
        id: `n${Date.now()}`,
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type || 'Info',
        createdDate: new Date().toISOString().split('T')[0],
        isRead: false,
        recipients: newNotification.recipients || 'All'
      };
      
      setNotifications([notification, ...notifications]);
      setNewNotification({ title: '', message: '', type: 'Info', recipients: 'All' });
      setIsCreating(false);
      
      // Simulate sending notification
      alert(`Notification "${notification.title}" has been sent to ${notification.recipients} users!`);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'Error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'Info': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Success': return 'bg-green-100 text-green-800 border-green-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Error': return 'bg-red-100 text-red-800 border-red-200';
      case 'Info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecipientColor = (recipients: string) => {
    switch (recipients) {
      case 'All': return 'bg-gray-100 text-gray-800';
      case 'Basic': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Enterprise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification System</h2>
            <p className="text-gray-600">Send and manage notifications to users</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Notification
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center">
            <Bell className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Total Notifications</p>
              <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Read</p>
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.isRead).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-900">Unread</p>
              <p className="text-2xl font-bold text-yellow-600">
                {notifications.filter(n => !n.isRead).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-900">This Week</p>
              <p className="text-2xl font-bold text-purple-600">
                {notifications.filter(n => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(n.createdDate) >= weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Notification Form */}
      {isCreating && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Notification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={newNotification.title}
                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter notification title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newNotification.type}
                onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Info">Info</option>
                <option value="Success">Success</option>
                <option value="Warning">Warning</option>
                <option value="Error">Error</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
              <select
                value={newNotification.recipients}
                onChange={(e) => setNewNotification({ ...newNotification, recipients: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Users</option>
                <option value="Basic">Basic Plan Users</option>
                <option value="Premium">Premium Plan Users</option>
                <option value="Enterprise">Enterprise Plan Users</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter your notification message"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNotification}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p>No notifications sent yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getTypeIcon(notification.type)}
                      <h4 className="text-lg font-semibold text-gray-900 ml-2">
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecipientColor(notification.recipients)}`}>
                        {notification.recipients} Users
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(notification.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="Mark as read"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};