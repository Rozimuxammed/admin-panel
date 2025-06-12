import React, { useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Package } from 'lucide-react';
import { Tariff } from '../../types';
import { mockTariffs } from '../../data/mockData';

export const TariffManagement: React.FC = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>(mockTariffs);
  const [isAddingTariff, setIsAddingTariff] = useState(false);
  const [editingTariff, setEditingTariff] = useState<string | null>(null);
  const [newTariff, setNewTariff] = useState<Partial<Tariff>>({
    name: '',
    price: 0,
    features: [],
    duration: 'Monthly',
    isActive: true,
    description: ''
  });

  const handleAddTariff = () => {
    if (newTariff.name && newTariff.price) {
      const tariff: Tariff = {
        id: `t${Date.now()}`,
        name: newTariff.name,
        price: newTariff.price,
        features: newTariff.features || [],
        duration: newTariff.duration || 'Monthly',
        isActive: newTariff.isActive || true,
        description: newTariff.description || ''
      };
      setTariffs([...tariffs, tariff]);
      setNewTariff({ name: '', price: 0, features: [], duration: 'Monthly', isActive: true, description: '' });
      setIsAddingTariff(false);
    }
  };

  const toggleTariffStatus = (id: string) => {
    setTariffs(tariffs.map(tariff =>
      tariff.id === id ? { ...tariff, isActive: !tariff.isActive } : tariff
    ));
  };

  const deleteTariff = (id: string) => {
    setTariffs(tariffs.filter(tariff => tariff.id !== id));
  };

  const addFeature = (feature: string) => {
    if (feature.trim()) {
      setNewTariff({
        ...newTariff,
        features: [...(newTariff.features || []), feature.trim()]
      });
    }
  };

  const removeFeature = (index: number) => {
    setNewTariff({
      ...newTariff,
      features: newTariff.features?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tariff Management</h2>
            <p className="text-gray-600">Create and manage subscription plans</p>
          </div>
          <button
            onClick={() => setIsAddingTariff(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Tariff
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Total Tariffs</p>
              <p className="text-2xl font-bold text-blue-600">{tariffs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center">
            <ToggleRight className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">Active Tariffs</p>
              <p className="text-2xl font-bold text-green-600">
                {tariffs.filter(t => t.isActive).length}
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
              <p className="text-sm font-medium text-purple-900">Avg. Price</p>
              <p className="text-2xl font-bold text-purple-600">
                ${(tariffs.reduce((sum, t) => sum + t.price, 0) / tariffs.length).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">★</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-900">Premium Plans</p>
              <p className="text-2xl font-bold text-orange-600">
                {tariffs.filter(t => t.price > 200).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Tariff Form */}
      {isAddingTariff && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Tariff</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tariff Name</label>
              <input
                type="text"
                value={newTariff.name}
                onChange={(e) => setNewTariff({ ...newTariff, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tariff name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                value={newTariff.price}
                onChange={(e) => setNewTariff({ ...newTariff, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={newTariff.duration}
                onChange={(e) => setNewTariff({ ...newTariff, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="One-time">One-time</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newTariff.isActive}
                  onChange={(e) => setNewTariff({ ...newTariff, isActive: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newTariff.description}
                onChange={(e) => setNewTariff({ ...newTariff, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Enter tariff description"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="space-y-2">
                {newTariff.features?.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">{feature}</span>
                    <button
                      onClick={() => removeFeature(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Add a feature"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addFeature(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addFeature(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsAddingTariff(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTariff}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Tariff
            </button>
          </div>
        </div>
      )}

      {/* Tariffs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tariffs.map((tariff) => (
          <div key={tariff.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tariff.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tariff.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleTariffStatus(tariff.id)}
                    className={`p-1 rounded transition-colors ${
                      tariff.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {tariff.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteTariff(tariff.id)}
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">${tariff.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/{tariff.duration.toLowerCase()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                <ul className="space-y-1">
                  {tariff.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    tariff.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tariff.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-500">ID: {tariff.id}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};