'use client';

import React, { useEffect, useState } from 'react';
import { getOrders } from '@/services/orders_services';
import { Button } from '@/components/ui/button';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const orders = await getOrders();
    if (orders.length > 0) {
      const latestOrder = orders[0];
      setOrder(latestOrder);
      setStatus(latestOrder.status || 'Pending');
      setPaymentStatus(latestOrder.paymentStatus || 'Unpaid');
      setPaymentMethod(latestOrder.paymentMethod || 'Cash on delivery');
    }
  };

  const downloadInvoice = () => {
    const printContents = document.getElementById('invoice').innerHTML;
    const newWindow = window.open('', '', 'height=600,width=800');
    newWindow.document.write('<html><head><title>Invoice</title></head><body>');
    newWindow.document.write(printContents);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
  };

  if (!order) return <p className="p-4">Loading order details...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Order Details</h2>
        <Button onClick={downloadInvoice}>Download Invoice</Button>
      </div>
      <div id="invoice" className="bg-white p-6 shadow-md rounded-lg">
        <div className="mb-4">
          <p><strong>Order ID:</strong> {order.orderId || order.id}</p>
          <p><strong>Order Date:</strong> {order.date}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Payment Status:</strong> {paymentStatus}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Customer Info</h3>
          <p>{order.customer?.name}</p>
          <p>{order.customer?.email}</p>
          <p>{order.customer?.phone}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Shipping Address</h3>
          <p>{order.address?.line1}</p>
          <p>{order.address?.line2}</p>
          <p>{order.address?.city}, {order.address?.state} {order.address?.zip}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Items</h3>
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Unit Price</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.qty || item.quantity}</td>
                  <td className="p-2 border">₹{item.price}</td>
                  <td className="p-2 border">₹{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold">
            Total Amount: ₹
            {order.items?.reduce(
              (sum, item) => sum + item.price * item.qty,
              0
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
