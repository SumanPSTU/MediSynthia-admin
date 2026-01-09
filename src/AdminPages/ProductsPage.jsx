// ProductsPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { adminApi } from "../api/adminApi";
import { Loader2, Search, RefreshCcw, Trash2, Edit, Pill } from "lucide-react";
import toast from "react-hot-toast";

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center hover:shadow-lg transition">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
  </div>
);

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    productName: "",
    productGeniric: "",
    productSuplier: "",
    strength: "",
    dose: "",
    category: "",
    subCategory: "",
    productDescription: "",
    sideEffect: "",
    productPrice: "",
    discountPercentage: "",
    isAvailable: true,
  });
  const [productImage, setProductImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [togglingId, setTogglingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const total = products.length;
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await adminApi.getCategories();
        const payload = res?.data || {};
        const cats = payload.categories || payload.data || payload.results || payload || [];
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error("Failed to load categories", err?.response || err);
      }
    };
    const loadSubcats = async () => {
      try {
        const res = await adminApi.getSubcategories();
        const payload = res?.data || {};
        const subs = payload.subcategories || payload.data || payload.results || payload || [];
        setSubcategories(Array.isArray(subs) ? subs : []);
      } catch (err) {
        console.error("Failed to load subcategories", err?.response || err);
      }
    };

    loadCats();
    loadSubcats();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getProducts(page, limit);
      const payload = res?.data || {};
      const productsList = payload.products || payload.data || payload.results || [];
      setProducts(Array.isArray(productsList) ? productsList : []);
      const tp =
        payload.totalPages ||
        Math.ceil((payload.totalProducts || payload.total || productsList.length) / limit);
      setTotalPages(tp || 1);
    } catch (err) {
      toast.error("Failed to load products");
      console.error("fetchProducts error", err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const form = new FormData();
      Object.keys(newProduct).forEach((k) => {
        // Convert boolean/number to string where necessary
        const val = newProduct[k];
        if (val !== undefined && val !== null) {
          form.append(k, typeof val === "boolean" ? String(val) : val);
        }
      });

      if (productImage) form.append("file", productImage);

      // EDIT (Update)
      if (editingId) {
        const res = await adminApi.updateProduct(editingId, form);
        if (res?.data?.success) {
          toast.success(res.data.message || "Product updated successfully");
          // Refresh product list (or patch single product locally)
          await fetchProducts();
          setShowAddModal(false);
          setEditingId(null);
        } else {
          toast.error(res?.data?.message || "Failed to update product");
        }
        return;
      }

      // CREATE (Add)
      const res = await adminApi.createProduct(form);
      if (res?.data?.success) {
        toast.success(res.data.message || "Product added successfully");
        setShowAddModal(false);
        // reset form
        setNewProduct({
          productId: "",
          productName: "",
          productGeniric: "",
          productSuplier: "",
          strength: "",
          dose: "",
          category: "",
          subCategory: "",
          productDescription: "",
          sideEffect: "",
          productPrice: "",
          discountPercentage: "",
          isAvailable: true,
        });
        setProductImage(null);
        fetchProducts();
      } else {
        toast.error(res?.data?.message || "Failed to add product");
      }
    } catch (err) {
      console.error("Save failed", err?.response || err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id || p.id);
    setNewProduct({
      productId: p.productId || "",
      productName: p.productName || "",
      productGeniric: p.productGeniric || "",
      productSuplier: p.productSuplier || "",
      strength: p.strength || "",
      dose: p.dose || "",
      // keep category/subCategory as id strings (support both object or primitive)
      category:
        p.category && typeof p.category === "object"
          ? p.category._id || p.category.id || ""
          : p.category || "",
      subCategory:
        p.subCategory && typeof p.subCategory === "object"
          ? p.subCategory._id || p.subCategory.id || ""
          : p.subCategory || "",
      productDescription: p.productDescription || "",
      sideEffect: p.sideEffect || "",
      productPrice:
        typeof p.productPrice !== "undefined" && p.productPrice !== null
          ? p.productPrice
          : p.priceInfo?.effectivePrice ?? "",
      discountPercentage:
        typeof p.discountPercentage !== "undefined" && p.discountPercentage !== null
          ? p.discountPercentage
          : p.priceInfo?.discountPercentage ?? "",
      isAvailable: !!p.isAvailable,
    });
    setProductImage(null);
    setShowAddModal(true);
  };

  const handleSearch = async (e) => {
    // support both onKeyUp and form submit
    if (e && e.preventDefault) e.preventDefault();
    if (!search.trim()) return fetchProducts();
    try {
      setLoading(true);
      const res = await adminApi.searchProducts(search.trim());
      const results = res?.data?.products || res?.data?.results || res?.data || [];
      setProducts(Array.isArray(results) ? results : []);
      setTotalPages(1);
      setPage(1);
    } catch (err) {
      console.error("Search failed", err?.response || err);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setLoading(true);
      await adminApi.deleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err?.response || err);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (id, current) => {
    try {
      setTogglingId(id);
      const res = await adminApi.toggleAvailability(id);
      const updated = res?.data?.product || res?.data;
      if (updated) {
        const updatedId = updated._id || updated.id;
        setProducts((prev) =>
          prev.map((p) => {
            if (p._id === updatedId || p.id === updatedId) {
              return {
                ...p,
                isAvailable:
                  typeof updated.isAvailable !== "undefined" ? updated.isAvailable : !current,
                ...(typeof updated.productPrice !== "undefined" ? { productPrice: updated.productPrice } : {}),
                ...(typeof updated.priceInfo !== "undefined" ? { priceInfo: updated.priceInfo } : {}),
                ...(typeof updated.productImgUrl !== "undefined" ? { productImgUrl: updated.productImgUrl } : {}),
              };
            }
            return p;
          })
        );
        toast.success(res?.data?.message || (!current ? "Product marked available" : "Product marked unavailable"));
      } else {
        // fallback
        toast.success(!current ? "Product marked available" : "Product marked unavailable");
        fetchProducts();
      }
    } catch (err) {
      console.error("Toggle availability failed", err?.response || err);
      toast.error("Failed to update availability");
    } finally {
      setTogglingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filterStatus === "Available") return p.isAvailable;
    if (filterStatus === "Unavailable") return !p.isAvailable;
    return true; // All
  });

  const stats = [
    { label: "All", value: products.length },
    { label: "Available", value: products.filter(p => p.isAvailable).length },
    { label: "Unavailable", value: products.filter(p => !p.isAvailable).length },
    { label: "Page", value: page, infoOnly: true },
  ];


  return (
    <section className=" mx-auto mt-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl bg-emerald-500 p-6 text-white shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Pill className="h-7 w-7" />
              <h1 className="text-2xl font-semibold"> Products</h1>
            </div>
            <p className="text-gray-200 text-sm mt-1">Add, update, or monitor medicines in your store</p>
          </div>

          {/* Search */}
          <div onKeyUp={handleSearch} className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="w-full rounded-lg bg-white/90 pl-9 pr-10 py-2 text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              >
                clear
              </button>
            )}
          </div>

          <div className="flex justify-between items-center gap-4">
            <button
              onClick={() => {
                setEditingId(null); // ensure add mode
                setNewProduct({
                  productId: "",
                  productName: "",
                  productGeniric: "",
                  productSuplier: "",
                  strength: "",
                  dose: "",
                  category: "",
                  subCategory: "",
                  productDescription: "",
                  sideEffect: "",
                  productPrice: "",
                  discountPercentage: "",
                  isAvailable: true,
                });
                setProductImage(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition"
            >
              Add Product
            </button>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded-lg transition"
            >
              <RefreshCcw size={16} /> <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, infoOnly }) => {
          const isActive = filterStatus === label;

          return (
            <button
              key={label}
              disabled={infoOnly}
              onClick={() => !infoOnly && setFilterStatus(label)}
              className={`
          rounded-xl transition transform hover:scale-[1.02]
          ${isActive ? "ring-2 ring-emerald-500" : ""}
          ${infoOnly ? "cursor-default" : ""}
        `}
            >
              <StatCard title={label} value={value} />
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Actions</th>
                <th className="px-4 py-3 text-left">Available</th>
                <th className="px-4 py-3 text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-red-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => (
                  <tr
                    key={p._id || p.id || idx}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 border-t">{(page - 1) * limit + idx + 1}</td>
                    <td className="px-4 py-3 border-t font-medium">
                      <div className="flex items-center gap-3">
                        {p.productImgUrl && (
                          <img src={p.productImgUrl} alt={p.productName} className="w-12 h-12 object-cover rounded" />
                        )}
                        <div>
                          <div className="font-medium">{p.productName || p.productId || "—"}</div>
                          <div className="text-xs text-gray-500">{p.productGeniric || ""} • {p.strength || ""} {p.dose || ""}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-t">
                      {p.priceInfo ? (
                        <div className="flex flex-col">
                          <span className="font-medium">${p.priceInfo.effectivePrice}</span>
                          <span className="text-xs text-gray-500">was ${p.priceInfo.originalPrice} • {p.priceInfo.discountPercentage}% off</span>
                        </div>
                      ) : p.productPrice ? `$${p.productPrice}` : "—"}
                    </td>
                    <td className="px-4 py-3 border-t">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(p); }}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(p._id || p.id); }}
                          className="flex items-center gap-1 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-3 border-t">
                      <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={!!p.isAvailable}
                          onChange={(e) => { handleToggleAvailability(p._id || p.id, !!p.isAvailable); }}
                          disabled={togglingId === (p._id || p.id)}
                        />
                        <div
                          className={`w-11 h-6 rounded-full relative transition-colors ${p.isAvailable ? "bg-emerald-500" : "bg-red-500"} ${togglingId === (p._id || p.id) ? "opacity-60" : ""}`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${p.isAvailable ? "translate-x-5" : "translate-x-0"} ${togglingId === (p._id || p.id) ? "opacity-70" : ""}`}
                          />
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-700">{p.isAvailable ? "Yes" : "No"}</span>
                      </label>
                    </td>

                    <td
                      onClick={() => navigate(`/product/${p._id || p.id}`)}
                      className="px-4 py-3 border-t text-sm text-emerald-600 font-medium"
                    >
                      View
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
        <p>
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40">
            Prev
          </button>
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-40">
            Next
          </button>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Update Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Product ID" value={newProduct.productId} onChange={(e) => setNewProduct({ ...newProduct, productId: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Name" value={newProduct.productName} onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Generic" value={newProduct.productGeniric} onChange={(e) => setNewProduct({ ...newProduct, productGeniric: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Supplier" value={newProduct.productSuplier} onChange={(e) => setNewProduct({ ...newProduct, productSuplier: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Strength" value={newProduct.strength} onChange={(e) => setNewProduct({ ...newProduct, strength: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Dose" value={newProduct.dose} onChange={(e) => setNewProduct({ ...newProduct, dose: e.target.value })} className="border p-2 rounded" />
              <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="border p-2 rounded">
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id || c.id || c.name} value={c._id || c.id || c.name}>{c.name || c.title || c.categoryName}</option>
                ))}
              </select>
              <select value={newProduct.subCategory} onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })} className="border p-2 rounded">
                <option value="">Select subcategory</option>
                {subcategories
                  .filter(s => !newProduct.category || s.category === newProduct.category || s.categoryId === newProduct.category || s.parent === newProduct.category)
                  .map((s) => (
                    <option key={s._id || s.id || s.name} value={s._id || s.id || s.name}>{s.name || s.title || s.subCategoryName}</option>
                  ))}
              </select>
              <input placeholder="Price" type="number" step="0.01" value={newProduct.productPrice} onChange={(e) => setNewProduct({ ...newProduct, productPrice: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Discount %" type="number" step="0.01" value={newProduct.discountPercentage} onChange={(e) => setNewProduct({ ...newProduct, discountPercentage: e.target.value })} className="border p-2 rounded" />
              <div className="flex items-center gap-2 p-2 border rounded">
                <input type="checkbox" checked={!!newProduct.isAvailable} onChange={(e) => setNewProduct({ ...newProduct, isAvailable: e.target.checked })} />
                <label className="text-sm">Available</label>
              </div>
              <input type="file" accept="image/*" onChange={(e) => setProductImage(e.target.files?.[0] || null)} className="col-span-1 md:col-span-2" />
              {productImage && (
                <div className="col-span-1 md:col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Selected image preview:</div>
                  <img src={URL.createObjectURL(productImage)} alt="preview" className="w-24 h-24 object-cover rounded" />
                </div>
              )}
              <textarea placeholder="Description" value={newProduct.productDescription} onChange={(e) => setNewProduct({ ...newProduct, productDescription: e.target.value })} className="col-span-1 md:col-span-2 border p-2 rounded" />
              <textarea placeholder="Side effects" value={newProduct.sideEffect} onChange={(e) => setNewProduct({ ...newProduct, sideEffect: e.target.value })} className="col-span-1 md:col-span-2 border p-2 rounded" />

              <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded">
                  {loading ? "Saving..." : editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
