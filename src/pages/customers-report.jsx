// src/pages/UserReport.jsx

import React, { useState, useEffect } from 'react';
import { FaEdit, FaUserCheck, FaUserSlash, FaCreditCard } from 'react-icons/fa';
import { fetchUsers, updateUserStatus, creditUserIncome } from '../services/userService';
import { toast } from 'react-toastify';

export default function UserReport() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    isPrime: '',
    fromDate: '',
    toDate: '',
    category: '',
    keyword: '',
  });

  // 1) on mount, load users
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load users');
      }
    })();
  }, []);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  // 2) in‑memory filtering
  const filteredUsers = users.filter(u => {
    const { status, isPrime, category, keyword } = filters;
    if (status && u.status !== status) return false;
    if (isPrime && ((isPrime === 'Prime') !== u.isPrime)) return false;
    if (category && keyword) {
      const val = (u[category] || '').toString().toLowerCase();
      if (!val.includes(keyword.toLowerCase())) return false;
    }
    return true;
  });

  // 3a) toggle active/inactive
  const toggleStatus = async user => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateUserStatus(user.id, newStatus);
      setUsers(us =>
        us.map(x => (x.id === user.id ? { ...x, status: newStatus } : x))
      );
      toast.success(`User ${newStatus.toLowerCase()}`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to change status');
    }
  };

  // 3b) credit affiliate income
  const creditIncome = async user => {
    const amt = prompt('Amount to credit?');
    if (!amt || isNaN(amt)) return;
    try {
      await creditUserIncome(user.id, Number(amt));
      setUsers(us =>
        us.map(x =>
          x.id === user.id
            ? { ...x, affiliateBalance: x.affiliateBalance + Number(amt) }
            : x
        )
      );
      toast.success(`Credited ₹${amt}`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to credit');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">User Report</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <select
          name="status"
          onChange={handleFilterChange}
          className="border rounded px-2 py-1"
        >
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <select
          name="isPrime"
          onChange={handleFilterChange}
          className="border rounded px-2 py-1"
        >
          <option value="">All Plans</option>
          <option>Prime</option>
          <option>Non-Prime</option>
        </select>
        <input
          type="date"
          name="fromDate"
          onChange={handleFilterChange}
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          name="toDate"
          onChange={handleFilterChange}
          className="border rounded px-2 py-1"
        />
        <select
          name="category"
          onChange={handleFilterChange}
          className="border rounded px-2 py-1"
        >
          <option value="">Filter By</option>
          <option value="id">User ID</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>
        <input
          name="keyword"
          onChange={handleFilterChange}
          placeholder="Search..."
          className="border rounded px-2 py-1"
        />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1400px] border text-sm">
          <thead className="bg-blue-100 text-blue-800 font-semibold">
            <tr>
              {[
                'Sr No',
                'Reg. Date',
                'Name',
                'User ID',
                'Mobile',
                'Email',
                'Plan',
                'Referral',
                'City',
                'State',
                'Pincode',
                'Affiliate ₹',
                'Income',
                'Status',
                'Rank',
                'Portfolio',
                'Reason',
                'Actions',
              ].map(h => (
                <th key={h} className="border px-3 py-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={18}
                  className="text-center py-4 text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u, i) => {
                const ref = u.referral || {};
                return (
                  <tr key={u.id} className="hover:bg-blue-50">
                    <td className="border px-3 py-2 text-center">{i + 1}</td>
                    <td className="border px-3 py-2 whitespace-nowrap">
                      {u.registrationDate}
                    </td>
                    <td className="border px-3 py-2">{u.name}</td>
                    <td className="border px-3 py-2">{u.id}</td>
                    <td className="border px-3 py-2">{u.mobile}</td>
                    <td className="border px-3 py-2">{u.email}</td>
                    <td className="border px-3 py-2">{u.plan}</td>
                    <td className="border px-3 py-2">
                      {ref.name || '-'}
                    </td>
                    <td className="border px-3 py-2">{u.city}</td>
                    <td className="border px-3 py-2">{u.state}</td>
                    <td className="border px-3 py-2">{u.pincode}</td>
                    <td className="border px-3 py-2 text-right">
                      ₹{u.affiliateBalance}
                    </td>
                    <td className="border px-3 py-2">
                      {u.incomeHistory}
                    </td>
                    <td className="border px-3 py-2">{u.status}</td>
                    <td className="border px-3 py-2">{u.rank}</td>
                    <td className="border px-3 py-2">
                      {u.portfolio ? (
                        <a
                          href={u.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="border px-3 py-2">
                      {u.inactiveReason || '-'}
                    </td>
                    <td className="border px-3 py-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          title="Edit"
                          className="p-1 bg-blue-100 text-blue-600 rounded"
                        >
                          <FaEdit />
                        </button>
                        <button
                          title="Toggle"
                          className="p-1 bg-yellow-100 text-yellow-600 rounded"
                          onClick={() => toggleStatus(u)}
                        >
                          {u.status === 'Active' ? (
                            <FaUserSlash />
                          ) : (
                            <FaUserCheck />
                          )}
                        </button>
                        <button
                          title="Credit"
                          className="p-1 bg-green-100 text-green-600 rounded"
                          onClick={() => creditIncome(u)}
                        >
                          <FaCreditCard />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

