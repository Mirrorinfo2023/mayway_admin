import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} from "../services/orders_services";
import { Button } from "@/components/ui/button";
import { Loader2, Trash, RotateCcw, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });
  const [searchText, setSearchText] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders(filter);
      setOrders(data || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast.success("Status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handleCancelOrder = async (id) => {
    try {
      await cancelOrder(id);
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err) {
      toast.error("Error cancelling order");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteOrder(id);
      toast.success("Order deleted");
      fetchOrders();
    } catch (err) {
      toast.error("Error deleting order");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Order ID", "Customer", "Amount", "Status", "Date"];
    const tableRows = filteredOrders.map((order) => [
      order.id,
      order.customerName,
      `₹${order.amount}`,
      order.status,
      format(new Date(order.createdAt), "dd MMM yyyy"),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("orders.pdf");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Orders</h2>

      {/* Filter section */}
      <div className="mb-4 flex gap-4 flex-wrap items-center">
        <input
          type="date"
          value={filter.startDate}
          onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={filter.endDate}
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="text"
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <Button onClick={fetchOrders}>Filter</Button>
        <Button variant="outline" onClick={exportToExcel}>Export Excel</Button>
        <Button variant="outline" onClick={exportToPDF}>Export PDF</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6" />
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.customerName}</td>
                    <td className="px-4 py-2">₹{order.amount}</td>
                    <td className="px-4 py-2 capitalize">{order.status}</td>
                    <td className="px-4 py-2">
                      {format(new Date(order.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(
                            order.id,
                            order.status === "processing"
                              ? "completed"
                              : "processing"
                          )
                        }
                      >
                        <RotateCcw size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        <XCircle size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
