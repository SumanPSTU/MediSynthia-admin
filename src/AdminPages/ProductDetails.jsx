import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getProductById(id);
        const payload = res?.data || {};
        const p = payload.product || payload.data || payload;
        setProduct(p);
      } catch (err) {
        console.error('Failed to load product', err?.response || err);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return <div className="p-6 text-center text-xl font-semibold animate-pulse">Loading...</div>;

  if (!product)
    return <div className="p-6 text-center text-lg">Product not found.</div>;

  // Correct image URL
  const imageUrl = product.productImgUrl || "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-3xl shadow-xl border border-gray-100"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
      >
        <span className="text-lg">←</span> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          {imageUrl ? (
            <img
              src={apiUrl/imageUrl}
              alt={product.productName}
              className="w-64 h-64 object-cover rounded-xl shadow-md border"
            />
          ) : (
            <div className="w-64 h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 border">
              No Image
            </div>
          )}
        </motion.div>
           
        {/* Product Info */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {product.productName}
          </h2>
          

          <p className="text-sm text-gray-500 mt-1">
            {product.productGeniric} • {product.strength} {product.dose}
          </p>

          <div className="mt-6 space-y-2 text-gray-700">
            <p><strong>Supplier:</strong> {product.productSuplier || '—'}</p>

            <p>
              <strong>Category:</strong>{" "}
              {product.getCategory?.categoryName ||
                product.category?.name ||
                product.category ||
                "—"}
            </p>

            <p>
              <strong>Subcategory:</strong>{" "}
              {product.getSubCategory?.subCategoryName ||
                product.subCategory?.name ||
                product.subCategory ||
                "—"}
            </p>

            <p>
              <strong>Price:</strong>{" "}
              {product.priceInfo
                ? `$${product.priceInfo.effectivePrice}`
                : product.productPrice
                ? `$${product.productPrice}`
                : "—"}
            </p>

            <p>
              <strong>Discount:</strong>{" "}
              {product.discountPercentage ??
                product.priceInfo?.discountPercentage ??
                0}
              %
            </p>

            <p>
              <strong>Available:</strong>{" "}
              <span className={product.isAvailable ? "text-emerald-600" : "text-red-500"}>
                {product.isAvailable ? "Yes" : "No"}
              </span>
            </p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h4 className="font-semibold text-lg">Description</h4>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              {product.productDescription || "—"}
            </p>
          </div>

          {/* Side Effects */}
          {product.sideEffect && (
            <div className="mt-6">
              <h4 className="font-semibold text-lg">Side Effects</h4>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {product.sideEffect}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default ProductDetails;
