import React, { useState, useEffect } from "react";

interface PhotoUrl {
  photo_url: string;
}

interface Translation {
  language: string;
  name: string;
  description: string;
  longDescription: string;
  features: string;
  usage: string;
}

interface Product {
  rating: number;
  rewiev: number;
  count: number;
  coin: number;
  translations: Translation[];
  photo_url?: PhotoUrl[];
}

const AddProductPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [product, setProduct] = useState<Product>({
    rating: 5,
    rewiev: 100,
    count: 10,
    coin: 1,
    translations: [
      {
        language: "en",
        name: "Premium Tariff",
        description: "Short description",
        longDescription: "Detailed info about product",
        features: "Feature list",
        usage: "How to use this product",
      },
    ],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await fetch("https://mlm-backend.pixl.uz/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("GET xato:", err);
        return;
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("GET /products xato:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Product | keyof Translation,
    index?: number
  ) => {
    if (index !== undefined) {
      setProduct((prev) => ({
        ...prev,
        translations: prev.translations.map((t, i) =>
          i === index ? { ...t, [field]: e.target.value } : t
        ),
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [field]: ["rating", "rewiev", "count", "coin"].includes(field)
          ? Number(e.target.value)
          : e.target.value,
      }));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return alert("Token yo'q");

    try {
      let uploadedPhotoUrl = product.photo_url?.[0]?.photo_url || "";

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

      const method = editingProductId ? "PUT" : "POST";
      const url = editingProductId
        ? `https://mlm-backend.pixl.uz/products/${editingProductId}`
        : "https://mlm-backend.pixl.uz/products";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...product,
          photo_url: uploadedPhotoUrl ? [{ photo_url: uploadedPhotoUrl }] : [],
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setSelectedFile(null);
      setProduct({
        rating: 5,
        rewiev: 100,
        count: 10,
        coin: 1,
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
      });
      setModalOpen(false);
      setEditingProductId(null);
      fetchProducts();
    } catch (err) {
      console.error("Xatolik:", err);
    }
  };

  const openEditModal = (productToEdit: any) => {
    setEditingProductId(productToEdit._id);
    setSelectedFile(null);
    setProduct({
      ...productToEdit,
      photo_url: productToEdit.photo_url,
      translations: productToEdit.translations || [],
    });
    setModalOpen(true);
  };

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => {
            setEditingProductId(null);
            setSelectedFile(null);
            setProduct({
              rating: 5,
              rewiev: 100,
              count: 10,
              coin: 1,
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
            });
            setModalOpen(true);
          }}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Product
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 w-full max-w-2xl relative">
            <h2 className="text-xl font-bold mb-4">
              {editingProductId ? "Edit Product" : "Add Product"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 overflow-y-auto max-h-[70vh] pr-2"
            >
              <input
                type="number"
                placeholder="Rating"
                className="input"
                value={product.rating}
                onChange={(e) => handleChange(e, "rating")}
              />
              <input
                type="number"
                placeholder="Review Count"
                className="input"
                value={product.rewiev}
                onChange={(e) => handleChange(e, "rewiev")}
              />
              <input
                type="number"
                placeholder="Count"
                className="input"
                value={product.count}
                onChange={(e) => handleChange(e, "count")}
              />
              <input
                type="number"
                placeholder="Coin"
                className="input"
                value={product.coin}
                onChange={(e) => handleChange(e, "coin")}
              />

              <div>
                <label className="block mb-1 font-semibold">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="mb-2"
                />
                {selectedFile ? (
                  <p className="text-sm text-gray-600">{selectedFile.name}</p>
                ) : (
                  product.photo_url?.[0]?.photo_url && (
                    <img
                      src={product.photo_url[0].photo_url}
                      alt="Preview"
                      className="h-24 rounded border"
                    />
                  )
                )}
              </div>

              {product.translations.map((t, i) => (
                <div key={i} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Language"
                    className="input"
                    value={t.language}
                    onChange={(e) => handleChange(e, "language", i)}
                  />
                  <input
                    type="text"
                    placeholder="Name"
                    className="input"
                    value={t.name}
                    onChange={(e) => handleChange(e, "name", i)}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className="input"
                    value={t.description}
                    onChange={(e) => handleChange(e, "description", i)}
                  />
                  <textarea
                    placeholder="Long Description"
                    className="input"
                    value={t.longDescription}
                    onChange={(e) => handleChange(e, "longDescription", i)}
                  />
                  <textarea
                    placeholder="Features"
                    className="input"
                    value={t.features}
                    onChange={(e) => handleChange(e, "features", i)}
                  />
                  <textarea
                    placeholder="Usage"
                    className="input"
                    value={t.usage}
                    onChange={(e) => handleChange(e, "usage", i)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setProduct((prev) => ({
                    ...prev,
                    translations: [
                      ...prev.translations,
                      {
                        language: "",
                        name: "",
                        description: "",
                        longDescription: "",
                        features: "",
                        usage: "",
                      },
                    ],
                  }))
                }
                className="text-blue-600 hover:underline text-sm"
              >
                + Add Language
              </button>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-gray-700 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500">Yuklanmoqda...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <div
              key={i}
              className="bg-[#1e293b] rounded-lg p-4 shadow text-white"
            >
              <img
                src={p.photo_url?.[0]?.photo_url}
                alt={p.translations[0]?.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold">
                {p.translations[0]?.name}
              </h3>
              <p className="text-sm text-gray-300">
                {p.translations[0]?.description}
              </p>
              <div className="mt-2 text-sm space-y-1">
                <p>
                  ⭐ {p.rating} | {p.rewiev} reviews
                </p>
                <p>🪙 {p.coin} coins</p>
                <p>📦 {p.count} in stock</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 border border-gray-500 py-1 rounded hover:bg-gray-700">
                  View
                </button>
                <button
                  className="flex-1 border border-yellow-500 text-yellow-500 py-1 rounded hover:bg-yellow-600 hover:text-white"
                  onClick={() => openEditModal(p)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddProductPage;
