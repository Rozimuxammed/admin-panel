import React from 'react';
import { 
  Users, 
  CreditCard, 
  ArrowDownToLine, 
  Package, 
  Send, 
  BarChart3, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isOpen, 
  onToggle 
}) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'users', label: t('userManagement'), icon: Users },
    { id: 'payments', label: t('paymentHistory'), icon: CreditCard },
    { id: 'withdrawals', label: t('withdrawalRequests'), icon: ArrowDownToLine },
    { id: 'tariffs', label: t('tariffManagement'), icon: Package },
    { id: 'autopay', label: t('automaticPayments'), icon: Send },
    { id: 'statistics', label: t('statistics'), icon: BarChart3 },
    { id: 'notifications', label: t('notifications'), icon: Bell },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-gray-200 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">{t('adminPanel')}</h1>
            <p className="text-sm text-gray-600 mt-1">{t('paymentPlatform')}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors
                    ${activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Switcher */}
          <div className="p-4 border-t border-gray-200">
            <LanguageSwitcher />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>{t('copyright')}</p>
              <p>{t('version')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};