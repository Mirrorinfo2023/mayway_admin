import { get, post, put, deleteReq } from '../utils/network';

// Create Vendor
export const createVendor = async (payload) => {
  return await post({
    path: '/vendors/create',
    data: payload,
  });
};

// Get All Vendors
export const getAllVendors = async () => {
  return await get({
    path: '/vendors/getall',
  });
};

// Get Vendor by ID
export const getVendorById = async (vendorId) => {
  return await get({
    path: `/vendors/get/${vendorId}`,
  });
};

// Update Vendor
export const updateVendor = async (vendorId, payload) => {
  return await put({
    path: `/vendors/update/${vendorId}`,
    data: payload,
  });
};

// Delete Vendor
export const deleteVendor = async (vendorId) => {
  return await deleteReq({
    path: `/vendors/delete/${vendorId}`,
  });
};

// Vendor Login
export const vendorLogin = async ({ email, password }) => {
  return await post({
    path: '/vendors/login',
    data: { email, password },
  });
};


const handleVendorLogin = async () => {
  try {
    const response = await vendorLogin({
      email: 'john@example.com',
      password: 'securepassword123',
    });
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const handleUpdateVendor = async () => {
  try {
    const response = await updateVendor('VENDOR_ID_HERE', {
      vendorName: 'Updated Name',
      businessName: 'Updated Business',
    });
    console.log('Vendor updated:', response);
  } catch (error) {
    console.error('Update failed:', error);
  }
};


const handleCreateVendor = async () => {
  try {
    const payload = {
      vendorName: 'John Doe',
      businessName: 'JD Enterprises',
      email: 'john@example.com',
      phone: '9876543210',
      password: 'securepassword123',
      gstNumber: '27ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      aadharNumber: '123412341234',
      kycDocuments: {
        aadharFront: 'front.jpg',
        aadharBack: 'back.jpg',
        panCard: 'pan.jpg',
        gstCertificate: 'gst.jpg',
        businessLicense: 'license.jpg',
      },
      address: {
        street: '123 Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      businessType: 'individual',
      bankDetails: {
        accountHolderName: 'John Doe',
        accountNumber: '1234567890',
        ifscCode: 'SBIN0001234',
        bankName: 'SBI',
        branch: 'Mumbai Branch',
      },
    };

    const response = await createVendor(payload);
    console.log('Vendor created:', response);
  } catch (error) {
    console.error('Failed to create vendor:', error);
  }
};
