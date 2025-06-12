import { useEffect, useState } from "react";
import { Sidebar } from "./components/Layout/Sidebar";
import { UserManagement } from "./components/Dashboard/UserManagement";
import { PaymentHistory } from "./components/Dashboard/PaymentHistory";
import { WithdrawalRequests } from "./components/Dashboard/WithdrawalRequests";
import { TariffManagement } from "./components/Dashboard/TariffManagement";
import { AutomaticPayments } from "./components/Dashboard/AutomaticPayments";
import { Statistics } from "./components/Dashboard/Statistics";
import { NotificationSystem } from "./components/Dashboard/NotificationSystem";
import AddProduct from "./components/Dashboard/Addproducts";
import LoginPage from "./pages/LoginPage";

function App() {
  const [activeSection, setActiveSection] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <UserManagement />;
      case "payments":
        return <PaymentHistory />;
      case "withdrawals":
        return <WithdrawalRequests />;
      case "tariffs":
        return <TariffManagement />;
      case "autopay":
        return <AutomaticPayments />;
      case "statistics":
        return <Statistics />;
      case "notifications":
        return <NotificationSystem />;
      case "addproducts":
        return <AddProduct />;
      default:
        return <UserManagement />;
    }
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
}

export default App;
