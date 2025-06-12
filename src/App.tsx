import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { UserManagement } from './components/Dashboard/UserManagement';
import { PaymentHistory } from './components/Dashboard/PaymentHistory';
import { WithdrawalRequests } from './components/Dashboard/WithdrawalRequests';
import { TariffManagement } from './components/Dashboard/TariffManagement';
import { AutomaticPayments } from './components/Dashboard/AutomaticPayments';
import { Statistics } from './components/Dashboard/Statistics';
import { NotificationSystem } from './components/Dashboard/NotificationSystem';

function App() {
  const [activeSection, setActiveSection] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'payments':
        return <PaymentHistory />;
      case 'withdrawals':
        return <WithdrawalRequests />;
      case 'tariffs':
        return <TariffManagement />;
      case 'autopay':
        return <AutomaticPayments />;
      case 'statistics':
        return <Statistics />;
      case 'notifications':
        return <NotificationSystem />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;