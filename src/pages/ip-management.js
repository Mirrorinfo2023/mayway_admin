import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Grid,
    MenuItem,
    InputAdornment
} from '@mui/material';
import { Check, Close, Refresh, Search } from '@mui/icons-material';
import Layout from '@/components/Dashboard/layout';
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";

export default function IpManagement() {
    const [allIpRequests, setAllIpRequests] = useState([]); // store full data
    const [ipRequests, setIpRequests] = useState([]); // filtered data
    const [loading, setLoading] = useState(true);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedIp, setSelectedIp] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [updating, setUpdating] = useState(false);

    // Search & Filter
    const [searchName, setSearchName] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // 🗓️ Set current month start → today
    useEffect(() => {
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const today = new Date();

        setFromDate(formatDate(firstDay)); // ✅ Correct local month start
        setToDate(formatDate(today));      // ✅ Correct today's date
    }, []);

    // 📦 Fetch data only when date changes
    const fetchIpRequests = async () => {
        try {
            setLoading(true);

            const payload = { from_date: fromDate, to_date: toDate };
            const res = await api.post('/api/users/get-ips-list', payload);
            const decrypted = DataDecrypt(res.data);
            const data = typeof decrypted === 'string' ? JSON.parse(decrypted) : decrypted;

            if (data.status === 200) {
                setAllIpRequests(data.data || []);
                setIpRequests(data.data || []);
            } else {
                setAllIpRequests([]);
                setIpRequests([]);
            }

        } catch (err) {
            console.error('❌ Error fetching IP requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fromDate && toDate) fetchIpRequests();
    }, [fromDate, toDate]);

    // 🔍 Real-time frontend search filter
    useEffect(() => {
        let filtered = [...allIpRequests];

        if (searchName.trim()) {
            const term = searchName.toLowerCase();
            filtered = filtered.filter(ip =>
                (ip.user_name || '').toLowerCase().includes(term) ||
                (ip.company_name || '').toLowerCase().includes(term) ||
                (ip.mobile || '').includes(term)
            );
        }

        if (searchStatus !== '') {
            filtered = filtered.filter(ip => String(ip.status) === String(searchStatus));
        }

        setIpRequests(filtered);
    }, [searchName, searchStatus, allIpRequests]);

    // 🧹 Reset filters
    const handleResetFilters = () => {
        setSearchName('');
        setSearchStatus('');
        setIpRequests(allIpRequests);
    };

    // Update IP status
    const updateIpStatus = async (ipId, status, reason = '') => {
        try {
            setUpdating(true);
            const payload = { id: ipId, status, reason };
            const encReq = DataEncrypt(JSON.stringify(payload));
            const res = await api.post('/api/users/update-status-ips', { encReq });
            const decrypted = DataDecrypt(res.data);
            const data = typeof decrypted === 'string' ? JSON.parse(decrypted) : decrypted;

            if (data.status === 200) {
                alert(data.message || 'Status updated');
                fetchIpRequests();
                setRejectDialogOpen(false);
                setRejectReason('');
                setSelectedIp(null);
            } else {
                alert(data.message || 'Failed to update');
            }
        } catch (err) {
            console.error('Error updating IP status:', err);
            alert('Failed to update IP status');
        } finally {
            setUpdating(false);
        }
    };

    const handleRejectClick = (ip) => {
        setSelectedIp(ip);
        setRejectReason('');
        setRejectDialogOpen(true);
    };

    const handleRejectSubmit = () => {
        if (!rejectReason.trim()) {
            alert('Please enter rejection reason');
            return;
        }
        updateIpStatus(selectedIp.id, 2, rejectReason);
    };

    const handleApprove = (ip) => {
        if (confirm(`Approve IP: ${ip.ip_address}?`)) {
            updateIpStatus(ip.id, 1);
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case 0: return <Chip label="Pending" color="warning" size="small" />;
            case 1: return <Chip label="Approved" color="success" size="small" />;
            case 2: return <Chip label="Rejected" color="error" size="small" />;
            default: return <Chip label="Unknown" size="small" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading && ipRequests.length === 0) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box sx={{ p: 2, minHeight: '100vh' }}>
                <Container maxWidth="xl">
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        IP Management
                    </Typography>

                    {/* 🔍 Filter Section */}
                    <Card sx={{ boxShadow: 2, mb: 3 }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                {/* Search by Name */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Search by Name / Company / Mobile"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                {/* Status */}
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Status"
                                        value={searchStatus}
                                        onChange={(e) => setSearchStatus(e.target.value)}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="0">Pending</MenuItem>
                                        <MenuItem value="1">Approved</MenuItem>
                                        <MenuItem value="2">Rejected</MenuItem>
                                    </TextField>
                                </Grid>

                                {/* From Date */}
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="From Date"
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                {/* To Date */}
                                <Grid item xs={12} sm={6} md={2}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="To Date"
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                {/* Reset */}
                                <Grid item xs={12} sm={6} md={2}>
                                    <Button variant="outlined" onClick={handleResetFilters} fullWidth>
                                        Reset
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* 🧾 Table */}
                    <Card sx={{ boxShadow: 2 }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        IP Requests ({ipRequests.length})
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Refresh />}
                                        onClick={fetchIpRequests}
                                        disabled={loading}
                                    >
                                        Refresh
                                    </Button>
                                </Box>
                            </Box>

                            {ipRequests.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography color="text.secondary">No IP requests found</Typography>
                                </Box>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableRow>
                                                <TableCell>User</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>IP Address</TableCell>
                                                <TableCell>Mobile</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Action</TableCell>
                                                <TableCell>Reject Reason</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {ipRequests.map((ip) => (
                                                <TableRow key={ip.id} hover>
                                                    <TableCell>{ip.user_name}</TableCell>
                                                    <TableCell>{formatDate(ip.created_on)}</TableCell>
                                                    <TableCell>{ip.ip_address}</TableCell>
                                                    <TableCell>{ip.mobile}</TableCell>
                                                    <TableCell>{getStatusChip(ip.status)}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                size="small"
                                                                onClick={() => handleApprove(ip)}
                                                                disabled={ip.status === 1 || updating}
                                                            >
                                                                {ip.status === 1 ? 'Approved' : 'Approve'}
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                size="small"
                                                                onClick={() => handleRejectClick(ip)}
                                                                disabled={ip.status === 2 || updating}
                                                            >
                                                                {ip.status === 2 ? 'Rejected' : 'Reject'}
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{ip.reject_reason || '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* 🚫 Reject Dialog */}
                    <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>Reject IP</DialogTitle>
                        <DialogContent>
                            <Typography sx={{ mb: 2 }}>
                                IP: {selectedIp?.ip_address} <br />
                                User: {selectedIp?.user_name}
                            </Typography>
                            <TextField
                                label="Rejection Reason"
                                multiline
                                rows={3}
                                fullWidth
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleRejectSubmit}
                                disabled={updating || !rejectReason.trim()}
                            >
                                {updating ? 'Rejecting...' : 'Reject'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Layout>
    );
}
