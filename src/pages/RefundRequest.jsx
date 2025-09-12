import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const refundData = [
  {
    id: 10,
    orderId: 100134,
    product: "Leather Ladies Bag",
    qty: 1,
    customer: "Devid Jack",
    phone: "+15556768899",
    amount: "6,290.00",
    status: "Pending",
  },
  {
    id: 9,
    orderId: 100136,
    product: "Product name not found",
    qty: null,
    customer: "Devid Jack",
    phone: "+15556768899",
    amount: "441.00",
    status: "Pending",
  },
  {
    id: 8,
    orderId: 100124,
    product: "Product name not found",
    qty: null,
    customer: "Robert Downey",
    phone: "+15551112222",
    amount: "5,820.00",
    status: "Approved",
  },
  {
    id: 2,
    orderId: 100019,
    product: "Copper Alloy Inlaid Zircon Round Ring",
    qty: 1,
    customer: "Robert Downey",
    phone: "+15551112222",
    amount: "5,000.00",
    status: "Rejected",
  },
];

const RefundRequestsScreen = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredRefunds = refundData.filter((item) => {
    const matchesSearch =
      item.orderId.toString().includes(search) ||
      item.id.toString().includes(search);

    const matchesTab =
      selectedTab === "all" || item.status.toLowerCase() === selectedTab;

    return matchesSearch && matchesTab;
  });

  return (
    <Card className="p-4">
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Refund Requests</h2>
            <p className="text-sm text-muted-foreground">Total: {filteredRefunds.length}</p>
          </div>
          <Input
            placeholder="Search by Order ID or Refund ID"
            className="max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="overflow-auto">
          <table className="w-full text-sm text-left border rounded">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2">SL</th>
                <th className="p-2">Refund ID</th>
                <th className="p-2">Order ID</th>
                <th className="p-2">Product Info</th>
                <th className="p-2">Customer Info</th>
                <th className="p-2">Total Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRefunds.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-muted/50 transition"
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.orderId}</td>
                  <td className="p-2">
                    <div>{item.product}</div>
                    {item.qty && <div className="text-muted-foreground">Qty: {item.qty}</div>}
                  </td>
                  <td className="p-2">
                    <div>{item.customer}</div>
                    <div className="text-muted-foreground text-xs">{item.phone}</div>
                  </td>
                  <td className="p-2">{item.amount}</td>
                  <td className="p-2">
                    <Select defaultValue={item.status.toLowerCase()}>
                      <SelectTrigger className="w-28 capitalize">
                        {item.status}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
              {filteredRefunds.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-muted-foreground">
                    No refund requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RefundRequestsScreen;
