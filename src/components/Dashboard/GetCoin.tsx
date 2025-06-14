// pages/GetCoin.tsx
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { useSocket } from "../../utils/useSocket";
import { io } from "socket.io-client";

interface Payment {
  paymentId: string;
  userId: string;
  message: string;
  date: string;
  howMuch: number;
  currency: string;
  status: "PENDING" | "SENDING" | "COMPLETED" | "CANCELLED";
}

const GetCoin: React.FC = () => {
  const [data, setData] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalPayment, setModalPayment] = useState<Payment | null>(null);
  const [room, setRoom] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  // const socketRef = useSocket({
  //   newPayment: (newPayment: Payment) => {
  //     setData((prev) => [newPayment, ...prev]);
  //     toast.success("Yangi to'lov so'rovi qabul qilindi!");
  //   },
  //   adminResponseConfirmation: (response: {
  //     success: boolean;
  //     message?: string;
  //   }) => {
  //     if (response.success) {
  //       toast.success("Ma'lumot muvaffaqiyatli yuborildi!");
  //     } else {
  //       toast.error(`Xatolik: ${response.message}`);
  //     }
  //   },
  // });

  const socketRef = useRef();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io("https://mlm-backend.pixl.uz/", {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Ulandi:", socket.id);
      toast.success("Success");
    });

    socket.on("newPayment", (data) => {
      setData(data);
      console.log(data);
    });

    return () => {
      socket.disconnect(); // komponent unmount bo‘lganda socketni uzish
    };
  }, []);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !paymentId || !cardNumber) {
      toast.error("Barcha maydonlarni to'ldiring!");
      return;
    }

    const isValidCardNumber = /^[0-9]{16}$/.test(cardNumber.replace(/\D/g, ""));
    if (!isValidCardNumber) {
      toast.error("Karta raqami 16 raqamdan iborat bo‘lishi kerak!");
      return;
    }

    socketRef.current?.emit("adminResponse", {
      room,
      paymentId,
      cardNumber,
    });

    setShowModal(false);
    setRoom("");
    setPaymentId("");
    setCardNumber("");
  };

  const openModal = (payment: Payment) => {
    setModalPayment(payment);
    setRoom(`room-${payment.userId}`);
    setPaymentId(payment.paymentId);
    setCardNumber("");
    setShowModal(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toaster />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length ? (
          data.map((payment) => (
            <div
              key={payment.paymentId}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {payment.message}
              </h2>
              <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <p>
                  <strong>To‘lov ID:</strong> #{payment.paymentId}
                </p>
                <p>
                  <strong>Foydalanuvchi ID:</strong> {payment.userId}
                </p>
                <p>
                  <strong>Sana:</strong>{" "}
                  {new Date(payment.date).toLocaleString()}
                </p>
                <p>
                  <strong>Miqdori:</strong> {payment.howMuch} {payment.currency}
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                        : payment.status === "SENDING"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                        : payment.status === "COMPLETED"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                    }`}
                  >
                    {payment.status}
                  </span>
                  <button
                    onClick={() => openModal(payment)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center gap-2"
                  >
                    <Send size={16} /> Yuborish
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center h-screen flex items-center justify-center text-gray-500 dark:text-gray-400">
            No payments yet
          </div>
        )}
      </div>

      {showModal && modalPayment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <form
            onSubmit={handleDeposit}
            className="bg-white dark:bg-gray-900 p-8 rounded-xl flex flex-col gap-4 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Karta ma'lumotlarini kiriting
            </h3>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Xona nomi"
              className="w-full dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="To'lov ID"
              className="w-full dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Karta raqamini kiriting"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Yopish
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Send size={16} /> Yuborish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GetCoin;
