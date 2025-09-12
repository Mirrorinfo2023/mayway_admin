"use client";
import React, { useMemo, useState, useEffect } from "react";
import Layout from "@/components/Dashboard/layout";
import {
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  tableCellClasses,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Styled table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// All available keys
const messageKeys = [
  "first_name",
  "last_name",
  "config.APP_NAME",
  "created_on",
  "referal_fname",
  "referal_lname",
  "user_fname",
  "user_lname",
  "mobile",
  "mlm_user_id",
  "config.SUPPORT_TEAM",
  "cbamount",
  "main_amount",
  "consumer_mobile",
  "amount",
  "touserFirstName",
  "touserLastName",
  "fromuserFirstName",
  "fromuserLastName",
  "rejection_reason",
  "reason",
  "wallet_type",
  "name",
  "address",
];

const fillTemplate = (template, values) => {
  if (!template) return "";
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    const trimmedKey = key.trim();
    return values[trimmedKey] ?? `\${${trimmedKey}}`;
  });
};

function SlabSetting() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSlabDialog, setOpenSlabDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [labelOptions, setLabelOptions] = useState([]);

  const [newSlab, setNewSlab] = useState("");
  const [intervalDays, setIntervalDays] = useState(7);

  const [currentMessage, setCurrentMessage] = useState({
    id: "",
    label_name: "",
    whatsapp_content: "",
    email_content: "",
    message_content: "",
  });

  // Fetch slabs on component mount
  useEffect(() => {
    fetchSlabs();
  }, []);

  const fetchSlabs = async () => {
    setLoading(true);
    try {
      // This would be your API call to fetch slabs
      // const response = await api.get("/api/slab/get-slabs");
      // setMessages(response.data);
      // setLabelOptions(response.data.map(slab => slab.label_name));
      
      // For demo purposes, using test data
      setTimeout(() => {
        const testMessages = [
          {
            id: 1,
            label_name: "Welcome Message",
            whatsapp_content: "Welcome to our service {{first_name}}! We are excited to have you on board.",
            email_content: "Dear {{first_name}} {{last_name}},\n\nWelcome to our platform! We look forward to serving you.",
            message_content: "Welcome {{first_name}}! Thank you for joining us.",
            date_time: new Date().toLocaleString(),
          },
          {
            id: 2,
            label_name: "OTP Message",
            whatsapp_content: "Your OTP is {{otp}}. Valid for 5 minutes.",
            email_content: "Your one-time password is {{otp}}\n\nThis OTP is valid for 5 minutes.",
            message_content: "OTP: {{otp}} (Valid for 5 mins)",
            date_time: new Date().toLocaleString(),
          },
        ];
        
        setMessages(testMessages);
        setLabelOptions(["Welcome Message", "OTP Message", "Payment Success", "Password Reset", "Order Confirmation"]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError("Failed to fetch slabs");
      setLoading(false);
    }
  };

  const handleSearch = (value) => setSearchTerm(value);

  const handleViewOpen = (message) => {
    setSelectedMessage(message);
    setOpenViewDialog(true);
  };
  const handleViewClose = () => setOpenViewDialog(false);

  const handleEditOpen = (message) => {
    setCurrentMessage(message);
    setOpenEditDialog(true);
  };
  const handleEditClose = () => setOpenEditDialog(false);

  const resetCurrent = () =>
    setCurrentMessage({
      id: "",
      label_name: "",
      whatsapp_content: "",
      email_content: "",
      message_content: "",
    });

  const handleAddOpen = () => {
    resetCurrent();
    setOpenAddDialog(true);
  };
  const handleAddClose = () => setOpenAddDialog(false);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    
    try {
      if (currentMessage.id) {
        // Update existing slab
        // await api.put(`/api/slab/update-slab/${currentMessage.id}`, currentMessage);
        
        // For demo purposes
        setMessages(prev => 
          prev.map(msg => 
            msg.id === currentMessage.id 
              ? {...currentMessage, date_time: new Date().toLocaleString()} 
              : msg
          )
        );
        setSuccess("Slab updated successfully");
      } else {
        // Add new slab
        // await api.post("/api/slab/add-slab", currentMessage);
        
        // For demo purposes
        const newId = messages.length ? Math.max(...messages.map(m => m.id)) + 1 : 1;
        setMessages(prev => [
          ...prev, 
          {...currentMessage, id: newId, date_time: new Date().toLocaleString()}
        ]);
        setSuccess("Slab added successfully");
      }
      
      if (openEditDialog) handleEditClose();
      if (openAddDialog) handleAddClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save slab");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slab?")) return;
    
    setLoading(true);
    try {
      // await api.delete(`/api/slab/delete-slab/${id}`);
      
      // For demo purposes
      setMessages(prev => prev.filter(msg => msg.id !== id));
      setSuccess("Slab deleted successfully");
      if (openEditDialog) handleEditClose();
    } catch (error) {
      setError("Failed to delete slab");
    } finally {
      setLoading(false);
    }
  };

const handleAddSlab = async () => {
  if (newSlab.trim() === "") {
    setError("Slab name is required");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    console.log("Adding new slab:", { name: newSlab.trim(), interval_days: intervalDays });
    
    // API call using fetch
    const response = await fetch("/api/slab/add-slab", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newSlab.trim(),
        interval_days: intervalDays,
      }),
    });

    console.log("API response status:", response.status);
    
    const responseData = await response.json();
    console.log("API response data:", responseData);

    if (response.ok) {
      console.log("Slab added successfully");
      
      // Update local state
      setLabelOptions(prev => [newSlab, ...prev]);
      setCurrentMessage(prev => ({ ...prev, label_name: newSlab }));
      setNewSlab("");
      setIntervalDays(7);
      setOpenSlabDialog(false);
      setSuccess("Slab type added successfully");
      
      console.log("Local state updated with new slab:", newSlab);
    } else {
      console.error("API error:", responseData);
      setError(responseData.message || "Failed to add slab type");
    }
  } catch (error) {
    console.error("Network error:", error);
    setError("Network error: Failed to connect to server");
  } finally {
    setLoading(false);
    console.log("Loading state set to false");
  }
};

  const filteredMessages = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((m) => {
      const hay =
        `${m.label_name} ${m.whatsapp_content} ${m.email_content} ${m.message_content}`.toLowerCase();
      return hay.includes(q);
    });
  }, [messages, searchTerm]);

  const canSave =
    currentMessage.label_name &&
    (currentMessage.whatsapp_content ||
      currentMessage.email_content ||
      currentMessage.message_content);

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          </Grid>
        )}
        {success && (
          <Grid item xs={12}>
            <Alert severity="success" onClose={() => setSuccess("")}>
              {success}
            </Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
            >
              <Typography variant="h5" color="primary" fontWeight={600}>
                Marketing — Slab Settings
              </Typography>

              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search slabs..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleAddOpen}
                  startIcon={<AddIcon />}
                >
                  Add New Slab
                </Button>
              </Box>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SR No.</StyledTableCell>
                    <StyledTableCell>Slab Name</StyledTableCell>
                    <StyledTableCell>WhatsApp Content</StyledTableCell>
                    <StyledTableCell>Email Content</StyledTableCell>
                    <StyledTableCell>Calls Content</StyledTableCell>
                    <StyledTableCell>Date & Time</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7} align="center">
                        No slabs found.
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    filteredMessages.map((message, index) => (
                      <StyledTableRow key={message.id}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>
                          <Chip label={message.label_name} color="primary" variant="outlined" />
                        </StyledTableCell>

                        <StyledTableCell>
                          {message.whatsapp_content && message.whatsapp_content.length > 40
                            ? `${message.whatsapp_content.substring(0, 40)}…`
                            : message.whatsapp_content || "—"}
                        </StyledTableCell>

                        <StyledTableCell>
                          {message.email_content && message.email_content.length > 40
                            ? `${message.email_content.substring(0, 40)}…`
                            : message.email_content || "—"}
                        </StyledTableCell>

                        <StyledTableCell>
                          {message.message_content && message.message_content.length > 40
                            ? `${message.message_content.substring(0, 40)}…`
                            : message.message_content || "—"}
                        </StyledTableCell>

                        <StyledTableCell>
                          {message.date_time || "—"}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          <IconButton
                            onClick={() => handleViewOpen(message)}
                            color="primary"
                            title="View"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEditOpen(message)}
                            color="secondary"
                            title="Edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(message.id)}
                            color="error"
                            title="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Grid>
      </Grid>

      {/* Edit/Add Dialog */}
      <Dialog
        open={openEditDialog || openAddDialog}
        onClose={currentMessage.id ? handleEditClose : handleAddClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {currentMessage.id ? "Edit Slab" : "Add New Slab"}
          <IconButton
            onClick={currentMessage.id ? handleEditClose : handleAddClose}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
              <FormControl fullWidth>
                <InputLabel id="edit-label-select">Slab Name</InputLabel>
                <Select
                  labelId="edit-label-select"
                  label="Slab Name"
                  value={currentMessage.label_name || ""}
                  onChange={(e) =>
                    setCurrentMessage((prev) => ({
                      ...prev,
                      label_name: e.target.value,
                    }))
                  }
                >
                  {labelOptions.map((label, idx) => (
                    <MenuItem key={idx} value={label}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton color="primary" onClick={() => setOpenSlabDialog(true)}>
                <AddIcon />
              </IconButton>
            </Grid>

            {/* WhatsApp Content with key insert */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="WhatsApp Content"
                value={currentMessage.whatsapp_content || ""}
                onChange={(e) =>
                  setCurrentMessage((prev) => ({
                    ...prev,
                    whatsapp_content: e.target.value,
                  }))
                }
              />
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>Insert Key</InputLabel>
                <Select
                  value=""
                  label="Insert Key"
                  onChange={(e) => {
                    const key = e.target.value;
                    setCurrentMessage((prev) => ({
                      ...prev,
                      whatsapp_content: (prev.whatsapp_content || "") + `{{${key}}}`,
                    }));
                  }}
                >
                  {messageKeys.map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Email Content */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Email Content"
                value={currentMessage.email_content || ""}
                onChange={(e) =>
                  setCurrentMessage((prev) => ({
                    ...prev,
                    email_content: e.target.value,
                  }))
                }
              />
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>Insert Key</InputLabel>
                <Select
                  value=""
                  label="Insert Key"
                  onChange={(e) => {
                    const key = e.target.value;
                    setCurrentMessage((prev) => ({
                      ...prev,
                      email_content: (prev.email_content || "") + `{{${key}}}`,
                    }));
                  }}
                >
                  {messageKeys.map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Calls Content */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Calls Content"
                value={currentMessage.message_content || ""}
                onChange={(e) =>
                  setCurrentMessage((prev) => ({
                    ...prev,
                    message_content: e.target.value,
                  }))
                }
              />
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>Insert Key</InputLabel>
                <Select
                  value=""
                  label="Insert Key"
                  onChange={(e) => {
                    const key = e.target.value;
                    setCurrentMessage((prev) => ({
                      ...prev,
                      message_content: (prev.message_content || "") + `{{${key}}}`,
                    }));
                  }}
                >
                  {messageKeys.map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          {currentMessage.id && (
            <Button
              color="error"
              onClick={() => handleDelete(currentMessage.id)}
              disabled={loading}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
          <Button
            onClick={currentMessage.id ? handleEditClose : handleAddClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={!canSave || loading}
          >
            {loading ? <CircularProgress size={24} /> : (currentMessage.id ? "Update" : "Save")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Slab Dialog */}
      <Dialog open={openSlabDialog} onClose={() => !loading && setOpenSlabDialog(false)}>
        <DialogTitle>Add New Slab Type</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Slab Name"
            fullWidth
            value={newSlab}
            onChange={(e) => setNewSlab(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Interval Days"
            type="number"
            fullWidth
            value={intervalDays}
            onChange={(e) => setIntervalDays(parseInt(e.target.value) || 7)}
            inputProps={{ min: 1 }}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSlabDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddSlab} 
            variant="contained" 
            color="primary"
            disabled={loading || !newSlab.trim()}
          >
            {loading ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={handleViewClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          View Slab: {selectedMessage?.label_name}
          <IconButton onClick={handleViewClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedMessage && (
            <>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                WhatsApp Content
              </Typography>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 1, 
                mb: 2,
                whiteSpace: 'pre-wrap' 
              }}>
                {fillTemplate(selectedMessage.whatsapp_content, {
                  first_name: "John",
                  last_name: "Doe",
                  created_on: new Date().toLocaleString(),
                  address: "Mumbai, India",
                  "config.SUPPORT_TEAM": "Mirror Support Team",
                  otp: "123456",
                })}
              </Box>

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Email Content
              </Typography>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 1, 
                mb: 2,
                whiteSpace: 'pre-wrap' 
              }}>
                {fillTemplate(selectedMessage.email_content, {
                  first_name: "John",
                  last_name: "Doe",
                  created_on: new Date().toLocaleString(),
                  address: "Mumbai, India",
                  "config.SUPPORT_TEAM": "Mirror Support Team",
                  otp: "123456",
                })}
              </Box>

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Calls Content
              </Typography>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 1,
                whiteSpace: 'pre-wrap' 
              }}>
                {fillTemplate(selectedMessage.message_content, {
                  first_name: "John",
                  last_name: "Doe",
                  created_on: new Date().toLocaleString(),
                  address: "Mumbai, India",
                  "config.SUPPORT_TEAM": "Mirror Support Team",
                  otp: "123456",
                })}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

export default SlabSetting;