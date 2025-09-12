"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Dashboard/layout";
import {
  Grid,
  Button,
  TextField,
  Paper,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Close, ContentCopy } from "@mui/icons-material";

function ZohoMeetingPage() {
  const [hostName, setHostName] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [participants, setParticipants] = useState([]);
  const [inputEmail, setInputEmail] = useState("");
  const [recurringType, setRecurringType] = useState("None");
  const [meetingLink, setMeetingLink] = useState("");
  const [customLink, setCustomLink] = useState("");

  const [meetings, setMeetings] = useState([]);

  // Static demo meetings with 20 participants
  const staticMeetings = [
    {
      hostName: "Alice Johnson",
      topic: "Project Kickoff",
      date: "2025-09-01",
      time: "10:00",
      duration: 60,
      recurringType: "None",
      participants: Array.from({ length: 20 }, (_, i) => `user${i + 1}@example.com`),
      meetingLink: "https://zoho.com/meet/abcd1234",
    },
    {
      hostName: "David Smith",
      topic: "Weekly Sync",
      date: "2025-09-02",
      time: "15:00",
      duration: 30,
      recurringType: "Weekly",
      participants: ["eve@example.com", "frank@example.com"],
      meetingLink: "https://zoho.com/meet/wxyz5678",
    },
  ];

  useEffect(() => {
    setMeetings(staticMeetings);
  }, []);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const addParticipant = () => {
    if (inputEmail.trim() === "") return;
    if (!validateEmail(inputEmail)) {
      alert("Invalid email!");
      return;
    }
    if (!participants.includes(inputEmail)) {
      setParticipants([...participants, inputEmail]);
      setInputEmail("");
    }
  };

  const removeParticipant = (email) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  const handleCreateMeeting = () => {
    if (!hostName || !topic || !date || !time) {
      alert("Please fill all required fields");
      return;
    }
    if (participants.length === 0) {
      alert("Add at least one participant");
      return;
    }
    const link =
      customLink.trim() !== ""
        ? customLink
        : `https://zoho.com/meet/${Math.random().toString(36).slice(2, 10)}`;
    setMeetingLink(link);
    alert("Meeting Created Successfully!");

    setMeetings([
      ...meetings,
      {
        hostName,
        topic,
        date,
        time,
        duration,
        recurringType,
        participants,
        meetingLink: link,
      },
    ]);

    // Reset form
    setHostName("");
    setTopic("");
    setDate("");
    setTime("");
    setDuration(30);
    setParticipants([]);
    setInputEmail("");
    setRecurringType("None");
    setCustomLink("");
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {/* Meeting Form */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" color="primary" fontWeight={600} mb={3}>
              Create Zoho Meeting
            </Typography>

            <TextField
              label="Host Name"
              fullWidth
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Meeting Topic"
              fullWidth
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  label="Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Duration (minutes)</InputLabel>
              <Select
                value={duration}
                label="Duration"
                onChange={(e) => setDuration(e.target.value)}
              >
                {[15, 30, 45, 60, 90, 120].map((d) => (
                  <MenuItem key={d} value={d}>
                    {d} minutes
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Participants */}
            <Box sx={{ mb: 2 }}>
              <Typography fontWeight={500}>Participants</Typography>
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {participants.map((email) => (
                      <TableRow key={email}>
                        <TableCell>{email}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => removeParticipant(email)}>
                            <Close />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display="flex" gap={2} mt={1}>
                <TextField
                  label="Email"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addParticipant}
                  startIcon={<Add />}
                >
                  Add
                </Button>
              </Box>
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Recurring</InputLabel>
              <Select
                value={recurringType}
                onChange={(e) => setRecurringType(e.target.value)}
              >
                <MenuItem value="None">Non-recurring</MenuItem>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Custom Meeting Link (optional)"
              fullWidth
              value={customLink}
              onChange={(e) => setCustomLink(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="https://zoho.com/meet/..."
            />

            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleCreateMeeting}
            >
              Create Meeting
            </Button>

            {meetingLink && (
              <Box
                mt={3}
                p={2}
                border={1}
                borderColor="grey.300"
                borderRadius={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography color="primary" sx={{ wordBreak: "break-all" }}>
                  {meetingLink}
                </Typography>
                <IconButton onClick={() => copyLink(meetingLink)} color="primary">
                  <ContentCopy />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Meeting Reports */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Meeting Reports
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Host Name</TableCell>
                    <TableCell>Topic</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Recurring</TableCell>
                    <TableCell>Participants</TableCell>
                    <TableCell>Meeting Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meetings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No meetings yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    meetings.map((m, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{m.hostName}</TableCell>
                        <TableCell>{m.topic}</TableCell>
                        <TableCell>{m.date}</TableCell>
                        <TableCell>{m.time}</TableCell>
                        <TableCell>{m.duration} min</TableCell>
                        <TableCell>{m.recurringType}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              maxHeight: 150,
                              overflowY: "auto",
                              paddingLeft: 1,
                            }}
                          >
                            <ul style={{ margin: 0, paddingLeft: "16px" }}>
                              {m.participants.map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              sx={{ wordBreak: "break-all" }}
                              color="primary"
                            >
                              {m.meetingLink}
                            </Typography>
                            <IconButton
                              onClick={() => copyLink(m.meetingLink)}
                              color="primary"
                              size="small"
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default ZohoMeetingPage;
