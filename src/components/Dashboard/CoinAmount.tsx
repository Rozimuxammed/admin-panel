import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { translations } from "../../i18n/translations"; // import translation from your i18n file

export default function CoinAmount() {
  const [currency, setCurrency] = useState<string | number>("");
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [coinData, setCoinData] = useState<any>(null);
  const [coinLoading, setCoinLoading] = useState<boolean>(true);
  const [coinError, setCoinError] = useState<string | null>(null);

  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editCount, setEditCount] = useState<number>(0);
  const [editId, setEditId] = useState<string | number | null>(null);

  // Language state
  const [lang, setLang] = useState<"en" | "uz" | "zh">("en");
  const t = translations[lang];

  const openEditModal = (idOrCoin: any, coinArg?: any) => {
    if (coinArg) {
      setSelectedCoin(coinArg);
      setEditCount(coinArg.count);
      setEditId(idOrCoin);
      setEditCurrency(coinArg.currency);
    } else {
      setSelectedCoin(idOrCoin);
      setEditCount(idOrCoin.count);
      setEditId(idOrCoin.id ?? idOrCoin.currency);
      setEditCurrency(idOrCoin.currency);
    }
    setShowModal(true);
  };

  // Add editCurrency state
  const [editCurrency, setEditCurrency] = useState<string>("");

  const closeModal = () => {
    setShowModal(false);
    setSelectedCoin(null);
  };

  // Komponent mount bo'lganda coin ma'lumotlarini olish
  const fetchCoins = async () => {
    setCoinLoading(true);
    setCoinError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://mlm-backend.pixl.uz/coin", {
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setCoinData(data);
      toast.success("Success");
    } catch (err) {
      setCoinError(t.errorFetch);
    } finally {
      setCoinLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://mlm-backend.pixl.uz/coin", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currency: currency,
          count: count,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      setSuccess(t.successAdd);
      await fetchCoins(); // Refresh coin data after successful add
    } catch (err) {
      setError(t.errorAdd);
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (idOrKey: string | number) => {
    setCoinLoading(true);
    setCoinError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://mlm-backend.pixl.uz/coin/${idOrKey}`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Server error");
      toast.success(t.successDelete);
      await fetchCoins();
    } catch (err) {
      setCoinError(t.errorDelete);
    } finally {
      setCoinLoading(false);
    }
  };

  // Update handle
  const handleUpdate = async () => {
    if (!selectedCoin || editId == null) return;
    setCoinLoading(true);
    setCoinError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://mlm-backend.pixl.uz/coin/${editId}`, {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currency: editCurrency,
          count: editCount,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      toast.success(t.successUpdate);
      await fetchCoins();
      closeModal();
    } catch (err) {
      setCoinError(t.errorUpdate);
    } finally {
      setCoinLoading(false);
    }
  };

  return (
    <section className="max-w-full m-8 mt-8 flex flex-col gap-5">
      {/* Language Switcher */}
      <div className="flex gap-2 mb-2">
        <button
          className={`px-3 py-1 rounded ${
            lang === "en" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setLang("en")}
        >
          English
        </button>
        <button
          className={`px-3 py-1 rounded ${
            lang === "uz" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setLang("uz")}
        >
          O'zbekcha
        </button>
        <button
          className={`px-3 py-1 rounded ${
            lang === "zh" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setLang("zh")}
        >
          中文
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <label className="block text-gray-700 font-medium">
            {t.currencyLabel}
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
              placeholder={t.currencyPlaceholder}
              className="mt-2 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block text-gray-700 font-medium">
            {t.amountLabel}
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              required
              className="mt-2 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                {t.submitting}
              </>
            ) : (
              t.submit
            )}
          </button>
        </form>
        {success && (
          <div className="mt-4 text-green-600 text-center font-semibold">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}
      </div>
      {/* Coin balances */}
      <div className="mb-6 p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t.balances}</h2>

        {coinLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">{t.loading}</span>
          </div>
        )}

        {coinError && (
          <div className="text-red-500 bg-red-50 p-3 rounded-lg text-center">
            {coinError}
          </div>
        )}

        {coinData &&
        (Array.isArray(coinData)
          ? coinData.length > 0
          : Object.keys(coinData).length > 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(coinData)
              ? coinData.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm text-gray-500 uppercase">
                          {item.currency}
                        </h3>
                        <p className="text-2xl font-semibold text-gray-800">
                          {item.count}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openEditModal(item.id, {
                              currency: item.currency,
                              count: item.count,
                            })
                          }
                          className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
                          disabled={coinLoading}
                        >
                          {coinLoading && editId === item.id ? (
                            <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                          ) : (
                            <Pencil size={18} className="text-blue-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id ?? item.currency)}
                          className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
                          disabled={coinLoading}
                        >
                          {coinLoading && editId === item.id ? (
                            <span className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></span>
                          ) : (
                            <Trash2 size={18} className="text-red-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : Object.entries(coinData).map(([key, value]: [string, any]) => (
                  <div
                    key={key}
                    className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm text-gray-500 uppercase">
                          {key}
                        </h3>
                        <p className="text-2xl font-semibold text-gray-800">
                          {value}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openEditModal({ currency: key, count: value })
                          }
                          className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
                          disabled={coinLoading}
                        >
                          {coinLoading && editId === key ? (
                            <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                          ) : (
                            <Pencil size={18} className="text-blue-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(key)}
                          className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
                          disabled={coinLoading}
                        >
                          {coinLoading && editId === key ? (
                            <span className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></span>
                          ) : (
                            <Trash2 size={18} className="text-red-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">{t.noData}</div>
        )}

        {/* Modal */}
        {showModal && selectedCoin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {t.edit}: {selectedCoin.currency}
              </h2>
              <input
                type="text"
                value={editCurrency}
                onChange={(e) => setEditCurrency(e.target.value)}
                placeholder={t.currencyPlaceholder}
                className="w-full border rounded-md p-2 mb-4"
              />
              <input
                type="number"
                value={editCount}
                onChange={(e) => setEditCount(Number(e.target.value))}
                className="w-full border rounded-md p-2 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                  disabled={coinLoading}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                  disabled={coinLoading}
                >
                  {coinLoading ? (
                    <>
                      <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      {t.saving}
                    </>
                  ) : (
                    t.save
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster richColors />
    </section>
  );
}
