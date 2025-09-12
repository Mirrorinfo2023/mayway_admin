import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorKYCList = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKYCData();
  }, []);

  const fetchKYCData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.example.com/vendors/kyc");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching KYC data:", error);
      alert("Failed to load data. Please try again later.");
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`https://api.example.com/vendors/kyc/${id}/approve`);
      fetchKYCData();
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve. Try again.");
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Username", "PAN Number", "Aadhaar Number", "Bank Name", "IFSC Code", "Account Number",
      "Nominee Name", "Nominee Relation", "Address", "Created Date", "Modified Date", "Status", "Rejection Reason"
    ];

    const rows = filteredData.map(item => [
      item.username,
      item.panNumber,
      item.aadhaarNumber,
      item.bankName,
      item.ifscCode,
      item.accountNumber,
      item.nomineeName,
      item.nomineeRelation,
      item.address,
      item.createdDate,
      item.modifiedDate,
      item.status,
      item.rejectionReason || "-"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(value => `"${value}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "kyc_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = item.username.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Vendor KYC List</h2>

      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <button
          onClick={downloadCSV}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Download CSV
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-[1000px] w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Sl No.", "Username", "PAN Number", "Aadhaar Number", "Bank Name", "IFSC Code", "Account Number",
                  "Nominee Name", "Nominee Relation", "Address", "PAN Image", "Aadhaar Image", "Aadhaar Back", "Checkbook",
                  "Created Date", "Modified Date", "Status", "Action", "Rejection Reason"
                ].map((title, idx) => (
                  <th key={idx} className="border px-3 py-2">{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((vendor, index) => (
                <tr key={vendor.id}>
                  <td className="border px-3 py-2 text-center">{index + 1}</td>
                  <td className="border px-3 py-2">{vendor.username}</td>
                  <td className="border px-3 py-2">{vendor.panNumber}</td>
                  <td className="border px-3 py-2">{vendor.aadhaarNumber}</td>
                  <td className="border px-3 py-2">{vendor.bankName}</td>
                  <td className="border px-3 py-2">{vendor.ifscCode}</td>
                  <td className="border px-3 py-2">{vendor.accountNumber}</td>
                  <td className="border px-3 py-2">{vendor.nomineeName}</td>
                  <td className="border px-3 py-2">{vendor.nomineeRelation}</td>
                  <td className="border px-3 py-2">{vendor.address}</td>
                  <td className="border px-3 py-2"><img src={vendor.panImage} alt="PAN" className="w-12 h-12 object-cover" /></td>
                  <td className="border px-3 py-2"><img src={vendor.aadhaarImage} alt="Aadhaar" className="w-12 h-12 object-cover" /></td>
                  <td className="border px-3 py-2"><img src={vendor.aadhaarBackImage} alt="Back" className="w-12 h-12 object-cover" /></td>
                  <td className="border px-3 py-2"><img src={vendor.checkbookImage} alt="Checkbook" className="w-12 h-12 object-cover" /></td>
                  <td className="border px-3 py-2">{vendor.createdDate}</td>
                  <td className="border px-3 py-2">{vendor.modifiedDate}</td>
                  <td className="border px-3 py-2 text-center">{vendor.status}</td>
                  <td className="border px-3 py-2 text-center">
                    {vendor.status === "Pending" ? (
                      <button
                        onClick={() => handleApprove(vendor.id)}
                        className="bg-green-500 text-white px-2 py-1 text-xs rounded"
                      >
                        Approve
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border px-3 py-2">{vendor.rejectionReason || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorKYCList;