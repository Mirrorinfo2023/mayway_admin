import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  TableContainer,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import * as React from "react";
import SearchIcon from '@mui/icons-material/Search';
import ReCAPTCHA from "react-google-recaptcha";
import { DataEncrypt ,DataDecrypt} from "../../../utils/encryption"; // Make sure this path is correct

const AddInvestMentTransactions = () => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  // Dummy user data
  const dummyUsers = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+1234567890' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1234567891' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', phone: '+1234567892' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', phone: '+1234567893' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', phone: '+1234567894' },
    { id: 6, name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+1234567895' },
    { id: 7, name: 'Robert Miller', email: 'robert.miller@example.com', phone: '+1234567896' },
    { id: 8, name: 'Lisa Garcia', email: 'lisa.garcia@example.com', phone: '+1234567897' },
  ];

  // Filter users based on search query
  const filteredUsers = dummyUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const handleSubmit = async () => {
    if (!selectedUser) {
      alert("Please select a user first");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    // 🔹 Prepare the payload as expected by backend
    const payload = {
      plan_id: 3,
      user_id: selectedUser.id,
      amount: parseFloat(amount),
      wallet: "Main",
      sender_user_id: 1,
      recaptcha_token: recaptchaToken, // optional if backend verifies
    };

    try {
      // 🔹 Encrypt the payload
      const encryptedPayload = DataEncrypt(JSON.stringify(payload));

      console.log("Encrypted payload:", encryptedPayload);

      // 🔹 Send encrypted payload to backend
      const response = await api.post(
        "/api/referral/plan/d376ca2995b3d140552f1bf6bc31c2eda6c9cfc8",
        { data: encryptedPayload } // backend expects { data: encryptedString }
      );

      // 🔹 Decrypt response if needed (optional)
      const decryptedResponse = DataDecrypt(response.data.data);
      console.log("Decrypted response:", decryptedResponse);

      if (response) {
        alert(`Prime added successfully for ${selectedUser.name}`);
        window.history.back();
      }
    } catch (error) {
      console.error("Error adding investment:", error);
      alert("Error adding prime. Please try again.");
    }
  };
  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{ borderRadius: '8px', overflow: 'hidden' }}
          >
            <Box
              sx={{
                padding: '24px',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                Add New Prime
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* User Search Selector */}
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={filteredUsers}
                    getOptionLabel={(option) => `${option.name} (${option.email})`}
                    value={selectedUser}
                    onChange={(event, newValue) => {
                      setSelectedUser(newValue);
                      setUserId(newValue ? newValue.id : '');
                    }}
                    onInputChange={(event, newInputValue) => {
                      setSearchQuery(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        fullWidth
                        label="Search and Select User"
                        variant="outlined"
                        placeholder="Search by name, email, or phone..."
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                      />
                    )}
                  />
                </Grid>

                {/* Selected User Display */}
                {selectedUser && (
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Selected User:
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {selectedUser.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {selectedUser.id} • {selectedUser.email}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Amount Input */}
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Amount"
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    disabled={!selectedUser}
                    helperText={!selectedUser ? "Please select a user first" : ""}
                    sx={{ '& .MuiOutlinedInput-root': { height: '56px' } }}
                  />
                </Grid>

                {/* Google reCAPTCHA */}
                <Grid item xs={12} md={6}>
                  <ReCAPTCHA
                    sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1" // 🔹 put your site key here
                    onChange={(token) => setRecaptchaToken(token)}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleSubmit}
                      disabled={!selectedUser || !amount || amount <= 0 || !recaptchaToken}
                      sx={{
                        px: 4,
                        py: 1,
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' },
                        '&:disabled': { backgroundColor: '#ccc', color: '#666' },
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>
    </main>
  );
};

export default AddInvestMentTransactions;
