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
    borderRadius: 12,
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
}));

const StatContent = styled('div')({
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
});

const StatValue = styled('div')({
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 4,
});

const StatLabel = styled('div')({
    fontSize: 12,
    fontWeight: 600,
    opacity: 0.9,
});

const FilterSection = styled(Paper)(({ theme }) => ({
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 12,
    padding: '16px',
    marginBottom: 16,
    color: 'white',
}));

const FilterRow = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
});

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'white',
        borderRadius: 8,
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'white',
        fontSize: '0.875rem',
    },
    '& .MuiInputBase-input': {
        fontSize: '0.875rem',
        padding: '8px 12px',
    },
});

const CompactButton = styled(Button)({
    minWidth: 'auto',
    padding: '6px 12px',
    fontSize: '0.75rem',
    borderRadius: 8,
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
    });
    const [advancedFilters, setAdvancedFilters] = useState({
        // Basic filters moved to advanced
        minInvestment: '',
        maxInvestment: '',
        minTodayEarning: '',
        maxTodayEarning: '',
        minTotalReturn: '',
        maxTotalReturn: '',
        // Additional advanced filters
        email: '',
        mobile: '',
        mrId: '',
        userId: '',
        minMonthTeamEarning: '',
        maxMonthTeamEarning: '',
        minTotalTeamEarning: '',
        maxTotalTeamEarning: '',
        minTotalRemaining: '',
        maxTotalRemaining: '',
        // Slab filters
        slab1: false,
        slab2: false,
        slab3: false
    });
    const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
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

        // Payout cycle filter - Date based slabs
        if (filters.payoutCycle !== 'all') {
            filtered = filtered.filter(user => {
                if (!user.investment_date) return false;
                
                const investmentDate = new Date(user.investment_date);
                const dayOfMonth = investmentDate.getDate();
                
                switch(filters.payoutCycle) {
                    case 'slab1':
                        // 5th to 14th
                        return dayOfMonth >= 5 && dayOfMonth <= 14;
                    case 'slab2':
                        // 15th to 24th
                        return dayOfMonth >= 15 && dayOfMonth <= 24;
                    case 'slab3':
                        // 25th to 4th (next month)
                        return dayOfMonth >= 25 || dayOfMonth <= 4;
                    default:
                        return true;
                }
            });
        }

        // Investment range filter
        if (advancedFilters.minInvestment) {
            filtered = filtered.filter(user =>
                parseFloat(user.investment_amount || 0) >= parseFloat(advancedFilters.minInvestment)
            );
        }
        if (advancedFilters.maxInvestment) {
            filtered = filtered.filter(user =>
                parseFloat(user.investment_amount || 0) <= parseFloat(advancedFilters.maxInvestment)
            );
        }

        // Today earning range filter
        if (advancedFilters.minTodayEarning) {
            filtered = filtered.filter(user =>
                parseFloat(user.today_earning || 0) >= parseFloat(advancedFilters.minTodayEarning)
            );
        }
        if (advancedFilters.maxTodayEarning) {
            filtered = filtered.filter(user =>
                parseFloat(user.today_earning || 0) <= parseFloat(advancedFilters.maxTodayEarning)
            );
        }

        // Total return range filter
        if (advancedFilters.minTotalReturn) {
            filtered = filtered.filter(user =>
                parseFloat(user.total_return || 0) >= parseFloat(advancedFilters.minTotalReturn)
            );
        }
        if (advancedFilters.maxTotalReturn) {
            filtered = filtered.filter(user =>
                parseFloat(user.total_return || 0) <= parseFloat(advancedFilters.maxTotalReturn)
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

        // Slab filters
        if (advancedFilters.slab1) {
            filtered = filtered.filter(user => 
                parseFloat(user.investment_amount || 0) >= 0 && 
                parseFloat(user.investment_amount || 0) <= 10000
            );
        }
        if (advancedFilters.slab2) {
            filtered = filtered.filter(user => 
                parseFloat(user.investment_amount || 0) > 10000 && 
                parseFloat(user.investment_amount || 0) <= 50000
            );
        }
        if (advancedFilters.slab3) {
            filtered = filtered.filter(user => 
                parseFloat(user.investment_amount || 0) > 50000
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
        });
        setAdvancedFilters({
            minInvestment: '',
            maxInvestment: '',
            minTodayEarning: '',
            maxTodayEarning: '',
            minTotalReturn: '',
            maxTotalReturn: '',
            email: '',
            mobile: '',
            mrId: '',
            userId: '',
            minMonthTeamEarning: '',
            maxMonthTeamEarning: '',
            minTotalTeamEarning: '',
            maxTotalTeamEarning: '',
            minTotalRemaining: '',
            maxTotalRemaining: '',
            slab1: false,
            slab2: false,
            slab3: false
        });
    };

    const downloadExcel = () => {
        const dataToExport = filteredReport.map(user => {
            const row = {};
            
            if (selectedColumns.user_name) row['User Name'] = user.user_name || '';
            if (selectedColumns.user_id) row['User ID'] = user.user_id || '';
            if (selectedColumns.mobile) row['Mobile'] = user.mobile || '';
            if (selectedColumns.mr_id) row['MR ID'] = user.mr_id || '';
            if (selectedColumns.registration_date) {
                row['Registration Date'] = user.registration_date ? formatExcelDate(user.registration_date) : '';
            }
            if (selectedColumns.investment_date) {
                row['Investment Date'] = user.investment_date ? formatExcelDate(user.investment_date) : '';
            }
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
            if (selectedColumns.user_in) row['Plan'] = user.user_in || '';
            if (selectedColumns.status) row['Status'] = user.status || '';
            
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Profit Return Report");

        if (dataToExport.length > 0) {
            const colWidths = Object.keys(dataToExport[0]).map(key => {
                const maxLength = Math.max(
                    key.length,
                    ...dataToExport.map(row => String(row[key] || '').length)
                );
                return { width: Math.min(Math.max(maxLength + 2, 12), 30) };
            });
            worksheet['!cols'] = colWidths;
        }

        XLSX.writeFile(workbook, `profit-return-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    };

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
        value && value !== false
    ).length;

    return (
        <Layout>
            <Box sx={{ padding: 2 }}>
                {/* Compact Statistics Cards */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={3}>
                        <StatCard sx={{ 
                            backgroundColor: '#f5f5f5', 
                            borderLeft: '4px solid #667eea',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                backgroundColor: '#667eea',
                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
                                transform: 'translateY(-4px)',
                                '& .MuiTypography-root': {
                                    color: 'white',
                                }
                            }
                        }}>
                            <StatContent>
                                <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{stats.total_count}</StatValue>
                                <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Total Users</StatLabel>
                            </StatContent>
                        </StatCard>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatCard sx={{ 
                            backgroundColor: '#f5f5f5', 
                            borderLeft: '4px solid #11998e',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                backgroundColor: '#11998e',
                                boxShadow: '0 8px 25px rgba(17, 153, 142, 0.5)',
                                transform: 'translateY(-4px)',
                                '& .MuiTypography-root': {
                                    color: 'white',
                                }
                            }
                        }}>
                            <StatContent>
                                <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{stats.total_active}</StatValue>
                                <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Active</StatLabel>
                            </StatContent>
                        </StatCard>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatCard sx={{ 
                            backgroundColor: '#f5f5f5', 
                            borderLeft: '4px solid #ff6b6b',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                backgroundColor: '#ff6b6b',
                                boxShadow: '0 8px 25px rgba(255, 107, 107, 0.5)',
                                transform: 'translateY(-4px)',
                                '& .MuiTypography-root': {
                                    color: 'white',
                                }
                            }
                        }}>
                            <StatContent>
                                <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{stats.total_inactive}</StatValue>
                                <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Inactive</StatLabel>
                            </StatContent>
                        </StatCard>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <StatCard sx={{ 
                            backgroundColor: '#f5f5f5', 
                            borderLeft: '4px solid #a8a8a8',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                                backgroundColor: '#a8a8a8',
                                boxShadow: '0 8px 25px rgba(168, 168, 168, 0.5)',
                                transform: 'translateY(-4px)',
                                '& .MuiTypography-root': {
                                    color: 'white',
                                }
                            }
                        }}>
                            <StatContent>
                                <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{stats.total_deleted}</StatValue>
                                <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Deleted</StatLabel>
                            </StatContent>
                        </StatCard>
                    </Grid>
                </Grid>

                {/* Compact Filter Section - All in one row */}
                <FilterSection>
                    <FilterRow>
                        <StyledTextField
                            placeholder="Search..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#667eea', fontSize: '18px' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ minWidth: 180 }}
                        />

                        <StyledTextField
                            select
                            label="Status"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            size="small"
                            sx={{ minWidth: 120 }}
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
                            size="small"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="all">All Plans</MenuItem>
                            {uniquePlans.map(plan => (
                                <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                            ))}
                        </StyledTextField>

                        <StyledTextField
                            select
                            label="Payout"
                            value={filters.payoutCycle}
                            onChange={(e) => handleFilterChange('payoutCycle', e.target.value)}
                            size="small"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="all">All Cycles</MenuItem>
                            <MenuItem value="slab1">Slab 1 (5th-14th)</MenuItem>
                            <MenuItem value="slab2">Slab 2 (15th-24th)</MenuItem>
                            <MenuItem value="slab3">Slab 3 (25th-4th)</MenuItem>
                        </StyledTextField>

                        <CompactButton
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
                            {activeFilterCount > 0 && ` (${activeFilterCount})`}
                        </CompactButton>

                        <CompactButton
                            variant="contained"
                            onClick={generateReport}
                            startIcon={<RefreshIcon />}
                            sx={{
                                background: 'white',
                                color: '#667eea',
                                fontWeight: 600,
                                '&:hover': {
                                    background: '#f8f9fa',
                                },
                            }}
                        >
                            Refresh
                        </CompactButton>

                        <Tooltip title="Download Excel">
                            <CompactButton
                                variant="contained"
                                onClick={downloadExcel}
                                startIcon={<DownloadIcon />}
                                sx={{
                                    background: '#4CAF50',
                                    color: 'white',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: '#45a049',
                                    },
                                }}
                            >
                                Excel
                            </CompactButton>
                        </Tooltip>

                        {activeFilterCount > 0 && (
                            <CompactButton
                                variant="outlined"
                                onClick={clearFilters}
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                    }
                                }}
                            >
                                Clear
                            </CompactButton>
                        )}
                    </FilterRow>
                </FilterSection>

                {/* Advanced Search Dialog */}
                <Dialog
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
                        alignItems: 'center',
                        py: 2
                    }}>
                        Advanced Filters & Column Selection
                        <IconButton onClick={() => setAdvancedSearchOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{ pt: 2 }}>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" fontSize="1rem">Investment & Earning Filters</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Min Investment"
                                            value={advancedFilters.minInvestment}
                                            onChange={(e) => handleAdvancedFilterChange('minInvestment', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Max Investment"
                                            value={advancedFilters.maxInvestment}
                                            onChange={(e) => handleAdvancedFilterChange('maxInvestment', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Min Today Earning"
                                            value={advancedFilters.minTodayEarning}
                                            onChange={(e) => handleAdvancedFilterChange('minTodayEarning', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Max Today Earning"
                                            value={advancedFilters.maxTodayEarning}
                                            onChange={(e) => handleAdvancedFilterChange('maxTodayEarning', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Min Total Return"
                                            value={advancedFilters.minTotalReturn}
                                            onChange={(e) => handleAdvancedFilterChange('minTotalReturn', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Max Total Return"
                                            value={advancedFilters.maxTotalReturn}
                                            onChange={(e) => handleAdvancedFilterChange('maxTotalReturn', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" fontSize="1rem">User Details & Team Earnings</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={advancedFilters.email}
                                            onChange={(e) => handleAdvancedFilterChange('email', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Mobile"
                                            value={advancedFilters.mobile}
                                            onChange={(e) => handleAdvancedFilterChange('mobile', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="MR ID"
                                            value={advancedFilters.mrId}
                                            onChange={(e) => handleAdvancedFilterChange('mrId', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="User ID"
                                            value={advancedFilters.userId}
                                            onChange={(e) => handleAdvancedFilterChange('userId', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Min Month Team"
                                            value={advancedFilters.minMonthTeamEarning}
                                            onChange={(e) => handleAdvancedFilterChange('minMonthTeamEarning', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Max Month Team"
                                            value={advancedFilters.maxMonthTeamEarning}
                                            onChange={(e) => handleAdvancedFilterChange('maxMonthTeamEarning', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            label="Min Total Team"
                                            value={advancedFilters.minTotalTeamEarning}
                                            onChange={(e) => handleAdvancedFilterChange('minTotalTeamEarning', e.target.value)}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" fontSize="1rem">Investment Slabs</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={advancedFilters.slab1}
                                                    onChange={(e) => handleAdvancedFilterChange('slab1', e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="Slab 1 (₹0 - ₹10,000)"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={advancedFilters.slab2}
                                                    onChange={(e) => handleAdvancedFilterChange('slab2', e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="Slab 2 (₹10,001 - ₹50,000)"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={advancedFilters.slab3}
                                                    onChange={(e) => handleAdvancedFilterChange('slab3', e.target.checked)}
                                                    color="primary"
                                                />
                                            }
                                            label="Slab 3 (₹50,001+)"
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" fontSize="1rem">Column Selection</Typography>
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
                                                        size="small"
                                                    />
                                                }
                                                label={formatColumnName(column)}
                                                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, py: 2 }}>
                        <Button onClick={clearFilters} size="small">Clear All</Button>
                        <Button
                            onClick={() => setAdvancedSearchOpen(false)}
                            variant="contained"
                            color="primary"
                            size="small"
                        >
                            Apply Filters
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Results Summary */}
                <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                        Showing {filteredReport.length} of {report.length} users
                    </Typography>
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