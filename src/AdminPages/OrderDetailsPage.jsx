import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// Dummy data for example
const orders = [
  {
    id: 'ORD-1001',
    customer: 'John Doe',
    email: 'john@example.com',
    phone: '+880 1234 567890',
    address: '123 Main Street, Dhaka, Bangladesh',
    total: '$120.00',
    quantity: 3,
    products: [
      { name: 'Paracetamol', qty: 2, price: '$40.00' },
      { name: 'Vitamin C', qty: 1, price: '$80.00' },
    ],
  },
  {
    id: 'ORD-1002',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+880 9876 543210',
    address: '456 Market Road, Dhaka, Bangladesh',
    total: '$250.00',
    quantity: 5,
    products: [
      { name: 'Insulin', qty: 5, price: '$250.00' },
    ],
  },
];

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="p-6 text-center text-gray-500">
        Order not found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Orders
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl bg-emerald-500 p-6 text-white shadow-lg"
      >
        <h1 className="text-2xl sm:text-3xl font-semibold">{order.customer}</h1>
        <p className="mt-1 sm:text-lg">Order ID: {order.id}</p>
      </motion.div>

      {/* Customer Info */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 space-y-3">
        <h2 className="text-xl font-semibold mb-3">Customer Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
          <div>
            <p className="font-medium">Name:</p>
            <p>{order.customer}</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p>{order.email}</p>
          </div>
          <div>
            <p className="font-medium">Phone:</p>
            <p>{order.phone}</p>
          </div>
          <div>
            <p className="font-medium">Address:</p>
            <p>{order.address}</p>
          </div>
          <div>
            <p className="font-medium">Total Amount:</p>
            <p>{order.total}</p>
          </div>
          <div>
            <p className="font-medium">Quantity:</p>
            <p>{order.quantity}</p>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Products</h2>

        <table className="w-full text-sm sm:text-base border-collapse">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, idx) => (
              <tr
                key={idx}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.qty}</td>
                <td className="px-4 py-3">{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderDetailsPage;
