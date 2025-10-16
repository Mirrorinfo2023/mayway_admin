import { 
    Box, 
    Table, 
    TableBody, 
    TableContainer, 
    TableHead, 
    TablePagination, 
    TableRow, 
    TableCell,
    Chip,
    Paper,
    Typography,
    Tooltip
} from "@mui/material";
import { useState } from "react";
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Fresh color palette
const FRESH_COLORS = {
    primary: '#00b894',
    secondary: '#0984e3',
    accent: '#fd79a8',
    warning: '#fdcb6e',
    danger: '#e17055',
    info: '#74b9ff',
    success: '#00cec9',
    dark: '#2d3436',
    light: '#dfe6e9'
};

// Styled components with fresh colors
const StyledTableContainer = styled(TableContainer)({
    background: 'white',
    borderRadius: 12,
    border: `1px solid ${FRESH_COLORS.light}`,
    marginBottom: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
});

const StyledTableHead = styled(TableHead)({
    backgroundColor: FRESH_COLORS.primary,
    background: `linear-gradient(135deg, ${FRESH_COLORS.primary} 0%, ${FRESH_COLORS.success} 100%)`,
});

const StyledTableHeaderCell = styled(TableCell)({
    fontWeight: '700',
    fontSize: '12px',
    padding: '14px 8px',
    borderRight: `1px solid rgba(255,255,255,0.3)`,
    color: 'white',
    letterSpacing: '0.5px',
});

const StyledTableCell = styled(TableCell)({
    padding: '12px 8px',
    borderRight: `1px solid ${FRESH_COLORS.light}`,
    fontSize: '12px',
});

const StyledTableRow = styled(TableRow)({
    '&:nth-of-type(even)': {
        backgroundColor: '#f8fbfe',
    },
    '&:hover': {
        backgroundColor: '#e8f7f4',
        transition: 'background-color 0.3s ease',
        transform: 'scale(1.002)',
    },
});

// Fresh chips with new colors
const StatusChip = styled(Chip)({
    fontWeight: 700,
    fontSize: '10px',
    height: '22px',
    borderRadius: '6px',
});

const ActiveChip = styled(StatusChip)({
    backgroundColor: FRESH_COLORS.success,
    color: 'white',
    boxShadow: `0 2px 4px rgba(0, 206, 201, 0.4)`,
});

const InactiveChip = styled(StatusChip)({
    backgroundColor: FRESH_COLORS.danger,
    color: 'white',
    boxShadow: `0 2px 4px rgba(225, 112, 85, 0.4)`,
});

const PlanChip = styled(Chip)({
    backgroundColor: FRESH_COLORS.secondary,
    color: 'white',
    fontSize: '10px',
    height: '22px',
    borderRadius: '6px',
    boxShadow: `0 2px 4px rgba(9, 132, 227, 0.4)`,
});

const SummaryBox = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: '20px 24px',
    background: `linear-gradient(135deg, ${FRESH_COLORS.secondary} 0%, ${FRESH_COLORS.info} 100%)`,
    borderRadius: 12,
    color: 'white',
    boxShadow: `0 4px 12px rgba(116, 185, 255, 0.4)`,
});

const ProfitTransactions = ({ showServiceTrans, selectedColumns = {} }) => {
    const getDate = (timeZone) => {
        if (!timeZone) return '-';
        try {
            const dateObject = new Date(timeZone);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, "0");
            const day = String(dateObject.getDate()).padStart(2, "0");
            return `${day}/${month}/${year}`;
        } catch {
            return '-';
        }
    };

    let rows = [];
    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [...showServiceTrans];
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '₹0';
        const numAmount = parseFloat(amount);
        
        return `₹${numAmount.toLocaleString('en-IN', {
            maximumFractionDigits: 0
        })}`;
    };

    const renderStatusChip = (status) => {
        if (status === 'Active') {
            return <ActiveChip label="Active" size="small" />;
        } else if (status === 'Inactive') {
            return <InactiveChip label="Inactive" size="small" />;
        } else {
            return <StatusChip label={status || "-"} size="small" />;
        }
    };

    // All available columns
    const defaultColumns = {
        index: true,
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
    };

    const columns = { ...defaultColumns, ...selectedColumns };

    return (
        <Box sx={{ padding: 2, backgroundColor: '#f8fbfe', minHeight: '100vh' }}>
            {/* Summary Bar with fresh gradient */}
           <SummaryBox sx={{ 
    padding: '12px 16px',
    marginBottom: '12px'
}}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Typography variant="subtitle1" fontWeight="600" sx={{ fontSize: '14px' }}>
            Profit Return Report
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" fontWeight="600" sx={{ fontSize: '13px' }}>
                {rows.length} Records
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '11px' }}>
                {Object.values(columns).filter(Boolean).length} Columns
            </Typography>
        </Box>
    </Box>
