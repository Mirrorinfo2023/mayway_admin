"use client";
import React, { useMemo, useState } from "react";
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

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

// Demo data
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

function SlabSetting() {
  const [messages, setMessages] = useState(testMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openSlabDialog, setOpenSlabDialog] = useState(false); // NEW dialog for slabs
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Dynamic slab options
  const [labelOptions, setLabelOptions] = useState([
    "Welcome Message",
    "OTP Message",
    "Payment Success",
    "Password Reset",
    "Order Confirmation",
  ]);

  const [newSlab, setNewSlab] = useState("");

  const [currentMessage, setCurrentMessage] = useState({
    id: "",
    label_name: "",
    whatsapp_content: "",
    email_content: "",
    message_content: "",
  });

  // Robust id generator
  const nextId = useMemo(
    () => (messages.length ? Math.max(...messages.map((m) => m.id)) + 1 : 1),
    [messages]
  );

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

  const handleUpdate = () => {
    const timeNow = new Date().toLocaleString();

    if (currentMessage.id) {
      // Update existing
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentMessage.id
            ? { ...currentMessage, date_time: timeNow }
            : msg
        )
      );
      handleEditClose();
    } else {
      // Add new
      setMessages((prev) => [
        ...prev,
        { ...currentMessage, id: nextId, date_time: timeNow },
      ]);
      handleAddClose();
    }
  };

  const handleDelete = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
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

  // Simple validation for Save button
  const canSave =
    currentMessage.label_name &&
    (currentMessage.whatsapp_content ||
      currentMessage.email_content ||
      currentMessage.message_content);

  // Handle adding new slab
  const handleAddSlab = () => {
    if (newSlab.trim() !== "") {
      setLabelOptions([newSlab, ...labelOptions]); // Add to top
      setCurrentMessage((prev) => ({ ...prev, label_name: newSlab })); // Auto-select
      setNewSlab("");
      setOpenSlabDialog(false);
    }
  };

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
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
                <Button variant="contained" color="primary" onClick={handleAddOpen}>
                  Add New Slab
                </Button>
              </Box>
            </Box>

            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>SR No.</StyledTableCell>
                  <StyledTableCell>Slab Name</StyledTableCell>
                  <StyledTableCell>WhatsApp Content</StyledTableCell>
                  <StyledTableCell>Email Content</StyledTableCell>
                  <StyledTableCell>Calls</StyledTableCell>
                  <StyledTableCell>Date &amp; Time</StyledTableCell>
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
                      <StyledTableCell>{message.label_name}</StyledTableCell>

                      <StyledTableCell>
                        {message.whatsapp_content.length > 40
                          ? `${message.whatsapp_content.substring(0, 40)}…`
                          : message.whatsapp_content}
                      </StyledTableCell>

                      <StyledTableCell>
                        {message.email_content.length > 40
                          ? `${message.email_content.substring(0, 40)}…`
                          : message.email_content}
                      </StyledTableCell>

                      <StyledTableCell>
                        {message.message_content.length > 40
                          ? `${message.message_content.substring(0, 40)}…`
                          : message.message_content}
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
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Edit/Add Dialog */}
      <Dialog
        open={openEditDialog || openAddDialog}
        onClose={() => {
          if (currentMessage && currentMessage.id) {
            handleEditClose();
          } else {
            handleAddClose();
          }
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          {currentMessage.id ? "Edit Slab" : "Add New Slab"}
          <IconButton
            onClick={() => {
              if (currentMessage && currentMessage.id) {
                handleEditClose();
              } else {
                handleAddClose();
              }
            }}
            sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: "flex", gap: 1 }}>
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

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="WhatsApp Content"
                value={currentMessage.whatsapp_content}
                onChange={(e) =>
                  setCurrentMessage((prev) => ({
                    ...prev,
                    whatsapp_content: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Email Content"
                value={currentMessage.email_content}
                onChange={(e) =>
                  setCurrentMessage((prev) => ({
                    ...prev,
                    email_content: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Calls Content"
                value={currentMessage.message_content}
                onChange={(e) =>
                  setCurrentMessage((prev) => ({
                    ...prev,
                    message_content: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          {currentMessage.id && (
            <Button
              color="error"
              onClick={() => {
                handleDelete(currentMessage.id);
                handleEditClose();
              }}
            >
              Delete
            </Button>
          )}
          <Button
            onClick={() => {
              if (currentMessage && currentMessage.id) {
                handleEditClose();
              } else {
                handleAddClose();
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            disabled={!canSave}
          >
            {currentMessage.id ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Slab Dialog */}
      <Dialog open={openSlabDialog} onClose={() => setOpenSlabDialog(false)}>
        <DialogTitle>Add New Slab</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Slab Name"
            fullWidth
            value={newSlab}
            onChange={(e) => setNewSlab(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSlabDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSlab} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default SlabSetting;
