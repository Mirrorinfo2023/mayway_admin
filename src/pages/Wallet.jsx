import React, { useState } from "react";
import { Plus, Download, ChevronDown, ChevronUp } from "lucide-react";

const userWallets = [
  {
    userId: 1,
    name: "Devid Jack",
    summary: { credit: 1500.0, debit: 300.0, balance: 1200.0 },
    transactions: [
      {
        id: "tx001",
        credit: 500,
        debit: 0,
        balance: 500,
        type: "Add fund",
        ref: "Initial top-up",
        date: "2024-07-01",
      },
      {
        id: "tx002",
        credit: 0,
        debit: 300,
        balance: 200,
        type: "Order payment",
        ref: "Order #1237",
        date: "2024-07-05",
      },
      { id: "tx003", credit: 1000, debit: 0, balance: 1200, type: "Add fund", ref: "Bonus", date: "2024-07-10" },
    ],
  },
  {
    userId: 2,
    name: "Robert Downey",
    summary: { credit: 5000, debit: 1000, balance: 4000 },
    transactions: [
      // ...
    ],
  },
];

export default function UserWallets() {
  const [searchUser, setSearchUser] = useState("");
  const [openUser, setOpenUser] = useState(null);

  const filteredList = userWallets.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Users Wallet Management</h1>

      {/* Search */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by user name"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="border rounded p-2 flex-1"
        />
      </div>

      {/* User List */}
      <div className="space-y-4">
        {filteredList.map((user) => {
          const isOpen = openUser === user.userId;
          return (
            <div key={user.userId} className="bg-white shadow rounded-md">
              <button
                onClick={() => setOpenUser(isOpen ? null : user.userId)}
                className="w-full flex justify-between items-center p-4"
              >
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <div className="flex gap-4 mt-1 text-sm text-gray-600">
                    <span>Credit: ₹{user.summary.credit.toLocaleString()}</span>
                    <span>Debit: ₹{user.summary.debit.toLocaleString()}</span>
                    <span>Balance: ₹{user.summary.balance.toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>

              {/* Transaction Table */}
              {isOpen && (
                <div className="p-4 border-t">
                  <div className="mb-4 flex justify-end">
                    <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                      <Download size={16} /> Export CSV
                    </button>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2">SL</th>
                        <th className="p-2">Tx ID</th>
                        <th className="p-2">Credit</th>
                        <th className="p-2">Debit</th>
                        <th className="p-2">Balance</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Reference</th>
                        <th className="p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.transactions.map((tx, idx) => (
                        <tr key={tx.id} className="border-t hover:bg-gray-50">
                          <td className="p-2">{idx + 1}</td>
                          <td className="p-2">{tx.id}</td>
                          <td className="p-2 text-green-600">₹{tx.credit}</td>
                          <td className="p-2 text-red-600">₹{tx.debit}</td>
                          <td className="p-2">₹{tx.balance}</td>
                          <td className="p-2">{tx.type}</td>
                          <td className="p-2">{tx.ref || "-"}</td>
                          <td className="p-2">{tx.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
