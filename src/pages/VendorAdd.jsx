import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VendorAdd = () => {
  const [formData, setFormData] = useState({
    vendorName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    gstNumber: "",
    panNumber: "",
    aadharNumber: "",
    kycDocuments: {
      aadharFront: null,
      aadharBack: null,
      panCard: null,
      gstCertificate: null,
      businessLicense: null,
    },
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    businessType: "",
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branch: "",
    },
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      kycDocuments: { ...prev.kycDocuments, [name]: files[0] },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vendorName.trim()) newErrors.vendorName = "Vendor name is required";
    if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.businessType.trim()) newErrors.businessType = "Business type is required";

    if (!formData.bankDetails.accountHolderName.trim())
      newErrors.accountHolderName = "Account holder name is required";
    if (!formData.bankDetails.accountNumber.trim())
      newErrors.accountNumber = "Account number is required";
    if (!formData.bankDetails.ifscCode.trim()) newErrors.ifscCode = "IFSC code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      vendorName: formData.vendorName,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      businessType: formData.businessType,
      gstNumber: formData.gstNumber,
      panNumber: formData.panNumber,
      aadharNumber: formData.aadharNumber,
      kycDocuments: formData.kycDocuments, // must already be strings or IDs, not File objects
      address: formData.address,
      bankDetails: formData.bankDetails,
    };

    try {
      const res = await fetch("/api/vendors/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create vendor");
      }

      const data = await res.json();
      alert("Vendor created successfully!");
      console.log(data);
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to create vendor. Please try again.");
    }
  };

  const renderError = (field) =>
    errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>;

  return (
    <div className="p-6 md:p-10 bg-gradient-to-tr from-gray-100 to-white min-h-screen">
      <Card className="max-w-5xl mx-auto shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">Add New Vendor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Vendor Name</Label>
                <Input name="vendorName" value={formData.vendorName} onChange={handleChange} />
                {renderError("vendorName")}
              </div>
              <div>
                <Label>Business Name</Label>
                <Input name="businessName" value={formData.businessName} onChange={handleChange} />
                {renderError("businessName")}
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                {renderError("email")}
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                {renderError("phone")}
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" name="password" value={formData.password} onChange={handleChange} />
                {renderError("password")}
              </div>
              <div>
                <Label>Business Type</Label>
                <Input name="businessType" value={formData.businessType} onChange={handleChange} />
                {renderError("businessType")}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>GST Number</Label>
                <Input name="gstNumber" value={formData.gstNumber} onChange={handleChange} />
              </div>
              <div>
                <Label>PAN Number</Label>
                <Input name="panNumber" value={formData.panNumber} onChange={handleChange} />
              </div>
              <div>
                <Label>Aadhar Number</Label>
                <Input name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Aadhar Front</Label>
                <Input type="file" name="aadharFront" onChange={handleFileChange} />
              </div>
              <div>
                <Label>Aadhar Back</Label>
                <Input type="file" name="aadharBack" onChange={handleFileChange} />
              </div>
              <div>
                <Label>PAN Card</Label>
                <Input type="file" name="panCard" onChange={handleFileChange} />
              </div>
              <div>
                <Label>GST Certificate</Label>
                <Input type="file" name="gstCertificate" onChange={handleFileChange} />
              </div>
              <div>
                <Label>Business License</Label>
                <Input type="file" name="businessLicense" onChange={handleFileChange} />
              </div>
            </div>

            <div className="grid gap-4">
              <h2 className="text-xl font-semibold text-gray-700">Address Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["street", "city", "state", "pincode"].map((field) => (
                  <div key={field}>
                    <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <Input
                      name={field}
                      value={formData.address[field]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, [field]: e.target.value },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <h2 className="text-xl font-semibold text-gray-700">Bank Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.bankDetails).map(([key, value]) => (
                  <div key={key}>
                    <Label>{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                    <Input
                      name={key}
                      value={value}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankDetails: { ...formData.bankDetails, [key]: e.target.value },
                        })
                      }
                    />
                    {renderError(key)}
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Add Vendor
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorAdd;
