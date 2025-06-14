import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./components/Layout/Sidebar";
import { UserManagement } from "./components/Dashboard/UserManagement";
import { PaymentHistory } from "./components/Dashboard/PaymentHistory";
import { WithdrawalRequests } from "./components/Dashboard/WithdrawalRequests";
import { TariffManagement } from "./components/Dashboard/TariffManagement";
import { AutomaticPayments } from "./components/Dashboard/AutomaticPayments";
import { Statistics } from "./components/Dashboard/Statistics";
import { NotificationSystem } from "./components/Dashboard/NotificationSystem";
import AddProduct from "./components/Dashboard/Addproducts";
import CoinAmount from "./components/Dashboard/CoinAmount";
import LoginPage from "./pages/LoginPage";
// import { io } from "socket.io-client";
import UserDetail from "./components/Dashboard/UserDetail";
import GetCoin from "./components/Dashboard/GetCoin";

function App() {
  const [activeSection, setActiveSection] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // // Shu yerdan qilamiz
  // const socketRef = useRef();
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const socket = io("https://mlm-backend.pixl.uz/", {
  //     auth: { token },
  //   });

  //   socketRef.current = socket;

  //   socket.on("connect", () => {
  //     console.log("🔌 Ulandi:", socket.id);
  //   });

  //   socket.on("newPayment", (data) => {
  //     console.log(data);
  //   });

  //   return () => {
  //     socket.disconnect(); // komponent unmount bo‘lganda socketni uzish
  //   };
  // }, []);
  // // Shu yerdan qilamiz

  // ...existing code...
  const renderContent = () => {
    // Agar activeSection "user/:id" formatida bo‘lsa, id ni ajratib olamiz
    if (activeSection.startsWith("user/")) {
      const userId: any = activeSection.split("/")[1];
      return <UserDetail userId={userId} />;
    }

    switch (activeSection) {
      case "users":
        return (
          <UserManagement
            onUserClick={(id: string) => setActiveSection(`user/${id}`)}
          />
        );
      case "addproducts":
        return <AddProduct />;
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
      case "coinAmount":
        return <CoinAmount />;
      case "getCoin":
        return <GetCoin />;
      default:
        return (
          <UserManagement
            onUserClick={(id: string) => setActiveSection(`user/${id}`)}
          />
        );
    }
  };
  // ...existing code...

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
