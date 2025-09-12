import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Typography,
  Divider,
  Chip,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

function StatSummary({ stats }) {
  const statItems = [
    { label: "Total Users", value: stats.total },
    { label: "Today's Users", value: stats.today },
    { label: "This Week", value: stats.week },
    { label: "This Month", value: stats.month },
    { label: "Active", value: stats.active },
    { label: "Inactive", value: stats.inactive },
    { label: "On Hold", value: stats.hold },
  ];

  return (
    <Paper
      elevation={4}
      sx={{ p: 2, borderRadius: 3, backgroundColor: "#f9fafb", color: "#111827", mb: 3 }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "space-between" }}>
        {statItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              flex: "1 1 120px",
              p: 1.5,
              borderRadius: 2,
              backgroundColor: index % 2 === 0 ? "#e0f2fe" : "#fef9c3",
              textAlign: "center",
              border: "1px solid #e5e7eb",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.03)", boxShadow: 2 },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {item.value?.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({ stats: {}, latestUsers: [] });
  const [timeframe, setTimeframe] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    axios
      .get("api/admin/dashboardData")
      .then((res) => {
        if (res.data.success) setData(res.data);
      })
      .catch((err) => console.error("Failed to fetch dashboard data:", err));
  }, []);

  const toLocalDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split("-");
    if (parts.length < 3) return new Date(dateStr);
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d);
  };

  const filteredUsers = useMemo(() => {
    const now = new Date();
    return data.latestUsers?.filter((u) => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (timeframe === "all") return true;
      const userDate = toLocalDate(u.date);
      if (!userDate) return true;
      if (timeframe === "today") return userDate.toDateString() === now.toDateString();
      if (timeframe === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return userDate >= weekAgo && userDate <= now;
      }
      if (timeframe === "month")
        return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
      return true;
    });
  }, [timeframe, statusFilter, data.latestUsers]);

  return (
    <Box sx={{ p: 3, background: "#f7f9fb", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
        User Stats
      </Typography>

      <StatSummary stats={data.stats || {}} />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mb: 2 }}>
        <TextField
          select
          label="Timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </TextField>
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="hold">On Hold</MenuItem>
        </TextField>
        <Button
          onClick={() => {
            setTimeframe("all");
            setStatusFilter("all");
          }}
          size="small"
          variant="outlined"
        >
          Reset Filters
        </Button>
      </Box>

      <Paper
        sx={{
          p: 1.5,
          mx: "auto",
          borderRadius: 3,
          boxShadow: 3,
          overflow: "hidden",
          backgroundColor: "#F7F9FB",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Latest Users
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip label={`Showing ${filteredUsers.length} of ${data.latestUsers?.length}`} size="small" />
            <Chip label={`Timeframe: ${timeframe}`} size="small" />
            <Chip label={`Status: ${statusFilter}`} size="small" />
          </Box>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F0F3FF" }}>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.85rem", py: 1 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.85rem", py: 1 }}>Mobile</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.85rem", py: 1 }}>Circle</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.85rem", py: 1 }}>Refer By</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "0.85rem", py: 1 }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((u, i) => (
              <TableRow key={i} hover>
                <TableCell sx={{ fontSize: "0.8rem", py: 1.5 }}>{u.name}</TableCell>
                <TableCell sx={{ fontSize: "0.8rem", py: 1.5 }}>{u.mobile}</TableCell>
                <TableCell sx={{ fontSize: "0.8rem", py: 1.5 }}>{u.circle}</TableCell>
                <TableCell sx={{ fontSize: "0.8rem", py: 1.5 }}>{u.refer_by}</TableCell>
                <TableCell sx={{ fontSize: "0.8rem", py: 1.5 }}>
                  {toLocalDate(u.date)?.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
