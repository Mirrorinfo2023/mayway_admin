"use client"
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import ProfitTransactions from "@/components/ProfitReturn/ProfitReturn";
import {
    Grid,
    Button,
    Paper,
    Typography,
    Box,
    Card,
    TextField,
    MenuItem,
    InputAdornment,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip,
    FormControlLabel,
    Checkbox,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import { styled } from '@mui/material/styles';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from 'xlsx';

const StatCard = styled(Card)(({ bgcolor }) => ({
    background: bgcolor,
    color: '#fff',
    borderRadius: 16,
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 240,
    minHeight: 120,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    },
}));

const StatContent = styled('div')({
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
});

const StatValue = styled('div')({
    fontSize: 36,
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 8,
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
});

const StatLabel = styled('div')({
    fontSize: 14,
    fontWeight: 600,
    opacity: 0.9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
});

const StatIcon = styled('div')({
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.2,
    fontSize: 72,
    zIndex: 1,
});

const FilterSection = styled(Paper)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 20,
    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
    padding: '24px',
    marginBottom: 24,
    color: 'white',
}));

const FilterRow = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'white',
        borderRadius: 12,
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'white',
    },
    '& .MuiInputBase-input': {
        color: '#333',
    },
});

const AdvancedSearchDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        maxWidth: 800,
    },
});

