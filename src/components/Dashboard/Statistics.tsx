import { Coins, RefreshCcw, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Statistics: React.FC = () => {
  const [userModal, setUserModal] = useState(false);
  const [modalCoin, setCoinModal] = useState(false);
  const [user, setUser] = useState([]);
  const [coinTotal, setCoinTotal] = useState([]);
  const [modalChange, setModalChange] = useState(false);
  const [oldUser, setOldUser] = useState(null);
  const [coinValue, setCoinValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const hundleUser = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const res = {
      email: formData.get("email"),
      coin: Number(formData.get("coin")),
    };

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const req = await fetch("https://mlm-backend.pixl.uz/statistika/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(res),
      });

      if (req.ok) {
        await req.json();
        toast.success(`Muvaffaqiyatli qo'shildi ${(<Smile />)}`);
        await getUser();
      } else {
        const errorText = await req.text();
        throw new Error(`Xatolik: ${req.status} - ${errorText}`);
      }
    } catch (error) {
      toast.error("So'rovda xatolik:", error.message);
    } finally {
      setUserModal(false);
      setLoading(false);
    }
  };

  const handleTotal = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const res = {
      allCoin: Number(formData.get("allCoin")),
      userCount: Number(formData.get("userCount")),
    };

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const req = await fetch(
        "https://mlm-backend.pixl.uz/statistika/statis-web",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(res),
        }
      );

      if (req.ok) {
        await req.json();
        await total();
        toast.success(`Muvaffaqiyatli qo'shildi ${(<Smile />)}`);
      } else {
        const errorText = await req.text();
        throw new Error(`Xatolik: ${req.status} - ${errorText}`);
      }
    } catch (error) {
      toast.error("So'rovda xatolik:", error.message);
    } finally {
      setCoinModal(false);
      setLoading(false);
    }
  };

  let amountUserCoin = user.reduce((acc, item) => acc + Number(item.coin), 0);
  let amounTotalCoin = user.reduce((acc, item) => acc + Number(item.coin), 0);

  const allCoin = coinTotal.reduce(
    (acc, item) => acc + Number(item.allCoin),
    0
  );
  const userCount = coinTotal.reduce(
    (acc, item) => acc + Number(item.userCount),
    0
  );

  // Qo‘shilgan yakuniy qiymatlar
  amountUserCoin += userCount;
  amounTotalCoin += allCoin;

  const total = async () => {
    try {
      setLoading(true);
      const req = await fetch(
        "https://mlm-backend.pixl.uz/statistika/statis-web"
      );
      if (req.status === 200) {
        const res = await req.json(); // <--- await kiritildi
        setCoinTotal(res);
      } else {
        const errorText = await req.text();
        throw new Error(`Xatolik: ${req.status} - ${errorText}`);
      }
    } catch (error) {
      toast.error("So'rovda xatolik:", error.message);
    } finally {
      setLoading(false); // 👈 Bu ham kerak
    }
  };

  useEffect(() => {
    total();
  }, []);

  const getUser = async () => {
    try {
      setLoading(true);
      const req = await fetch("https://mlm-backend.pixl.uz/statistika/user");
      if (req.status === 200) {
        const res = await req.json();
        setUser(res);
      } else {
        const errorText = await req.text();
        throw new Error(`Xatolik: ${req.status} - ${errorText}`);
      }
    } catch (error) {
      toast.error("So'rovda xatolik:", error.message);
    } finally {
      setLoading(false); // 👈 Bu joy yetishmayapti
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const deleteStatistic = async (id) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await fetch(
        `https://mlm-backend.pixl.uz/statistika/user/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        await response.json();
        toast.error("O'chirishda xatolik yuz berdi.");
      } else {
        toast.success("Statistika muvaffaqiyatli o'chirildi.");
        await getUser();
      }
    } catch (error) {
      toast.error(error.message || "Tarmoqqa ulanishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatistic = async ({ id, email, coin }) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await fetch(
        "https://mlm-backend.pixl.uz/statistika/user",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, email, coin }),
        }
      );
      if (!response.ok) {
        toast.error("Yangilashda xatolik yuz berdi.");
      } else {
        toast.success("Statistika muvaffaqiyatli yangilandi.");
        await getUser();
      }
    } catch (error) {
      toast.error("Tarmoqqa ulanishda xatolik yuz berdi.");
    } finally {
      setModalChange(false);
      setLoading(false);
    }
  };

  const openEditModal = (user, id) => {
    const filterUser = user.filter((item) => item.id === id);
    filterUser.map((data) => {
      setOldUser(data);
    });
    setModalChange(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Statistics</h2>
          <p className="text-gray-600">
            Financial overview and platform analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setUserModal(true);
              setCoinModal(false);
            }}
            className="px-10 py-3 cursor-pointer border-2 hover:shadow-md duration-300 rounded-lg"
          >
            Add user coin
          </button>
          <button
            type="submit"
            onClick={() => {
              setCoinModal(true);
              setUserModal(false);
            }}
            className="px-10 py-3 cursor-pointer border-2 hover:shadow-md duration-300 rounded-lg"
          >
            Add total coin
          </button>
        </div>
      </div>

      <div className="w-full h-32 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        <div className="gap-3 hover:shadow-md duration-200 border rounded-[10px] h-full flex flex-col items-center py-4 text-3xl font-bold justify-center">
          <div className="flex items-center gap-3">
            Total <Coins className="text-yellow-500" />
          </div>
          <span>{amounTotalCoin}</span>
        </div>
        <div className="gap-3 hover:shadow-md duration-200 border rounded-[10px] h-full flex flex-col items-center py-4 text-3xl font-bold justify-center">
          <div className="flex items-center gap-3">
            Users' <Coins />
          </div>
          <span>{amountUserCoin}</span>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Foydalanuvchilar ro'yxati</h2>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Coin</th>
              <th className="border px-4 py-2">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {user.map((u) => (
              <tr key={u.id} className="text-start">
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.coin}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => openEditModal(user, u.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteStatistic(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {user.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  Ma'lumot yo'q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalChange && (
        <div className="w-[500px] h-auto flex-col gap-5 fixed top-[30%] right-[30%] container mx-auto bg-white rounded-xl flex p-5 justify-center">
          <h2 className="text-3xl">Statistikani tahrirlash</h2>
          <p>
            Email: <span className="ml-2 font-bold">{oldUser.email}</span>
          </p>

          <label>Coin miqdori:</label>
          <input
            className="border outline-none p-2 rounded-lg"
            defaultValue={oldUser.coin}
            placeholder={oldUser.coin}
            type="number"
            onChange={(e) => setCoinValue(e.target.value)}
          />

          <button
            onClick={() => {
              updateStatistic({
                id: oldUser.id,
                email: oldUser.email,
                coin: Number(coinValue),
              });
            }}
            className="px-5 py-2 cursor-pointer flex items-center justify-center text-white bg-green-600"
          >
            {loading ? <RefreshCcw className="animate-spin" /> : "Saqlash"}
          </button>

          <button
            onClick={() => setModalChange(false)}
            className="px-5 py-2 cursor-pointer text-white bg-red-700"
          >
            Bekor qilish
          </button>
        </div>
      )}

      {userModal && (
        <div className="w-[500px] h-auto fixed top-[30%] right-[30%] container mx-auto bg-white rounded-xl flex p-5 justify-center">
          <form
            onSubmit={hundleUser}
            className="flex flex-col w-full items-center gap-5"
          >
            <h1 className="text-2xl font-bold">Add user coin</h1>
            <label className="flex flex-col w-full items-start gap-3">
              Email
              <input
                type="email"
                name="email"
                className="w-full py-2 bg-transparent placeholder:text-white border rounded-lg outline-none px-2"
                placeholder="Enter email.."
              />
            </label>
            <label className="flex flex-col w-full items-start gap-3">
              Coin
              <input
                type="number"
                name="coin"
                className="w-full py-2 bg-transparent placeholder:text-white border rounded-lg outline-none px-2"
                placeholder="Enter coin.."
              />
            </label>
            <button className="mt-5 border px-10 py-2 rounded-lg">
              {loading ? <RefreshCcw className="animate-spin" /> : "Add"}
            </button>
          </form>
        </div>
      )}
      {modalCoin && (
        <div className="w-[500px] h-auto fixed top-[30%] right-[30%] container mx-auto bg-white rounded-xl flex p-5 justify-center">
          <form
            onSubmit={handleTotal}
            className="flex flex-col w-full items-center gap-5"
          >
            <h1 className="text-2xl font-bold">Total coin</h1>
            <label className="flex flex-col w-full items-start gap-3">
              AllCoin
              <input
                type="number"
                name="allCoin"
                className="w-full py-2 bg-transparent placeholder:text-white border rounded-lg outline-none px-2"
                placeholder="Enter allCoin.."
              />
            </label>
            <label className="flex flex-col w-full items-start gap-3">
              UserCount
              <input
                type="number"
                name="userCount"
                className="w-full py-2 bg-transparent placeholder:text-white border rounded-lg outline-none px-2"
                placeholder="Enter userCount.."
              />
            </label>
            <button className="mt-5 border px-10 py-2 rounded-lg">
              {loading ? <RefreshCcw className="animate-spin" /> : "Add"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
