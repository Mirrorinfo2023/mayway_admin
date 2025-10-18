import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Grid,
    Button,
    TextField,
    InputAdornment,
} from "@mui/material";
import { Add, Refresh, Search } from "@mui/icons-material";
import api from "../../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption";
import UpdatesTable from "./UpdatesTable";
import UpdateDialog from "./UpdateDialog";

export default function TodaysUpdates() {
    const [updates, setUpdates] = useState([]);
    const [allUpdates, setAllUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // 📅 Set default date range (current month)
    useEffect(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

        const format = (d) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
                d.getDate()
            ).padStart(2, "0")}`;

        setFromDate(format(firstDay));
        setToDate(format(now));
    }, []);

    const fetchUpdates = async () => {
        try {
            setLoading(true);
            const payload = { from_date: fromDate, to_date: toDate };
            const res = await api.post("/api/admin/get-todays-updates", payload); // no encryption

            if (res.data.status === 200) {
                setUpdates(res.data.data || []);
                setAllUpdates(res.data.data || []);
            } else {
                setUpdates([]);
                setAllUpdates([]);
            }
        } catch (err) {
            console.error("Error fetching updates:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fromDate && toDate) fetchUpdates();
    }, [fromDate, toDate]);

    // 🔍 Filter search
    useEffect(() => {
        let filtered = allUpdates;
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = allUpdates.filter(
                (u) =>
                    u.title?.toLowerCase().includes(term) ||
                    u.tags?.toLowerCase().includes(term)
            );
        }
        setUpdates(filtered);
    }, [searchTerm, allUpdates]);

    // Reset handler
    const handleResetDates = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

        const format = (d) =>
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
                d.getDate()
            ).padStart(2, "0")}`;

        setFromDate(format(firstDay));
        setToDate(format(now));
    };


    const handleEdit = (row) => {
        setEditData(row);
        setDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this update?")) return;

        try {
            const payload = { id };
            await api.post("/api/admin/delete-todays-update", payload); // plain JSON

            alert("✅ Deleted successfully!");
            fetchUpdates(); // refresh the updates list
        } catch (err) {
            console.error("Error deleting:", err);
            alert("Error deleting update");
        }
    };

    const handleHide = async (id) => {
        if (!window.confirm("Are you sure you want to hide this update?")) return;

        try {
            const response = await api.post("/api/admin/hide-todays-update", { id });

            // Check for valid backend response
            if (response?.data?.status === 200) {
                alert("✅ Update hidden successfully!");
                fetchUpdates();
            } else {
                const message = response?.data?.message || "Something went wrong while hiding the update.";
                alert(`⚠️ ${message}`);
                console.error("Unexpected response:", response?.data);
            }
        } catch (error) {
            console.error("❌ Error hiding update:", error);

            // Handle various types of errors gracefully
            if (error.response) {
                // Server responded with a status code outside 2xx
                alert(`❌ Server Error (${error.response.status}): ${error.response.data?.message || "Unable to hide update."}`);
            } else if (error.request) {
                // Request was made but no response received
                alert("⚠️ No response from server. Please check your network connection.");
            } else {
                // Something else happened while setting up the request
                alert(`⚠️ Unexpected error: ${error.message}`);
            }
        }
    };
    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Today’s Updates
            </Typography>

            {/* 🔍 Filter Section */}
            <Card sx={{ boxShadow: 2, mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4} md={3}>
                            <TextField
                                label="Search Title / Tags"
                                fullWidth
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                            <TextField
                                label="From Date"
                                type="date"
                                fullWidth
                                size="small"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={2}>
                            <TextField
                                label="To Date"
                                type="date"
                                fullWidth
                                size="small"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <Button variant="outlined" onClick={handleResetDates}>
                                Reset Dates
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                fullWidth
                                onClick={() => {
                                    setEditData(null);
                                    setDialogOpen(true);
                                }}
                            >
                                Add Update
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* 🧾 Updates Table */}
            <UpdatesTable
                updates={updates}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRefresh={fetchUpdates}
                handleHide={handleHide}

            />

            {/* 📝 Dialog (Add/Edit) */}
            <UpdateDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fetchUpdates={fetchUpdates}
                editData={editData}
            />
        </Container>
    );
}