</SummaryBox>

            <StyledTableContainer component={Paper}>
                <Table stickyHeader size="small" sx={{ minWidth: 1600 }}>
                  <StyledTableHead>
    <TableRow>
        {columns.index && (
            <StyledTableHeaderCell sx={{ width: 50, backgroundColor: '#000000' }}>#</StyledTableHeaderCell>
        )}
        {columns.user_id && (
            <StyledTableHeaderCell sx={{ width: 70, backgroundColor: '#000000' }}>User ID</StyledTableHeaderCell>
        )}
        {columns.user_name && (
            <StyledTableHeaderCell sx={{ width: 120, backgroundColor: '#000000' }}>Name</StyledTableHeaderCell>
        )}
        {columns.mr_id && (
            <StyledTableHeaderCell sx={{ width: 90, backgroundColor: '#000000' }}>MR ID</StyledTableHeaderCell>
        )}
        {columns.mobile && (
            <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#000000' }}>Mobile</StyledTableHeaderCell>
        )}
        {columns.email && (
            <StyledTableHeaderCell sx={{ width: 150, backgroundColor: '#000000' }}>Email</StyledTableHeaderCell>
        )}
        {columns.registration_date && (
            <StyledTableHeaderCell sx={{ width: 90, backgroundColor: '#000000' }}>Reg Date</StyledTableHeaderCell>
        )}
        {columns.investment_date && (
            <StyledTableHeaderCell sx={{ width: 90, backgroundColor: '#000000' }}>Inv Date</StyledTableHeaderCell>
        )}
        {columns.investment_amount && (
            <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#000000' }}>Investment</StyledTableHeaderCell>
        )}
        {columns.user_in && (
            <StyledTableHeaderCell sx={{ width: 80, backgroundColor: '#000000' }}>Plan</StyledTableHeaderCell>
        )}
        {columns.payout_cycle && (
            <StyledTableHeaderCell sx={{ width: 80, backgroundColor: '#000000' }}>Payout</StyledTableHeaderCell>
        )}
        {columns.status && (
            <StyledTableHeaderCell sx={{ width: 80, backgroundColor: '#000000' }}>Status</StyledTableHeaderCell>
        )}
        {columns.today_earning && (
            <StyledTableHeaderCell sx={{ width: 90, backgroundColor: '#000000' }}>Today</StyledTableHeaderCell>
        )}
        {columns.this_month_return && (
            <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#000000' }}>Month Return</StyledTableHeaderCell>
        )}
        {columns.month_team_earning && (
            <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#000000' }}>Month Team</StyledTableHeaderCell>
        )}
        {columns.total_return && (
            <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#000000' }}>Total Return</StyledTableHeaderCell>
        )}
        {columns.total_team_earning && (
            <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#000000' }}>Total Team</StyledTableHeaderCell>
        )}
        {columns.total_remaining && (
            <StyledTableHeaderCell sx={{ width: 100, backgroundColor: '#000000' }}>Remaining</StyledTableHeaderCell>
        )}
    </TableRow>
