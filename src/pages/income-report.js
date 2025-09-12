"use client";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import IncomeTransactions from "@/components/IncomeReport/IncomeReport";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { styled } from "@mui/material/styles";

const StatCard = styled(Paper)(({ bgcolor }) => ({
  background: bgcolor,
  color: "#fff",
  borderRadius: 12,
  padding: "28px 36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 280,
  minHeight: 100,
  position: "relative",
  overflow: "hidden",
  marginRight: 24,
}));

const StatContent = styled("div")({
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const StatValue = styled("div")({
  fontSize: 32,
  fontWeight: 700,
  lineHeight: 1.1,
  marginBottom: 4,
});

const StatLabel = styled("div")({
  fontSize: 14,
  fontWeight: 500,
  opacity: 0.85,
  letterSpacing: 1,
  textTransform: "uppercase",
});

const StatIcon = styled("div")({
  position: "absolute",
  right: 24,
  top: "50%",
  transform: "translateY(-50%)",
  opacity: 0.18,
  fontSize: 64,
  zIndex: 1,
});

const FilterRow = styled(Box)(({ theme }) => ({
  background: "#f5faff",
  borderRadius: 12,
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 10,
  flexWrap: "wrap",
  justifyContent: "flex-start",
}));

function IncomeReport(props) {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [report, setReport] = useState(null);
  let rows;
  if (Array.isArray(showServiceTrans) && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
  const dispatch = useDispatch();
  const currentDate = new Date();
  const [fromDate, setFromDate] = React.useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = React.useState(dayjs());

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post(
          "/api/refferal-report/user-income-report",
          reqData
        );

        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setReport(response.data.report);
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(
            callAlert({ message: error.response.data.error, type: "FAILED" })
          );
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    };

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate, dispatch]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  let filteredRows;

  if (selectedValue != "") {
    filteredRows = rows.filter((row) => {
      const matches =
        row.plan_name &&
        row.plan_name.toLowerCase() === selectedValue.toLowerCase();

      return matches;
    });
  } else {
    filteredRows = rows.filter((row) => {
      const matches =
        (row.name &&
          row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
        (row.mobile && row.mobile.includes(searchTerm)) ||
        (row.transaction_id && row.transaction_id.includes(searchTerm)) ||
        (row.type &&
          row.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.tran_for &&
          row.tran_for.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.details &&
          row.details.toLowerCase().includes(searchTerm.toLowerCase()));
      return matches;
    });
  }

  return (
    <Layout>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        <Grid item={true} justifyContent="center" xs={12}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1, justifyContent:"center" }}>
            <StatCard bgcolor="#FFC107">
              <StatContent>
                <StatValue>{report ? report.total_incomeCount : 0}</StatValue>
                <StatLabel>Total Income Count</StatLabel>
              </StatContent>
              <StatIcon>
                <LeaderboardIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>
                  {report ? report.total_repurchaseCount : 0}
                </StatValue>
                <StatLabel>Total Repurchase Count</StatLabel>
              </StatContent>
              <StatIcon>
                <CheckCircleIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#26A69A">
              <StatContent>
                <StatValue>
                  {report ? report.total_affiliateToWallet : 0}
                </StatValue>
                <StatLabel>Affiliate To Wallet</StatLabel>
              </StatContent>
              <StatIcon>
                <HighlightOffIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#EC407A">
              <StatContent>
                <StatValue>{report ? report.total_RedeemCount : 0}</StatValue>
                <StatLabel>Redeem Count</StatLabel>
              </StatContent>
              <StatIcon>
                <DeleteForeverIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Box>
        </Grid>

        <Grid item={true} xs={12}>
          <FilterRow
            sx={{
              flexWrap: "wrap",
              gap: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" sx={{ minWidth: "max-content" }}>
              Income Report
            </Typography>
           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              display={"inline-block"}
              justifyContent={"space-between"}
              alignItems={"center"}
              mt={3}
              mb={1}
              sx={{ width: "200px", verticalAlign: "top" }}
            >
              <TextField
                id="search"
                placeholder="Search"
                variant="standard"
                mt={2}
                size="small"
                style={{ width: "100%" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />
            </Box>
            <FormControl sx={{ minWidth: 140  }}>
              <InputLabel id="status-select-label">Prime</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={selectedValue}
                label="Status"
                onChange={handleChange}
                sx={{
                  minWidth: 140,
                  maxWidth: 170,
                  fontSize:"13px",
                }}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="Hybrid Prime">Hybrid Prime</MenuItem>
                <MenuItem value="Booster Prime">Booster Plan</MenuItem>
                <MenuItem value="Prime">Prime</MenuItem>
                <MenuItem value="Prime B">Prime B</MenuItem>
                <MenuItem value="Royality">Royality</MenuItem>
                <MenuItem value="Repurchase">Repurchase</MenuItem>
                <MenuItem value="Redeem">Redeem</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  format="DD-MM-YYYY"
                  onChange={handleFromDateChange}
                  sx={{
                    minWidth: 140,
                    maxWidth: 170,
                    background: "#fff",
                    borderRadius: 1,
                  }}
                />
                <DatePicker
                  label="To Date"
                  value={toDate}
                  format="DD-MM-YYYY"
                  onChange={handleToDateChange}
                  sx={{
                    minWidth: 140,
                    maxWidth: 170,
                    background: "#fff",
                    borderRadius: 1,
                  }}
                />
              </Box>
            </LocalizationProvider>
            </Box>
          </FilterRow>
        </Grid>
      </Grid>
      <IncomeTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(IncomeReport);
