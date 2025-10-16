import { 
    Box, 
    Grid, 
    Table, 
    TableBody, 
    TableContainer, 
    TableHead, 
    TablePagination, 
    TableRow, 
    TableCell,
    Chip,
    Paper,
    Typography
} from "@mui/material";
import { useState } from "react";
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    background: 'white',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(33, 150, 243, 0.12)',
    overflow: 'hidden',
    marginBottom: 24,
    border: '1px solid #e3f2fd',
}));

const StyledTableHead = styled(TableHead)({
    background: 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
});

const StyledTableHeaderCell = styled(TableCell)({
    color: 'white !important',
    fontWeight: '700 !important',
    fontSize: '13px !important',
    padding: '16px 12px !important',
    borderRight: '1px solid rgba(255,255,255,0.15) !important',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    fontFamily: "'Inter', sans-serif",
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: '14px 12px !important',
    borderRight: '1px solid rgba(33, 150, 243, 0.08) !important',
    fontSize: '13px',
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: '#f8fbff',
    },
    '&:hover': {
        backgroundColor: '#e3f2fd !important',
        transform: 'translateX(4px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(33, 150, 243, 0.15)',
    },
    '&:last-child td, &:last-child th': {
        borderBottom: 0,
    },
}));

// Fixed StatusChip - using proper styled component syntax
const StatusChip = styled(Chip)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: 8,
}));

const ActiveChip = styled(Chip)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    border: '1px solid #4caf50',
}));

const InactiveChip = styled(Chip)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: 8,
    backgroundColor: '#ffebee',
    color: '#c62828',
    border: '1px solid #f44336',
}));

const AmountCell = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontWeight: 600,
    fontSize: '13px',
});

const PlanChip = styled(Chip)({
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    border: '1px solid #90caf9',
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: 8,
});

