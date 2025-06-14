import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "text-yellow-500";
    case "SENDING":
      return "text-blue-500";
    case "CANCELLED":
      return "text-red-500";
    default:
      return "text-green-500";
  }
}

export function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://mlm-backend.pixl.uz/payments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();
        if (data.error === "To'ken es kirgan yoki vaqti o'tgan") {
          navigate("/login");
          return;
        }

        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, [navigate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {payments.map((payment) => {
        const user = payment.user || {};
        return (
          <div
            key={payment.id}
            className="bg-white shadow-md rounded-xl p-4 border dark:border-gray-700"
          >
            <div className="mb-3">
              <h2 className="text-lg font-bold text-gray-800">
                {user.name || "Nomaʼlum foydalanuvchi"}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-semibold">Holati:</span>{" "}
                <span className={`font-bold ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">To‘lov ID:</span> #{payment.id}
              </p>
              <p>
                <span className="font-semibold">Yuborish vaqti:</span>{" "}
                {payment.to_send_date
                  ? new Date(payment.to_send_date).toLocaleString()
                  : "—"}
              </p>
              <p>
                <span className="font-semibold">Karta raqam:</span>{" "}
                {payment.card
                  ? `**** **** **** ${payment.card.slice(-4)}`
                  : "Yo‘q"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// export default PaymentHistory;
