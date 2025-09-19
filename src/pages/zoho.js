"use client";
import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add, Close, ContentCopy } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers"

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
  const [meetings, setMeetings] = useState([]);

  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const addParticipant = () => {
    if (inputEmail.trim() === "") return;
    if (!validateEmail(inputEmail)) {
      setErrors((prev) => ({ ...prev, participant: "Invalid email" }));
      return;
    }
    if (!participants.includes(inputEmail)) {
      setParticipants([...participants, inputEmail]);
      setInputEmail("");
      setErrors((prev) => ({ ...prev, participant: "" }));
    }
  };

  const removeParticipant = (email) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!hostName) tempErrors.hostName = "Host name is required";
    if (!topic) tempErrors.topic = "Topic is required";
    if (!date) tempErrors.date = "Date is required";
    if (!time) tempErrors.time = "Time is required";
    if (participants.length === 0)
      tempErrors.participant = "At least one participant required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreateMeeting = async () => {
    if (!validateForm()) return;

    try {
      const startDateTime = new Date(`${date}T${time}:00Z`).toISOString();

      const response = await fetch("/api/createMeeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          start_date: startDateTime,
          duration,
          agenda: `Scheduled by ${hostName}`,
          participants,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error creating meeting:", data);
        alert("Failed to create meeting!");
        return;
      }

      const link = data.meeting?.meetingLink || data.meeting?.join_link;
      setMeetingLink(link);

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

      alert("Meeting Created Successfully!");

      // Reset form
      setHostName("");
      setTopic("");
      setDate("");
      setTime("");
      setDuration(30);
      setParticipants([]);
      setInputEmail("");
      setRecurringType("None");
      setErrors({});
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {/* Reports Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Meeting Reports
              </Typography>
              <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                Create Zoho Meeting
              </Button>
            </Box>

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
                          <Box sx={{ maxHeight: 150, overflowY: "auto", pl: 1 }}>
                            <ul style={{ margin: 0, paddingLeft: "16px" }}>
                              {m.participants.map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography sx={{ wordBreak: "break-all" }} color="primary">
                              {m.meetingLink}
                            </Typography>
                            <IconButton onClick={() => copyLink(m.meetingLink)} color="primary" size="small">
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

      {/* Dialog for Meeting Form */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Zoho Meeting</DialogTitle>
        <DialogContent dividers>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* Row 1: Host + Topic */}
            <Box display="flex" gap={2} mt={1}>
              <TextField
                label="Host Name"
                fullWidth
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                error={!!errors.hostName}
                helperText={errors.hostName}
              />
              <TextField
                label="Meeting Topic"
                fullWidth
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                error={!!errors.topic}
                helperText={errors.topic}
              />
            </Box>

            {/* Row 2: Date + Time */}
            <Box display="flex" gap={2} mt={2}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{ textField: { fullWidth: true, error: !!errors.date, helperText: errors.date } }}
              />
              <TimePicker
                label="Time"
                value={time}
                onChange={(newValue) => setTime(newValue)}
                slotProps={{ textField: { fullWidth: true, error: !!errors.time, helperText: errors.time } }}
              />
            </Box>

            {/* Row 3: Duration + Recurring */}
            <Box display="flex" gap={2} mt={2}>
              <FormControl fullWidth>
                <InputLabel>Duration (minutes)</InputLabel>
                <Select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                  {[15, 30, 45, 60, 90, 120].map((d) => (
                    <MenuItem key={d} value={d}>{d} minutes</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Recurring</InputLabel>
                <Select value={recurringType} onChange={(e) => setRecurringType(e.target.value)}>
                  <MenuItem value="None">Non-recurring</MenuItem>
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Participants */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Participants</Typography>
            <Box display="flex" gap={1}>
              <TextField
                label="Email"
                fullWidth
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
              />
              <Button variant="contained" onClick={addParticipant} startIcon={<Add />}>
                Add
              </Button>
            </Box>
            {errors.participant && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errors.participant}
              </Typography>
            )}

            <Box mt={2} display="flex" gap={1} flexWrap="wrap">
              {participants.map((email) => (
                <Box
                  key={email}
                  display="flex"
                  alignItems="center"
                  sx={{ p: 0.5, pl: 1, pr: 1, bgcolor: "#f1f1f1", borderRadius: 2 }}
                >
                  <Typography>{email}</Typography>
                  <IconButton onClick={() => removeParticipant(email)} size="small" color="error">
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreateMeeting}>
            Create Meeting
          </Button>
        </DialogActions>
      </Dialog>

    </Layout>
  );
}

export default ZohoMeetingPage;