const ProfitTransactions = ({ showServiceTrans }) => {
    const getDate = (timeZone) => {
        if (!timeZone) return '-';
        try {
            const dateObject = new Date(timeZone);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, "0");
            const day = String(dateObject.getDate()).padStart(2, "0");
            return `${day}-${month}-${year}`;
        } catch {
            return '-';
        }
    };

    let rows = [];
    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [...showServiceTrans];
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '₹0.00';
        const numAmount = parseFloat(amount);
        return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getTrendIcon = (amount) => {
        const numAmount = parseFloat(amount || 0);
        if (numAmount > 0) {
            return <TrendingUpIcon sx={{ fontSize: 16, color: '#2e7d32' }} />;
        } else if (numAmount < 0) {
            return <TrendingDownIcon sx={{ fontSize: 16, color: '#c62828' }} />;
        }
        return null;
    };

    // Helper function to render status chip
    const renderStatusChip = (status) => {
        if (status === 'Active') {
            return <ActiveChip label={status} size="small" />;
        } else if (status === 'Inactive') {
            return <InactiveChip label={status} size="small" />;
        } else {
            return <StatusChip label={status || "-"} size="small" />;
        }
    };

    return (
        <Box sx={{ padding: 0 }}>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <StyledTableContainer component={Paper}>
                        <Table aria-label="Profit Return Report" sx={{ minWidth: 1200 }}>
                            <StyledTableHead>
                                <TableRow>
                                    <StyledTableHeaderCell>#</StyledTableHeaderCell>
                                    <StyledTableHeaderCell>User Details</StyledTableHeaderCell>
                                    <StyledTableHeaderCell>MR ID</StyledTableHeaderCell>
                                    <StyledTableHeaderCell>Registration</StyledTableHeaderCell>
                                    <StyledTableHeaderCell>Investment</StyledTableHeaderCell>
                                    <StyledTableHeaderCell>Plan</StyledTableHeaderCell>
                                    <StyledTableHeaderCell>Status</StyledTableHeaderCell>
                                    <StyledTableHeaderCell>Today</StyledTableHeaderCell>
                                    <StyledTableHeaderCell>Month Return</StyledTableHeaderCell>
                                    <StyledTableHeaderCell>Total Return</StyledTableHeaderCell>
                                    <StyledTableHeaderCell>Remaining</StyledTableHeaderCell>
                                </TableRow>
                            </StyledTableHead>

                            <TableBody>
                                {rows.length > 0 ? (
                                    rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell>
                                                <Box sx={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#e3f2fd',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '600',
                                                    fontSize: '12px',
                                                    color: '#1976d2'
                                                }}>
                                                    {index + 1 + page * rowsPerPage}
                                                </Box>
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600" color="#1976d2">
                                                        {row.user_name || "-"}
                                                    </Typography>
                                                    <Typography variant="caption" color="#546e7a">
                                                        {row.mobile || "-"}
                                                    </Typography>
                                                    <Typography variant="caption" display="block" color="#78909c">
                                                        ID: {row.user_id || "-"}
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                                <Chip 
                                                    label={row.mr_id || "-"} 
                                                    size="small" 
                                                    variant="outlined"
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        backgroundColor: '#f3e5f5',
                                                        color: '#7b1fa2',
                                                        borderColor: '#ba68c8'
                                                    }}
                                                />
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                                <Typography variant="body2" color="#455a64" fontWeight="500">
                                                    {getDate(row.registration_date)}
                                                </Typography>
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600" color="#2e7d32">
                                                        {formatCurrency(row.investment_amount)}
                                                    </Typography>
                                                    <Typography variant="caption" color="#78909c">
                                                        {getDate(row.investment_date)}
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                                <PlanChip 
                                                    label={row.user_in || "-"} 
                                                    size="small"
                                                />
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                                {renderStatusChip(row.status)}
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                                <AmountCell>
                                                    {getTrendIcon(row.today_earning)}
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: parseFloat(row.today_earning || 0) > 0 ? '#2e7d32' : 
                                                                   parseFloat(row.today_earning || 0) < 0 ? '#c62828' : '#455a64'
                                                        }}
                                                    >
                                                        {formatCurrency(row.today_earning)}
                                                    </Typography>
                                                </AmountCell>
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                                <AmountCell>
                                                    {getTrendIcon(row.this_month_return)}
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: parseFloat(row.this_month_return || 0) > 0 ? '#2e7d32' : 
                                                                   parseFloat(row.this_month_return || 0) < 0 ? '#c62828' : '#455a64'
                                                        }}
                                                    >
                                                        {formatCurrency(row.this_month_return)}
                                                    </Typography>
                                                </AmountCell>
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                                <AmountCell>
                                                    {getTrendIcon(row.total_return)}
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: parseFloat(row.total_return || 0) > 0 ? '#2e7d32' : 
                                                                   parseFloat(row.total_return || 0) < 0 ? '#c62828' : '#455a64',
                                                            fontWeight: '700'
                                                        }}
                                                    >
                                                        {formatCurrency(row.total_return)}
                                                    </Typography>
                                                </AmountCell>
                                            </StyledTableCell>
                                            
                                            <StyledTableCell>
                                                <AmountCell>
                                                    <Typography 
                                                        variant="body2" 
                                                        sx={{ 
                                                            color: parseFloat(row.total_remaining || 0) >= 0 ? '#1976d2' : '#c62828',
                                                            fontWeight: '700' 
                                                        }}
                                                    >
                                                        {formatCurrency(row.total_remaining)}
                                                    </Typography>
                                                </AmountCell>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                                            <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                                <InfoOutlinedIcon sx={{ fontSize: 48, color: '#90caf9', mb: 2 }} />
                                                <Typography variant="h6" gutterBottom color="#1976d2">
                                                    No Records Found
                                                </Typography>
                                                <Typography variant="body2" color="#546e7a">
                                                    Try adjusting your filters or refresh the data
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>

                    {rows.length > 0 && (
                        <TablePagination
                            rowsPerPageOptions={[25, 50, 100,250,500,1000,2000]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onPageChange}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                    fontWeight: 500,
                                    color: '#455a64',
                                },
                                '& .MuiTablePagination-actions': {
                                    color: '#1976d2',
                                },
                                '& .MuiSelect-select': {
                                    color: '#1976d2',
                                },
                                backgroundColor: '#f8fbff',
                                borderRadius: 2,
                                border: '1px solid #e3f2fd',
                            }}
                        />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfitTransactions;