"use client";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
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
  Divider,
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
} from "@mui/material";

import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

// Static test data
const testMessages = [
  {
    id: 1,
    label_name: "Welcome Message",
    whatsapp_content:
      "Welcome to our service! We are excited to have you on board.",
    email_content:
      "Dear Customer,\n\nWelcome to our platform! We look forward to serving you.",
    message_content: "Welcome! Thank you for joining us.",
    date_time: new Date().toLocaleString(),
  },
  {
    id: 2,
    label_name: "OTP Message",
    whatsapp_content: "Your OTP is 123456. Valid for 5 minutes.",
    email_content:
      "Your one-time password is 123456\n\nThis OTP is valid for 5 minutes.",
    message_content: "OTP: 123456 (Valid for 5 mins)",
    date_time: new Date().toLocaleString(),
  },
];

// Label options
const labelOptions = [
  "Welcome Message",
  "OTP Message",
  "Payment Success",
  "Password Reset",
  "Order Confirmation",
];

// All keywords for template detection
const templateKeywords = [
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
];

function MessageSetting() {
  const [messages, setMessages] = useState(testMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentMessage, setCurrentMessage] = useState({
    id: "",
    label_name: "",
    whatsapp_content: "",
    email_content: "",
    message_content: "",
  });

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

  const handleAddOpen = () => {
    setCurrentMessage({
      id: "",
      label_name: "",
      whatsapp_content: "",
      email_content: "",
      message_content: "",
    });
    setOpenAddDialog(true);
  };
  const handleAddClose = () => setOpenAddDialog(false);

  const handleUpdate = () => {
    if (currentMessage.id) {
      const updatedMessages = messages.map((msg) =>
        msg.id === currentMessage.id
          ? { ...currentMessage, date_time: new Date().toLocaleString() }
          : msg
      );
      setMessages(updatedMessages);
    } else {
      const newMessage = {
        ...currentMessage,
        id: messages.length + 1,
        date_time: new Date().toLocaleString(),
      };
      setMessages([...messages, newMessage]);
    }
    handleEditClose();
    handleAddClose();
  };

  const handleDelete = (id) => setMessages(messages.filter((msg) => msg.id !== id));

  // Filter messages by search term or template keywords
  const filteredMessages = messages.filter((message) => {
    const searchLower = searchTerm.toLowerCase();
    const contentToSearch =
      message.whatsapp_content + " " +
      message.email_content + " " +
      message.message_content;

    const matchesNormal = contentToSearch.toLowerCase().includes(searchLower);
    const matchesTemplate = templateKeywords.some((keyword) =>
      contentToSearch.includes(keyword)
    );

    return matchesNormal || matchesTemplate;
  });

  return (
    <Layout>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={3}>
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={2}>
              <Typography variant="h5" color="primary">
                Message Settings
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search messages..."
                  InputProps={{ startAdornment: <SearchIcon color="action" /> }}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddOpen}>
                  Add New Message
                </Button>
              </Box>
            </Box>

            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>SR No.</StyledTableCell>
                  <StyledTableCell>Label Name</StyledTableCell>
                  <StyledTableCell>WhatsApp Content</StyledTableCell>
                  <StyledTableCell>Email Content</StyledTableCell>
                  <StyledTableCell>Message</StyledTableCell>
                  <StyledTableCell>Date & Time</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMessages.map((message, index) => (
                  <StyledTableRow key={message.id}>
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{message.label_name}</StyledTableCell>
                    <StyledTableCell>
                      {message.whatsapp_content.length > 30
                        ? `${message.whatsapp_content.substring(0, 30)}...`
                        : message.whatsapp_content}
                    </StyledTableCell>
                    <StyledTableCell>
                      {message.email_content.length > 30
                        ? `${message.email_content.substring(0, 30)}...`
                        : message.email_content}
                    </StyledTableCell>
                    <StyledTableCell>
                      {message.message_content.length > 30
                        ? `${message.message_content.substring(0, 30)}...`
                        : message.message_content}
                    </StyledTableCell>
                    <StyledTableCell>{message.date_time || "—"}</StyledTableCell>
                    <StyledTableCell>
                      <IconButton onClick={() => handleViewOpen(message)} color="primary" title="View">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditOpen(message)} color="secondary" title="Edit">
                        <EditIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={handleViewClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Message Details
          <IconButton onClick={handleViewClose} sx={{ position: "absolute", right: 8, top: 8, color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          {selectedMessage && (
            <Box>
              <Typography variant="h6" gutterBottom>
                <strong>Label Name:</strong> {selectedMessage.label_name}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                <strong>WhatsApp Content:</strong>
              </Typography>
              <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                {selectedMessage.whatsapp_content}
              </Box>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email Content:</strong>
              </Typography>
              <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                {selectedMessage.email_content}
              </Box>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                <strong>Message Content:</strong>
              </Typography>
              <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                {selectedMessage.message_content}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit/Add Dialog */}
      <Dialog
        open={openEditDialog || openAddDialog}
        onClose={() => {
          if (currentMessage && currentMessage.id) handleEditClose();
          else handleAddClose();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {currentMessage.id ? "Edit Message" : "Add New Message"}
          <IconButton
            onClick={() => {
              if (currentMessage && currentMessage.id) handleEditClose();
              else handleAddClose();
            }}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="label-select">Label Name</InputLabel>
                <Select
                  labelId="label-select"
                  value={currentMessage.label_name || ""}
                  onChange={(e) => setCurrentMessage({ ...currentMessage, label_name: e.target.value })}
                >
                  {labelOptions.map((label, idx) => (
                    <MenuItem key={idx} value={label}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="WhatsApp Content"
                value={currentMessage.whatsapp_content}
                onChange={(e) => setCurrentMessage({ ...currentMessage, whatsapp_content: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Email Content"
                value={currentMessage.email_content}
                onChange={(e) => setCurrentMessage({ ...currentMessage, email_content: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Message Content"
                value={currentMessage.message_content}
                onChange={(e) => setCurrentMessage({ ...currentMessage, message_content: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {currentMessage.id && (
            <Button color="error" onClick={() => { handleDelete(currentMessage.id); handleEditClose(); }}>
              Delete
            </Button>
          )}
          <Button onClick={() => { if (currentMessage && currentMessage.id) handleEditClose(); else handleAddClose(); }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            {currentMessage.id ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default MessageSetting;
