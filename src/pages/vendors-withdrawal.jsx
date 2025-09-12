'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';

const statuses = ["All", "Pending", "Approved", "Denied"];

export default function VendorWithdrawTable() {
  const [filter, setFilter] = useState("All");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/withdrawals");
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/withdrawals/${id}`, { status: newStatus });
      const updated = data.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      );
      setData(updated);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const filteredData = filter === "All" ? data : data.filter(item => item.status === filter);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Vendor Withdrawal Requests</h2>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {statuses.map(status => (
          <motion.div key={status} whileTap={{ scale: 0.95 }}>
            <Button
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SL</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "Pending"
                          ? "default"
                          : item.status === "Approved"
                            ? "success"
                            : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    {item.status === "Pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleStatusChange(item.id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(item.id, "Denied")}
                        >
                          Deny
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" disabled>
                        No Action
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No records found for <strong>{filter}</strong>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