</StyledTableHead>

                   <TableBody>
    {rows.length > 0 ? (
        rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
                <StyledTableRow key={index}>
                    {columns.index && (
                        <StyledTableCell>
                            <Box sx={{
                                width: 26,
                                height: 26,
                                borderRadius: '8px',
                                backgroundColor: '#1a237e', // Dark blue
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '11px',
                                color: 'white',
                                margin: '0 auto',
                                boxShadow: `0 2px 4px rgba(26, 35, 126, 0.4)`
                            }}>
                                {index + 1 + page * rowsPerPage}
                            </Box>
                        </StyledTableCell>
                    )}
                    
                    {columns.user_id && (
                        <StyledTableCell>
                            <Typography variant="body2" fontWeight="700" color="#0d47a1"> {/* Dark blue */}
                                {row.user_id || "-"}
                            </Typography>
                        </StyledTableCell>
                    )}
                    
                    {columns.user_name && (
                        <StyledTableCell>
                            <Tooltip title={row.user_name || "-"}>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 120, fontWeight: '600', color: '#212121' }}> {/* Dark gray */}
                                    {row.user_name || "-"}
                                </Typography>
                            </Tooltip>
                        </StyledTableCell>
                    )}
                    
                    {columns.mr_id && (
                        <StyledTableCell>
                            <Chip 
                                label={row.mr_id || "-"} 
                                size="small" 
                                sx={{ 
                                    fontWeight: 700,
                                    backgroundColor: '#ff8f00', // Dark orange
                                    color: '#212121',
                                    fontSize: '10px',
                                    boxShadow: `0 2px 4px rgba(255, 143, 0, 0.4)`
                                }}
                            />
                        </StyledTableCell>
                    )}
                    
                    {columns.mobile && (
                        <StyledTableCell>
                            <Typography variant="body2" fontWeight="600" color="#212121"> {/* Dark gray */}
                                {row.mobile || "-"}
                            </Typography>
                        </StyledTableCell>
                    )}
                    
                    {columns.email && (
                        <StyledTableCell>
                            <Tooltip title={row.email || "-"}>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 150, color: '#0d47a1', fontWeight: '500' }}> {/* Dark blue */}
                                    {row.email || "-"}
                                </Typography>
                            </Tooltip>
                        </StyledTableCell>
                    )}
                    
                    {columns.registration_date && (
                        <StyledTableCell>
                            <Typography variant="body2" color="#424242" fontWeight="500"> {/* Dark gray */}
                                {getDate(row.registration_date)}
                            </Typography>
                        </StyledTableCell>
                    )}
                    
                    {columns.investment_date && (
                        <StyledTableCell>
                            <Typography variant="body2" color="#424242" fontWeight="500"> {/* Dark gray */}
                                {getDate(row.investment_date)}
                            </Typography>
                        </StyledTableCell>
                    )}
                    
                    {columns.investment_amount && (
                        <StyledTableCell>
                            <Typography variant="body2" fontWeight="700" color="#1b5e20"> {/* Dark green */}
                                {formatCurrency(row.investment_amount)}
                            </Typography>
                        </StyledTableCell>
                    )}
                    
                    {columns.user_in && (
                        <StyledTableCell>
                            <Chip 
                                label={row.user_in || "-"} 
                                size="small"
                                sx={{ 
                                    backgroundColor: '#0d47a1', // Dark blue
                                    color: 'white',
                                    fontSize: '10px',
                                    boxShadow: `0 2px 4px rgba(13, 71, 161, 0.4)`
                                }}
                            />
                        </StyledTableCell>
                    )}
                    
                    {columns.payout_cycle && (
                        <StyledTableCell>
                            <Chip 
                                label={row.payout_cycle ? `Cycle ${row.payout_cycle}` : "-"} 
                                size="small"
                                sx={{ 
                                    backgroundColor: '#880e4f', // Dark pink
                                    color: 'white',
                                    fontSize: '10px',
                                    boxShadow: `0 2px 4px rgba(136, 14, 79, 0.4)`
                                }}
                            />
                        </StyledTableCell>
                    )}
                    
                    {columns.status && (
                        <StyledTableCell>
                            {row.status === 'Active' ? (
                                <Chip 
                                    label="Active" 
                                    size="small"
                                    sx={{ 
                                        backgroundColor: '#1b5e20', // Dark green
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '10px',
                                        boxShadow: `0 2px 4px rgba(27, 94, 32, 0.4)`
                                    }}
                                />
                            ) : row.status === 'Inactive' ? (
                                <Chip 
                                    label="Inactive" 
                                    size="small"
                                    sx={{ 
                                        backgroundColor: '#b71c1c', // Dark red
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '10px',
                                        boxShadow: `0 2px 4px rgba(183, 28, 28, 0.4)`
                                    }}
                                />
                            ) : (
                                <Chip 
                                    label={row.status || "-"} 
                                    size="small"
                                    sx={{ 
                                        backgroundColor: '#37474f', // Dark gray
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '10px'
                                    }}
                                />
                            )}
                        </StyledTableCell>
                    )}
                    
                    {columns.today_earning && (
                        <StyledTableCell>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: parseFloat(row.today_earning || 0) > 0 ? '#1b5e20' : '#b71c1c', // Dark green/red
                                    fontWeight: '700',
                                    backgroundColor: parseFloat(row.today_earning || 0) > 0 ? '#e8f5e9' : '#ffebee',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    display: 'inline-block'
                                }}
                            >
                                {formatCurrency(row.today_earning)}
                            </Typography>
                        </StyledTableCell>
                    )}
                    
                    {columns.this_month_return && (
                        <StyledTableCell>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: parseFloat(row.this_month_return || 0) > 0 ? '#1b5e20' : '#b71c1c', // Dark green/red
                                    fontWeight: '700'
                                }}
                            >
                                {formatCurrency(row.this_month_return)}
                            </Typography>
                        </StyledTableCell>
                    )}
                    
                    {columns.month_team_earning && (
                        <StyledTableCell>
                            <Typography variant="body2" fontWeight="700" color="#0d47a1"> {/* Dark blue */}
                                {formatCurrency(row.month_team_earning)}
                            </Typography>
                        </StyledTableCell>
                    )}
                    
                    {columns.total_return && (
                        <StyledTableCell>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: parseFloat(row.total_return || 0) > 0 ? '#1b5e20' : '#b71c1c', // Dark green/red
                                    fontWeight: '800',
                                    fontSize: '13px',
                                    backgroundColor: parseFloat(row.total_return || 0) > 0 ? '#e8f5e9' : '#ffebee',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    display: 'inline-block'
                                }}
                            >
                                {formatCurrency(row.total_return)}
                            </Typography>
                        </StyledTableCell>
                    )}
                    
                    {columns.total_team_earning && (
                        <StyledTableCell>
                            <Typography variant="body2" fontWeight="700" color="#4a148c"> {/* Dark purple */}
                                {formatCurrency(row.total_team_earning)}
                            </Typography>
                        </StyledTableCell>
                    )}
                    
                    {columns.total_remaining && (
                        <StyledTableCell>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: parseFloat(row.total_remaining || 0) >= 0 ? '#0d47a1' : '#b71c1c', // Dark blue/red
                                    fontWeight: '800',
                                    fontSize: '13px',
                                    backgroundColor: parseFloat(row.total_remaining || 0) >= 0 ? '#e3f2fd' : '#ffebee',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    display: 'inline-block'
                                }}
                            >
                                {formatCurrency(row.total_remaining)}
                            </Typography>
                        </StyledTableCell>
                    )}
                </StyledTableRow>
            ))
    ) : (
        <TableRow>
            <TableCell colSpan={Object.values(columns).filter(Boolean).length} align="center" sx={{ py: 8 }}>
                <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    <InfoOutlinedIcon sx={{ fontSize: 64, color: '#0d47a1', mb: 2 }} /> {/* Dark blue */}
                    <Typography variant="h5" gutterBottom color="#0d47a1" fontWeight="700"> {/* Dark blue */}
                        No Records Found
                    </Typography>
                    <Typography variant="body1" color="#424242"> {/* Dark gray */}
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
                    rowsPerPageOptions={[25, 50, 100, 250, 500]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: `1px solid ${FRESH_COLORS.light}`,
                        backgroundColor: 'white',
                        borderRadius: '0 0 12px 12px',
                        border: `1px solid ${FRESH_COLORS.light}`,
                        borderTop: 'none',
                    }}
                />
            )}
        </Box>
    );
};

export default ProfitTransactions;