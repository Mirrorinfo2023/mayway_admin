"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    DialogContentText,
} from "@mui/material";
import { Add, Edit, Delete, VisibilityOff, Visibility } from "@mui/icons-material";
import Layout from "@/components/Dashboard/layout";
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";

const CourseReportTable = () => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // categories from API
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");
    const [newCategoryParent, setNewCategoryParent] = useState(null);
    const [selectedCategoryFile, setSelectedCategoryFile] = useState(null);
    const [categoryErrors, setCategoryErrors] = useState({});

    const [formData, setFormData] = useState({
        user_id: "",
        category: "",
        name: "",
        link: "",
    });
    const [errors, setErrors] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [rows, setRows] = useState([]); // start empty

    // 🔹 Fetch course videos from API
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await api.post(
                    "/api/courses_video/get-video-course",
                );

                if (res.data?.success) {
                    console.log("Fetched videos:", res.data);

                    setRows(
                        (decData.videos || []).map((vid, idx) => ({
                            id: vid.id || idx + 1,
                            date: vid.created_at || new Date().toLocaleString(),
                            category: vid.category_name || "",
                            name: vid.title || "",
                            link: vid.video_link || "",
                            hidden: false,
                        }))
                    );
                } else {
                    console.error("Failed to fetch videos:", res.data?.message);
                }
            } catch (err) {
                console.error("Error fetching videos:", err);
            }
        };

        fetchVideos();
    }, []);

    useEffect(() => {
        // This will run once when the component mounts
        const uid = localStorage.getItem("uid");
        console.log("uid is: ", uid)
        if (uid) {
            setFormData((prev) => ({
                ...prev,
                user_id: uid,
            }));
        }
    }, []);

    console.log("formta is ", formData)
    // 🔹 Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.post("/api/courses_video/getcategory");
                console.log("res is: ", res)
                if (res.data?.success) {
                    setCategories(res.data.title || []);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Dialog controls
    const handleOpen = () => {
        setFormData({ category: "", name: "", link: "" });
        setErrors({});
        setIsEditing(false);
        setEditId(null);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    // Validation function
    const validateForm = () => {
        let tempErrors = {};
        if (!formData.category) tempErrors.category = "Category is required";
        if (!formData.name) tempErrors.name = "Course name is required";
        if (!formData.link) {
            tempErrors.link = "Course link is required";
        } else if (!/^https?:\/\/.+/.test(formData.link)) {
            tempErrors.link = "Enter a valid URL (https://...)";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Add video
    // Inside handleSubmit
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const formPayload = new FormData();
            formPayload.append("title", formData.name);
            formPayload.append("video_link", formData.link);
            formPayload.append("category_id", formData.category);

            if (isEditing && editId) {
                // 🔹 Update existing
                formPayload.append("video_id", editId);

                const res = await api.post("/api/courses_video/update-course-video", formPayload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (res.data.status === 200) {
                    alert("Video updated successfully!");
                    setRows(rows.map(r => r.id === editId ? { ...r, ...formData } : r));
                    handleClose();
                } else {
                    alert(res.data.message || "Failed to update video");
                }
            } else {
                // 🔹 Add new
                const res = await api.post("/api/courses_video/add-course-video", formPayload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (res.data.status === 200) {
                    alert("Video added successfully!");
                    setRows([...rows, { id: rows.length + 1, ...formData, hidden: false, date: new Date().toLocaleString() }]);
                    handleClose();
                } else {
                    alert(res.data.message || "Failed to add video");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };


    const handleAddCategorySubmit = async () => {
        // Basic validation
        if (!newCategoryName.trim()) {
            setCategoryErrors({ name: "Category name is required" });
            return;
        }
        setCategoryErrors({});

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("category_name", newCategoryName);
            formDataToSend.append("description", newCategoryDescription);
            // Send the current user_id from formData

            formDataToSend.append("user_id", formData.user_id);

            console.log("formDataToSend are: ", formDataToSend)

            const res = await api.post("/api/courses_video/getcategory", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.status === 201) {
                alert("Category added successfully!");
                setCategories([...categories, newCategoryName]);
                setCategoryOpen(false);
                setNewCategoryName("");
                setNewCategoryDescription("");
                setNewCategoryParent(null);
                setSelectedCategoryFile(null);
                // Optionally set the newly added category as selected in video form
                setFormData({ ...formData, category: newCategoryName });
            } else {
                alert(res.data.error || "Failed to add category");
            }
        } catch (err) {
            console.error("Failed to add category:", err);
            alert("Something went wrong");
        }
    };

    // Confirm dialog handler
    const confirmActionHandler = () => {
        if (confirmAction) confirmAction();
        setConfirmOpen(false);
    };

    // Hide/Unhide
    const handleToggleHide = async (id) => {
        try {
            const row = rows.find(r => r.id === id);
            const newHidden = !row.hidden;

            const res = await api.post("/api/courses_video/update-course-status", {
                video_id: id,
                hidden: newHidden ? 1 : 0,
            });

            if (res.data.status === 200) {
                setRows(rows.map(r => r.id === id ? { ...r, hidden: newHidden } : r));
            } else {
                alert(res.data.message || "Failed to update visibility");
            }
        } catch (err) {
            console.error("Toggle hide error:", err);
            alert("Something went wrong");
        }
    };

    // Edit
    const handleEdit = (row) => {
        setFormData({ category: row.category, name: row.name, link: row.link });
        setIsEditing(true);
        setEditId(row.id);
        setErrors({});
        setOpen(true);
    };

    // Delete
    const handleDelete = (id) => {
        setConfirmAction(() => async () => {
            try {
                const res = await api.post("/api/courses_video/delete-course-video", { video_id: id });
                if (res.data.status === 200) {
                    alert("Video deleted successfully!");
                    setRows(rows.filter((row) => row.id !== id));
                } else {
                    alert(res.data.message || "Failed to delete video");
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert("Something went wrong");
            }
        });
        setConfirmOpen(true);
    };


    // Filter rows
    const filteredRows = rows.filter(
        (row) =>
            (row.name.toLowerCase().includes(search.toLowerCase()) ||
                row.category.toLowerCase().includes(search.toLowerCase())) &&
            !row.hidden
    );

    return (
        <Layout>
            <Box p={3}>
                {/* Header Section */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    p={2}
                    sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 2,
                        boxShadow: 1,
                    }}
                >
                    <Typography variant="h6" fontWeight={600}>
                        Course Report
                    </Typography>

                    <Box display="flex" gap={2}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={handleOpen}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: 16,
                                px: 4,
                                py: 1.2,
                                background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                                textTransform: "none",
                            }}
                        >
                            Add new video
                        </Button>
                    </Box>
                </Box>

                {/* Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow
                                sx={{
                                    background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                    "& th": { color: "#fff", fontWeight: 600, fontSize: "14px" },
                                }}
                            >
                                <TableCell>S.R</TableCell>
                                <TableCell>Added Date & Time</TableCell>
                                <TableCell>Course Category</TableCell>
                                <TableCell>Course Name</TableCell>
                                <TableCell>Course Link</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.length > 0 ? (
                                filteredRows.map((row, index) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.category}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>
                                            <a href={row.link} target="_blank" rel="noopener noreferrer">
                                                {row.link}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color={row.hidden ? "success" : "warning"}
                                                size="small"
                                                onClick={() => handleToggleHide(row.id)}
                                            >
                                                {row.hidden ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            <IconButton color="primary" size="small" onClick={() => handleEdit(row)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" size="small" onClick={() => handleDelete(row.id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No matching records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Add/Edit Dialog */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle
                        sx={{
                            background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                            color: "#fff",
                        }}
                    >
                        {isEditing ? "Edit Video" : "Add New Video"}
                    </DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                        {/* Category with add option */}
                        <Box display="flex" gap={1} alignItems="center">
                            <Box display="flex" alignItems="center" gap={1}>
                                <Select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    displayEmpty
                                    error={!!errors.category}
                                    sx={{ minWidth: 400 }} // set fixed or min width
                                >
                                    <MenuItem value="">Select Category</MenuItem>
                                    {categories.map((cat, idx) => (
                                        <MenuItem key={idx} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </Select>

                                <Typography
                                    variant="body2"
                                    color="primary"
                                    sx={{
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                    }}
                                    onClick={() => setCategoryOpen(true)}
                                >
                                    Add Category
                                </Typography>
                            </Box>


                            <Dialog open={categoryOpen} onClose={() => setCategoryOpen(false)} fullWidth maxWidth="sm">
                                <DialogTitle
                                    sx={{
                                        background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                        color: "#fff", mb: 2
                                    }}
                                >
                                    Add New Category
                                </DialogTitle>
                                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                                    {/* Category Name */}
                                    <TextField
                                        label="Category Name *"
                                        fullWidth
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        error={!!categoryErrors.name}
                                        helperText={categoryErrors.name}
                                    />

                                    {/* Description */}
                                    <TextField
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={newCategoryDescription}
                                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                                    />

                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setCategoryOpen(false)} color="secondary">
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddCategorySubmit}
                                    >
                                        Submit
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </Box>
                        {errors.category && <Typography color="error">{errors.category}</Typography>}

                        <TextField
                            label="Course Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                        <TextField
                            label="Course Link"
                            fullWidth
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            error={!!errors.link}
                            helperText={errors.link}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {isEditing ? "Update" : "Submit"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Confirmation Dialog */}
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this course?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={confirmActionHandler} color="error" variant="contained">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default CourseReportTable;