function ProfitReturn(props) {
    const [report, setReport] = useState([]);
    const [filteredReport, setFilteredReport] = useState([]);
    const [stats, setStats] = useState({
        total_count: 0,
        total_active: 0,
        total_inactive: 0,
        total_deleted: 0
    });
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        plan: 'all',
        payoutCycle: 'all',
        minInvestment: '',
        maxInvestment: '',
        minTodayEarning: '',
        maxTodayEarning: '',
        minTotalReturn: '',
        maxTotalReturn: ''
    });
    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({
        email: '',
        mobile: '',
        mrId: '',
        userId: '',
        minMonthTeamEarning: '',
        maxMonthTeamEarning: '',
        minTotalTeamEarning: '',
        maxTotalTeamEarning: '',
        minTotalRemaining: '',
        maxTotalRemaining: ''
    });
    const [selectedColumns, setSelectedColumns] = useState({
        user_id: true,
        user_name: true,
        mr_id: true,
        mobile: true,
        email: true,
        registration_date: true,
        investment_date: true,
        investment_amount: true,
        user_in: true,
        payout_cycle: true,
        status: true,
        today_earning: true,
        this_month_return: true,
        month_team_earning: true,
        total_return: true,
        total_team_earning: true,
        total_remaining: true
    });

    const dispatch = useDispatch();

    const uniquePlans = useMemo(() => {
        const plans = report.map(user => user.user_in).filter(Boolean);
        return [...new Set(plans)];
    }, [report]);

    const uniquePayoutCycles = useMemo(() => {
        const cycles = report.map(user => user.payout_cycle).filter(Boolean);
        return [...new Set(cycles)];
    }, [report]);

    useEffect(() => {
        generateReport();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [report, filters, advancedFilters]);

    const generateReport = async () => {
        try {
            const response = await api.get("/api/admin/profitreturnreport");

            if (response.status === 200) {
                console.log(response.data);
                setReport(response.data.report || []);

                const reportData = response.data.report || [];
                const activeCount = reportData.filter(user => user.status === 'Active').length;
                const inactiveCount = reportData.filter(user => user.status === 'Inactive').length;

                setStats({
                    total_count: response.data.count || reportData.length,
                    total_active: activeCount,
                    total_inactive: inactiveCount,
                    total_deleted: 0
                });
            }
        } catch (error) {
            if (error?.response?.data?.error) {
                dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
            } else {
                dispatch(callAlert({ message: error.message, type: 'FAILED' }))
            }
        }
    };

    const applyFilters = () => {
        let filtered = [...report];

        // Basic search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(user =>
                user.user_name?.toLowerCase().includes(searchLower) ||
                user.mr_id?.toLowerCase().includes(searchLower) ||
                user.mobile?.includes(searchLower) ||
                user.user_in?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(user => user.status === filters.status);
        }

        // Plan filter
        if (filters.plan !== 'all') {
            filtered = filtered.filter(user => user.user_in === filters.plan);
        }

        // Payout cycle filter
        if (filters.payoutCycle !== 'all') {
            filtered = filtered.filter(user => user.payout_cycle === filters.payoutCycle);
        }

        // Investment range filter
        if (filters.minInvestment) {
            filtered = filtered.filter(user =>
                parseFloat(user.investment_amount || 0) >= parseFloat(filters.minInvestment)
            );
        }
        if (filters.maxInvestment) {
            filtered = filtered.filter(user =>
                parseFloat(user.investment_amount || 0) <= parseFloat(filters.maxInvestment)
            );
        }

        // Today earning range filter
        if (filters.minTodayEarning) {
            filtered = filtered.filter(user =>
                parseFloat(user.today_earning || 0) >= parseFloat(filters.minTodayEarning)
            );
        }
        if (filters.maxTodayEarning) {
            filtered = filtered.filter(user =>
                parseFloat(user.today_earning || 0) <= parseFloat(filters.maxTodayEarning)
            );
        }

        // Total return range filter
        if (filters.minTotalReturn) {
            filtered = filtered.filter(user =>
                parseFloat(user.total_return || 0) >= parseFloat(filters.minTotalReturn)
            );
        }
        if (filters.maxTotalReturn) {
            filtered = filtered.filter(user =>
                parseFloat(user.total_return || 0) <= parseFloat(filters.maxTotalReturn)
            );
        }

        // Advanced filters
        if (advancedFilters.email) {
            filtered = filtered.filter(user =>
                user.email?.toLowerCase().includes(advancedFilters.email.toLowerCase())
            );
        }
        if (advancedFilters.mobile) {
            filtered = filtered.filter(user =>
                user.mobile?.includes(advancedFilters.mobile)
            );
        }
        if (advancedFilters.mrId) {
            filtered = filtered.filter(user =>
                user.mr_id?.toLowerCase().includes(advancedFilters.mrId.toLowerCase())
            );
        }
        if (advancedFilters.userId) {
            filtered = filtered.filter(user =>
                user.user_id?.toString().includes(advancedFilters.userId)
            );
        }
        if (advancedFilters.minMonthTeamEarning) {
            filtered = filtered.filter(user =>
                parseFloat(user.month_team_earning || 0) >= parseFloat(advancedFilters.minMonthTeamEarning)
            );
        }
        if (advancedFilters.maxMonthTeamEarning) {
            filtered = filtered.filter(user =>
                parseFloat(user.month_team_earning || 0) <= parseFloat(advancedFilters.maxMonthTeamEarning)
            );
        }
        if (advancedFilters.minTotalTeamEarning) {
            filtered = filtered.filter(user =>
                parseFloat(user.total_team_earning || 0) >= parseFloat(advancedFilters.minTotalTeamEarning)
            );
        }
        if (advancedFilters.maxTotalTeamEarning) {
            filtered = filtered.filter(user =>
                parseFloat(user.total_team_earning || 0) <= parseFloat(advancedFilters.maxTotalTeamEarning)
            );
        }
        if (advancedFilters.minTotalRemaining) {
            filtered = filtered.filter(user =>
                parseFloat(user.total_remaining || 0) >= parseFloat(advancedFilters.minTotalRemaining)
            );
        }
        if (advancedFilters.maxTotalRemaining) {
            filtered = filtered.filter(user =>
                parseFloat(user.total_remaining || 0) <= parseFloat(advancedFilters.maxTotalRemaining)
            );
        }

        setFilteredReport(filtered);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAdvancedFilterChange = (field, value) => {
        setAdvancedFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleColumnToggle = (column) => {
        setSelectedColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            plan: 'all',
            payoutCycle: 'all',
            minInvestment: '',
            maxInvestment: '',
            minTodayEarning: '',
            maxTodayEarning: '',
            minTotalReturn: '',
            maxTotalReturn: ''
        });
        setAdvancedFilters({
            email: '',
            mobile: '',
            mrId: '',
            userId: '',
            minMonthTeamEarning: '',
            maxMonthTeamEarning: '',
            minTotalTeamEarning: '',
            maxTotalTeamEarning: '',
            minTotalRemaining: '',
            maxTotalRemaining: ''
        });
    };

 const downloadExcel = () => {
    // Prepare data with user-friendly column names and formatted values
    const dataToExport = filteredReport.map(user => {
        const row = {};
        
        // User Details
        if (selectedColumns.user_name) {
            row['User Name'] = user.user_name || '';
        }
        if (selectedColumns.user_id) {
            row['User ID'] = user.user_id || '';
        }
        if (selectedColumns.mobile) {
            row['Mobile'] = user.mobile || '';
        }
        if (selectedColumns.mr_id) {
            row['MR ID'] = user.mr_id || '';
        }
        
        // Dates with proper formatting
        if (selectedColumns.registration_date) {
            row['Registration Date'] = user.registration_date ? formatExcelDate(user.registration_date) : '';
        }
        if (selectedColumns.investment_date) {
            row['Investment Date'] = user.investment_date ? formatExcelDate(user.investment_date) : '';
        }
        
        // Amounts with proper formatting
        if (selectedColumns.investment_amount) {
            row['Investment Amount'] = user.investment_amount ? formatExcelCurrency(user.investment_amount) : '';
        }
        if (selectedColumns.today_earning) {
            row['Today Earning'] = user.today_earning ? formatExcelCurrency(user.today_earning) : '';
        }
        if (selectedColumns.this_month_return) {
            row['Month Return'] = user.this_month_return ? formatExcelCurrency(user.this_month_return) : '';
        }
        if (selectedColumns.total_return) {
            row['Total Return'] = user.total_return ? formatExcelCurrency(user.total_return) : '';
        }
        if (selectedColumns.total_remaining) {
            row['Remaining Amount'] = user.total_remaining ? formatExcelCurrency(user.total_remaining) : '';
        }
        
        // Other user-friendly fields
        if (selectedColumns.user_in) {
            row['Plan'] = user.user_in || '';
        }
        if (selectedColumns.status) {
            row['Status'] = user.status || '';
        }
        
        return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Profit Return Report");

    // Auto-size columns based on content
    if (dataToExport.length > 0) {
        const colWidths = Object.keys(dataToExport[0]).map(key => {
            const maxLength = Math.max(
                key.length, // Header length
                ...dataToExport.map(row => String(row[key] || '').length)
            );
            return { width: Math.min(Math.max(maxLength + 2, 12), 30) };
        });
        worksheet['!cols'] = colWidths;
    }

    XLSX.writeFile(workbook, `profit-return-report-${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Helper function to format dates for Excel
const formatExcelDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch {
        return dateString;
    }
};

// Helper function to format currency for Excel
const formatExcelCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0.00';
    const numAmount = parseFloat(amount);
    return `₹${numAmount.toLocaleString('en-IN', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    })}`;
};

    const formatColumnName = (key) => {
        const names = {
            user_id: 'User ID',
            user_name: 'User Name',
            mr_id: 'MR ID',
            mobile: 'Mobile',
            email: 'Email',
            registration_date: 'Registration Date',
            investment_date: 'Investment Date',
            investment_amount: 'Investment Amount',
            user_in: 'Plan',
            payout_cycle: 'Payout Cycle',
            status: 'Status',
            today_earning: 'Today Earning',
            this_month_return: 'This Month Return',
            month_team_earning: 'Month Team Earning',
            total_return: 'Total Return',
            total_team_earning: 'Total Team Earning',
            total_remaining: 'Total Remaining'
        };
        return names[key] || key;
    };

    const activeFilterCount = Object.values(filters).filter(value =>
        value && value !== 'all'
    ).length + Object.values(advancedFilters).filter(value =>
        value
    ).length;

    return (
        <Layout>
            <Box sx={{ padding: 3 }}>
                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard bgcolor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                            <StatContent>
                                <StatValue>{stats.total_count}</StatValue>
                                <StatLabel>Total Users</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <LeaderboardIcon sx={{ fontSize: 'inherit', color: '#fff' }} />
                            </StatIcon>
                        </StatCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard bgcolor="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)">
                            <StatContent>
                                <StatValue>{stats.total_active}</StatValue>
                                <StatLabel>Active Users</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <CheckCircleIcon sx={{ fontSize: 'inherit', color: '#fff' }} />
                            </StatIcon>
                        </StatCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard bgcolor="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)">
                            <StatContent>
                                <StatValue>{stats.total_inactive}</StatValue>
                                <StatLabel>Inactive Users</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <HighlightOffIcon sx={{ fontSize: 'inherit', color: '#fff' }} />
                            </StatIcon>
                        </StatCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard bgcolor="linear-gradient(135deg, #a8a8a8 0%, #696969 100%)">
                            <StatContent>
                                <StatValue>{stats.total_deleted}</StatValue>
                                <StatLabel>Deleted Users</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <DeleteForeverIcon sx={{ fontSize: 'inherit', color: '#fff' }} />
                            </StatIcon>
                        </StatCard>
                    </Grid>
                </Grid>

                {/* Filters Section */}
                <FilterSection>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                            Profit Return Report
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {activeFilterCount > 0 && (
                                <Chip
                                    label={`${activeFilterCount} active filters`}
                                    size="small"
                                    sx={{ backgroundColor: 'rgba(50, 170, 205)', color: 'white' }}
                                />
                            )}
                            <Button
                                variant="outlined"
                                onClick={clearFilters}
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        borderColor: 'white',
                                    }
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Box>
                    </Box>

                    <FilterRow>
                        <StyledTextField
                            placeholder="Search users..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#667eea' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ minWidth: 250 }}
                        />

                        <StyledTextField
                            select
                            label="Status"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="all">All Status</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </StyledTextField>

                        <StyledTextField
                            select
                            label="Plan"
                            value={filters.plan}
                            onChange={(e) => handleFilterChange('plan', e.target.value)}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="all">All Plans</MenuItem>
                            {uniquePlans.map(plan => (
                                <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                            ))}
                        </StyledTextField>

                        <StyledTextField
                            select
                            label="Payout Cycle"
                            value={filters.payoutCycle}
                            onChange={(e) => handleFilterChange('payoutCycle', e.target.value)}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="all">All Cycles</MenuItem>
                            {uniquePayoutCycles.map(cycle => (
                                <MenuItem key={cycle} value={cycle}>{cycle}</MenuItem>
                            ))}
                        </StyledTextField>

                        <Button
                            variant="outlined"
                            onClick={() => setAdvancedSearchOpen(true)}
                            startIcon={<FilterListIcon />}
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderColor: 'white',
                                }
                            }}
                        >
                            Advanced
                        </Button>

                        <Button
                            variant="contained"
                            onClick={generateReport}
                            startIcon={<RefreshIcon />}
                            sx={{
                                borderRadius: 12,
                                fontWeight: 700,
                                fontSize: 14,
                                px: 3,
                                py: 1.5,
                                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                                color: '#667eea',
                                boxShadow: '0 4px 15px rgba(255,255,255,0.2)',
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                    boxShadow: '0 6px 20px rgba(255,255,255,0.3)',
                                },
                            }}
                        >
                            Refresh
                        </Button>

                        <Tooltip title="Download Excel">
                            <Button
                                variant="contained"
                                onClick={downloadExcel}
                                startIcon={<DownloadIcon />}
                                sx={{
                                    borderRadius: 12,
                                    fontWeight: 700,
                                    fontSize: 14,
                                    px: 3,
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                                    textTransform: 'none',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #45a049 0%, #4CAF50 100%)',
                                        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                                    },
                                }}
                            >
                                Excel
                            </Button>
                        </Tooltip>
                    </FilterRow>

                    {/* Additional Basic Filters */}
                    <FilterRow sx={{ mt: 2 }}>
                        <StyledTextField
                            type="number"
                            label="Min Investment"
                            placeholder="Min Investment"
                            value={filters.minInvestment}
                            onChange={(e) => handleFilterChange('minInvestment', e.target.value)}
                            sx={{
                                minWidth: 140,
                                '& .MuiInputLabel-root': {
                                    color: '#000000 !important',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2 !important',
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: '#000000', // Black color for label
                                    '&.Mui-focused': {
                                        color: '#1976d2',
                                    },
                                }
                            }}
                            InputProps={{
                                sx: {
                                    '&::placeholder': {
                                        color: '#78909c',
                                        opacity: 1,
                                    },
                                }
                            }}
                        />
                        <StyledTextField
                            type="number"
                            label="Max Investment"
                            placeholder="100000"
                            value={filters.maxInvestment}
                            onChange={(e) => handleFilterChange('maxInvestment', e.target.value)}
                            sx={{
                                minWidth: 140,
                                '& .MuiInputLabel-root': {
                                    color: '#000000 !important',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2 !important',
                                }
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: '#000000', // Black color for label
                                    '&.Mui-focused': {
                                        color: '#1976d2',
                                    },
                                }
                            }}
                            InputProps={{
                                sx: {
                                    '&::placeholder': {
                                        color: '#78909c',
                                        opacity: 1,
                                    },
                                }
                            }}
                        />


                        <StyledTextField
                            type="number"
                            label="Min Today Earning"
                            placeholder="0"
                            value={filters.minTodayEarning}
                            onChange={(e) => handleFilterChange('minTodayEarning', e.target.value)}
                            sx={{
                                minWidth: 160,
                                '& .MuiInputLabel-root': {
                                    color: '#000000 !important',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2 !important',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: '#78909c !important',
                                    opacity: '1 !important',
                                }
                            }}
                            InputProps={{
                                sx: {
                                    color: '#455a64',
                                    '&::placeholder': {
                                        color: '#78909c',
                                        opacity: 1,
                                    },
                                }
                            }}
                        />
                        <StyledTextField
                            type="number"
                            label="Max Today Earning"
                            placeholder="1000"
                            value={filters.maxTodayEarning}
                            onChange={(e) => handleFilterChange('maxTodayEarning', e.target.value)}
                            sx={{
                                minWidth: 160,
                                '& .MuiInputLabel-root': {
                                    color: '#000000 !important',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2 !important',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: '#78909c !important',
                                    opacity: '1 !important',
                                }
                            }}
                            InputProps={{
                                sx: {
                                    color: '#455a64',
                                    '&::placeholder': {
                                        color: '#78909c',
                                        opacity: 1,
                                    },
                                }
                            }}
                        />
                    </FilterRow>
                </FilterSection>

                {/* Advanced Search Dialog */}
                <AdvancedSearchDialog
                    open={advancedSearchOpen}
                    onClose={() => setAdvancedSearchOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        Advanced Search & Column Selection
                        <IconButton onClick={() => setAdvancedSearchOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{ pt: 3 }}>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Advanced Filters</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={advancedFilters.email}
                                            onChange={(e) => handleAdvancedFilterChange('email', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Mobile"
                                            value={advancedFilters.mobile}
                                            onChange={(e) => handleAdvancedFilterChange('mobile', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="MR ID"
                                            value={advancedFilters.mrId}
                                            onChange={(e) => handleAdvancedFilterChange('mrId', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="User ID"
                                            value={advancedFilters.userId}
                                            onChange={(e) => handleAdvancedFilterChange('userId', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Min Month Team Earning"
                                            value={advancedFilters.minMonthTeamEarning}
                                            onChange={(e) => handleAdvancedFilterChange('minMonthTeamEarning', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Max Month Team Earning"
                                            value={advancedFilters.maxMonthTeamEarning}
                                            onChange={(e) => handleAdvancedFilterChange('maxMonthTeamEarning', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Min Total Team Earning"
                                            value={advancedFilters.minTotalTeamEarning}
                                            onChange={(e) => handleAdvancedFilterChange('minTotalTeamEarning', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Max Total Team Earning"
                                            value={advancedFilters.maxTotalTeamEarning}
                                            onChange={(e) => handleAdvancedFilterChange('maxTotalTeamEarning', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Column Selection</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={1}>
                                    {Object.keys(selectedColumns).map(column => (
                                        <Grid item xs={12} sm={6} md={4} key={column}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedColumns[column]}
                                                        onChange={() => handleColumnToggle(column)}
                                                        color="primary"
                                                    />
                                                }
                                                label={formatColumnName(column)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={clearFilters}>Clear All</Button>
                        <Button
                            onClick={() => setAdvancedSearchOpen(false)}
                            variant="contained"
                            color="primary"
                        >
                            Apply Filters
                        </Button>
                    </DialogActions>
                </AdvancedSearchDialog>

                {/* Results Summary */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        Showing {filteredReport.length} of {report.length} users
                    </Typography>
                    {activeFilterCount > 0 && (
                        <Chip
                            icon={<FilterListIcon />}
                            label="Filters Applied"
                            color="primary"
                            variant="outlined"
                        />
                    )}
                </Box>

                <ProfitTransactions
                    showServiceTrans={filteredReport}
                    selectedColumns={selectedColumns}
                />
            </Box>
        </Layout>
    );
}

export default withAuth(ProfitReturn);