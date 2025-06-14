import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ToggleRight, Package } from "lucide-react";

interface Tariff {
  id?: number;
  term: number;
  referral_bonus: number;
  coin: number;
  photo_url: string;
  translations: {
    language: string;
    name: string;
    description: string;
    longDescription: string;
    features: string; // <-- string[] emas, string bo‘lishi kerak
    usage: string;
  }[];
  dailyProfit: number;
}

export const TariffManagement: React.FC = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [isAddingTariff, setIsAddingTariff] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingTariffId, setEditingTariffId] = useState<number | null>(null);
  const [newTariff, setNewTariff] = useState<Tariff>({
    term: 0,
    referral_bonus: 0,
    coin: 0,
    photo_url: "",
    translations: [
      {
        language: "en",
        name: "",
        description: "",
        longDescription: "",
        features: "", // string
        usage: "",
      },
    ],
    dailyProfit: 0,
  });

  const resetForm = () => {
    setIsAddingTariff(false);
    setEditingTariffId(null);
    setSelectedFile(null);
    setNewTariff({
      term: 0,
      referral_bonus: 0,
      coin: 0,
      photo_url: "",
      translations: [
        {
          language: "en",
          name: "",
          description: "",
          longDescription: "",
          features: "",
          usage: "",
        },
      ],
      dailyProfit: 0,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Optionally, you can set a preview URL for immediate feedback
      setNewTariff((prev) => ({
        ...prev,
        photo_url: URL.createObjectURL(file),
      }));
    }
  };

  const fetchTariffs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("https://mlm-backend.pixl.uz/tariff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setTariffs(data);
    } catch (err) {
      setError("Failed to fetch tariffs. Please try again.");
      console.error("GET /tariff error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      let uploadedPhotoUrl = newTariff.photo_url;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch(
          "https://mlm-backend.pixl.uz/upload/single",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error(await uploadRes.text());
        uploadedPhotoUrl = (await uploadRes.json()).url;
      }

      const tariffData = {
        coin: Number(newTariff.coin),
        term: Number(newTariff.term),
        referral_bonus: Number(newTariff.referral_bonus),
        photo_url: uploadedPhotoUrl,
        dailyProfit: Number(newTariff.dailyProfit),
        translations: newTariff.translations.map((t) => ({
          language: t.language,
          name: t.name?.trim() || "Default name",
          description: t.description?.trim() || "Default description",
          longDescription: t.longDescription?.trim() || "",
          usage: t.usage?.trim() || "",
          features: t.features?.trim() || "Default feature", // <-- Fixed
        })),
      };

      console.log(tariffData);

      const req = await fetch("https://mlm-backend.pixl.uz/tariff/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tariffData),
      });

      const result = await req.json();
      console.log(result);

      await fetchTariffs();
      resetForm();
    } catch (err) {
      setError("Failed to save tariff. Please try again.");
      console.error("Save error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (tariff: Tariff) => {
    setNewTariff(tariff);
    setEditingTariffId(tariff.id!);
    setIsAddingTariff(true);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`https://mlm-backend.pixl.uz/tariff/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchTariffs();
    } catch (err) {
      setError("Failed to delete tariff. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, []);

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
          Loading...
        </div>
      )}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tariff Management
            </h2>
            <p className="text-gray-600">
              Create and manage subscription plans
            </p>
          </div>
          <button
            onClick={() => setIsAddingTariff(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            disabled={isLoading}
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
              <p className="text-2xl font-bold text-blue-600">
                {tariffs.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center">
            <ToggleRight className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">
                Active Tariffs
              </p>
              <p className="text-2xl font-bold text-green-600">
                {tariffs.filter((t) => t.isActive).length}
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
                $
                {tariffs.length
                  ? (
                      tariffs.reduce((sum, t) => sum + (t.price || 0), 0) /
                      tariffs.length
                    ).toFixed(2)
                  : "0.00"}
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
              <p className="text-sm font-medium text-orange-900">
                Premium Plans
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {tariffs.filter((t) => (t.price || 0) > 200).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Tariff Form */}
      {isAddingTariff && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingTariffId ? "Edit Tariff" : "Add New Tariff"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Term (Days)
              </label>
              <input
                id="term"
                type="number"
                value={newTariff.term}
                onChange={(e) =>
                  setNewTariff({ ...newTariff, term: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter term in days"
                min="1"
                required
              />
            </div>

            {/* Referral Bonus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referral Bonus
              </label>
              <input
                id="referral_bonus"
                type="number"
                value={newTariff.referral_bonus}
                onChange={(e) =>
                  setNewTariff({
                    ...newTariff,
                    referral_bonus: parseFloat(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Coins */}
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coins
              </label>
              <input
                id="coin"
                type="number"
                value={newTariff.coin}
                onChange={(e) =>
                  setNewTariff({
                    ...newTariff,
                    coin: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter coin amount"
                min="0"
                required
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DailyProfit
              </label>
              <input
                id="coin"
                type="number"
                value={newTariff.dailyProfit}
                onChange={(e) =>
                  setNewTariff({
                    ...newTariff,
                    dailyProfit: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter coin amount"
                min="0"
                required
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Photo
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {newTariff.photo_url && (
                <img
                  src={newTariff.photo_url}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/150";
                  }}
                />
              )}
            </div>

            {/* Translations for each language */}
            <div className="md:col-span-2">
              <h4 className="text-md font-semibold text-gray-900 mb-2">
                Translation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tariff Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tariff Name
                  </label>
                  <input
                    type="text"
                    value={newTariff.translations[0].name}
                    onChange={(e) =>
                      setNewTariff({
                        ...newTariff,
                        translations: [
                          {
                            ...newTariff.translations[0],
                            name: e.target.value,
                          },
                        ],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tariff name"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTariff.translations[0].description}
                    onChange={(e) =>
                      setNewTariff({
                        ...newTariff,
                        translations: [
                          {
                            ...newTariff.translations[0],
                            description: e.target.value,
                          },
                        ],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter tariff description"
                  />
                </div>

                {/* Long Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Description
                  </label>
                  <textarea
                    value={newTariff.translations[0].longDescription}
                    onChange={(e) =>
                      setNewTariff({
                        ...newTariff,
                        translations: [
                          {
                            ...newTariff.translations[0],
                            longDescription: e.target.value,
                          },
                        ],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter detailed tariff description"
                  />
                </div>

                {/* Usage Instructions */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Instructions
                  </label>
                  <textarea
                    value={newTariff.translations[0].usage}
                    onChange={(e) =>
                      setNewTariff({
                        ...newTariff,
                        translations: [
                          {
                            ...newTariff.translations[0],
                            usage: e.target.value,
                          },
                        ],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter usage instructions"
                  />
                </div>

                {/* Features */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <input
                    type="text"
                    value={newTariff.translations[0].features}
                    onChange={(e) =>
                      setNewTariff((prev) => ({
                        ...prev,
                        translations: [
                          {
                            ...prev.translations[0],
                            features: e.target.value,
                          },
                        ],
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter features (as a single string)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {editingTariffId ? "Update Tariff" : "Add Tariff"}
            </button>
          </div>
        </form>
      )}

      {/* Tariffs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tariffs.map((tariff) => (
          <div
            key={tariff.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tariff.translations[0].name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {tariff.translations[0].description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`p-1 rounded transition-colors ${
                      tariff.isActive
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        setError("No authentication token found.");
                        return;
                      }
                      try {
                        setIsLoading(true);
                        const res = await fetch(
                          `https://mlm-backend.pixl.uz/tariff/${tariff.id}`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              isActive: !tariff.isActive,
                            }),
                          }
                        );
                        if (!res.ok) throw new Error(await res.text());
                        await fetchTariffs();
                      } catch (err) {
                        setError("Failed to toggle tariff status.");
                        console.error("Toggle error:", err);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    <ToggleRight className="w-4 h-4" />
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                    onClick={() => handleEdit(tariff)}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                    onClick={() => handleDelete(tariff.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    ${tariff.price}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    /{tariff.term} days
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Referral Bonus: ${tariff.referral_bonus}
                </p>
                <p className="text-sm text-gray-500">Coins: {tariff.coin}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                <ul className="space-y-1">
                  {tariff.translations[0].features
                    .split(",")
                    .map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                        {feature.trim()}
                      </li>
                    ))}
                </ul>
                {tariff.photo_url && (
                  <div className="mt-2">
                    <img
                      src={tariff.photo_url}
                      alt={tariff.translations[0].name}
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  {tariff.translations[0].longDescription}
                </p>
                <p className="text-sm text-gray-600">
                  Usage: {tariff.translations[0].usage}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      tariff.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {tariff.isActive ? "Active" : "Inactive"}
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
