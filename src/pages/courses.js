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
    InputAdornment,
} from "@mui/material";
import {
    Add,
    Edit,
    Delete,
    VisibilityOff,
    Visibility,
} from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Layout from "@/components/Dashboard/layout";
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import ReCAPTCHA from "react-google-recaptcha";

const CourseReportTable = () => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [categories, setCategories] = useState({});
    const [rows, setRows] = useState([]);

    const [formData, setFormData] = useState({
        category: "",
        name: "",
        link: "",
    });
    const [errors, setErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");
    const [categoryImage, setCategoryImage] = useState(null);
    const [categoryErrors, setCategoryErrors] = useState({});

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    // CAPTCHA state
    const [captchaValue, setCaptchaValue] = useState(null);

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        const time = date.toLocaleTimeString("en-US");
        return `${day}/${month}/${year}, ${time}`;
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.post("/api/courses_video/getAllcategory");
                if (res.data?.data) {
                    const decryptedResp = DataDecrypt(res.data.data);
                    if (decryptedResp.status === 200) {
                        const categoryDict = decryptedResp.data.reduce((acc, cat) => {
                            acc[cat.id] = cat.title;
                            return acc;
                        }, {});
                        setCategories(categoryDict);
                    } else {
                        console.error("Failed to fetch categories:", decryptedResp.message);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [categories]);

    const fetchVideos = async () => {
        try {
            const res = await api.post("/api/courses_video/get-videos");
            if (res.data?.data) {
                const decryptedResp = DataDecrypt(res.data.data);
                if (decryptedResp.status === 200) {
                    const videos = decryptedResp.data;
                    const videoArray = Array.isArray(videos) ? videos : [videos];
                    setRows(
                        videoArray.map((vid) => ({
                            id: vid.id,
                            date: formatDate(vid.created_on),
                            category: categories[vid.category_id] || "N/A",
                            name: vid.title,
                            link: vid.video_link,
                            status: vid.status,
                            thumbnail_img: vid.thumbnail_img,
                        }))
                    );
                } else {
                    console.error("Failed to fetch videos:", decryptedResp.message);
                }
            }
        } catch (err) {
            console.error("Error fetching videos:", err);
        }
    };

    const handleOpen = () => {
        setFormData({ category: "", name: "", link: "" });
        setErrors({});
        setIsEditing(false);
        setEditId(null);
        setSelectedFile(null);
        setCaptchaValue(null);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setCaptchaValue(null);
    };

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.category) tempErrors.category = "Category is required";
        if (!formData.name) tempErrors.name = "Course name is required";
        if (!formData.link) {
            tempErrors.link = "Course link is required";
        } else if (!/^https?:\/\/.+/.test(formData.link)) {
            tempErrors.link = "Enter a valid URL (https://...)";
        }
        if (!isEditing && !selectedFile) {
            tempErrors.image = "Course image is required";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setErrors({ ...errors, image: "Please select a valid image file" });
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, image: "Image size should be less than 5MB" });
                return;
            }
            setSelectedFile(file);
            setErrors({ ...errors, image: "" });
        }
    };

    const handleEdit = (row) => {
        setFormData({
            category: Object.keys(categories).find(
                (id) => categories[id] === row.category
            ) || "",
            name: row.name,
            link: row.link,
        });
        setIsEditing(true);
        setEditId(row.id);
        setSelectedFile(null);
        setErrors({});
        setCaptchaValue(null);
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (!captchaValue) {
            alert("⚠️ Please verify the CAPTCHA before submitting.");
            return;
        }

        try {
            if (isEditing && editId) {
                const payload = {
                    video_id: editId,
                    title: formData.name,
                    video_link: formData.link,
                    category_id: formData.category,
                    status: 1,
                };
                const encryptedPayload = DataEncrypt(JSON.stringify(payload));
                const res = await api.post("/api/courses_video/update-video", {
                    data: encryptedPayload,
                });
                if (res.data?.data) {
                    const decryptedResp = DataDecrypt(res.data.data);
                    if (decryptedResp.status === 200) {
                        alert(decryptedResp.message);
                        setRows(
                            rows.map((r) =>
                                r.id === editId
                                    ? {
                                        ...r,
                                        category: categories[formData.category] || "N/A",
                                        name: formData.name,
                                        link: formData.link,
                                        status: 1,
                                    }
                                    : r
                            )
                        );
                        handleClose();
                    } else {
                        alert(decryptedResp.message || "Failed to update video");
                    }
                }
            } else {
                const payload = {
                    title: formData.name,
                    video_link: formData.link,
                    category_id: formData.category,
                    status: 1,
                };
                const encryptedPayload = DataEncrypt(JSON.stringify(payload));
                const formDataToSend = new FormData();
                formDataToSend.append("data", encryptedPayload);
                if (selectedFile) {
                    formDataToSend.append("image", selectedFile);
                }
                const res = await api.post("/api/courses_video/add-video", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if (res.data?.data) {
                    const decryptedResp = DataDecrypt(res.data.data);
                    if (decryptedResp.status === 201) {
                        alert("Course added successfully!");
                        fetchVideos();
                        handleClose();
                    } else {
                        alert(decryptedResp.message || "Failed to add video");
                    }
                }
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    const handleAddCategorySubmit = async () => {
        if (!newCategoryName.trim()) {
            setCategoryErrors({ name: "Category name is required" });
            return;
        }
        setCategoryErrors({});
        try {
            const payload = {
                category_name: newCategoryName,
                description: newCategoryDescription,
                user_id: formData.user_id || 1,
            };
            const encryptedData = DataEncrypt(JSON.stringify(payload));
            const formDataToSend = new FormData();
            formDataToSend.append("data", encryptedData);
            if (categoryImage) formDataToSend.append("image", categoryImage);
            const res = await api.post("/api/courses_video/addcategory", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data?.data) {
                const decryptedResp = DataDecrypt(res.data.data);
                if (decryptedResp.status === 201) {
                    alert(decryptedResp.message || "Category added successfully!");
                    const newCategory = decryptedResp.data;
                    setCategories({
                        ...categories,
                        [newCategory.id]: newCategory.category_name,
                    });
                    setCategoryOpen(false);
                    setNewCategoryName("");
                    setNewCategoryDescription("");
                    setCategoryImage(null);
                } else {
                    alert(decryptedResp.message || "Something went wrong");
                }
            }
        } catch (err) {
            console.error("Failed to add category:", err);
            alert("Something went wrong");
        }
    };

    const confirmActionHandler = () => {
        if (confirmAction) confirmAction();
        setConfirmOpen(false);
    };

    const handleToggleHide = async (id) => {
        try {
            const payload = { video_id: id };
            const encryptedData = DataEncrypt(JSON.stringify(payload));
            const res = await api.post("/api/courses_video/hide-video", { data: encryptedData });
            if (res.data?.data) {
                const decryptedResp = DataDecrypt(res.data.data);
                if (decryptedResp.status === 200) {
                    setRows(
                        rows.map((r) =>
                            r.id === id ? { ...r, status: decryptedResp.newStatus } : r
                        )
                    );
                } else {
                    alert(decryptedResp.message || "Failed to update video status");
                }
            }
        } catch (err) {
            console.error("Toggle hide error:", err);
            alert("Something went wrong");
        }
    };

    const handleDelete = (id) => {
        setConfirmAction(() => async () => {
            try {
                const payload = { video_id: id };
                const encryptedData = DataEncrypt(JSON.stringify(payload));
                const res = await api.post("/api/courses_video/delete-video-course", {
                    data: encryptedData,
                });
                if (res.data?.data) {
                    const decryptedResp = DataDecrypt(res.data.data);
                    if (decryptedResp.status === 200) {
                        setRows(rows.filter((row) => row.id !== id));
                    } else {
                        alert(decryptedResp.message || "Failed to delete video");
                    }
                }
            } catch (err) {
                console.error("Delete error:", err);
                alert("Something went wrong");
            }
        });
        setConfirmOpen(true);
    };

    const filteredRows = rows.filter(
        (row) =>
            row.status === 1 &&
            (row.name.toLowerCase().includes(search.toLowerCase()) ||
                row.category.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <Layout>
            <Box p={3}>
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
                            Add new Course
                        </Button>
                    </Box>
                </Box>

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
                                <TableCell>Image</TableCell>
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
                                            <a
                                                href={row.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: "#1976d2",
                                                    textDecoration: "none",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                View Video
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {row.thumbnail_img ? (
                                                <a
                                                    href={row.thumbnail_img}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={row.thumbnail_img}
                                                        alt="Thumbnail"
                                                        style={{
                                                            width: 60,
                                                            height: 40,
                                                            borderRadius: 4,
                                                            objectFit: "cover",
                                                            border: "1px solid #ddd",
                                                        }}
                                                    />
                                                </a>
                                            ) : (
                                                <span style={{ color: "#999" }}>No Image</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color={row.hidden ? "success" : "warning"}
                                                size="small"
                                                onClick={() => handleToggleHide(row.id)}
                                            >
                                                {row.hidden ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={() => handleEdit(row)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(row.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
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
                        {isEditing ? "Edit Course" : "Add New Course"}
                    </DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                        <Box display="flex" gap={1} alignItems="center">
                            <Box display="flex" alignItems="center" gap={1}>
                                <Select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    displayEmpty
                                    error={!!errors.category}
                                    sx={{ minWidth: 400 }}
                                >
                                    <MenuItem value="">Select Category</MenuItem>
                                    {Object.entries(categories).map(([id, title]) => (
                                        <MenuItem key={id} value={id}>
                                            {title}
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

                            <Dialog
                                open={categoryOpen}
                                onClose={() => setCategoryOpen(false)}
                                fullWidth
                                maxWidth="sm"
                            >
                                <DialogTitle
                                    sx={{
                                        background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                        color: "#fff",
                                        mb: 2,
                                    }}
                                >
                                    Add New Category
                                </DialogTitle>
                                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    <TextField
                                        label="Category Name *"
                                        fullWidth
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        error={!!categoryErrors.name}
                                        helperText={categoryErrors.name}
                                    />
                                    <TextField
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={newCategoryDescription}
                                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        value={categoryImage ? categoryImage.name : ""}
                                        placeholder="Upload Category Image"
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ImageIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton component="label">
                                                        <UploadFileIcon />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                            onChange={(e) => setCategoryImage(e.target.files[0])}
                                                        />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
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

                        <TextField
                            fullWidth
                            value={selectedFile ? selectedFile.name : ""}
                            placeholder="Upload Course Image *"
                            error={!!errors.image}
                            helperText={errors.image || "Supported formats: JPG, PNG, GIF. Max size: 5MB"}
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ImageIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton component="label">
                                            <UploadFileIcon />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={handleFileSelect}
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* ✅ Google reCAPTCHA */}
                        <Box display="flex" justifyContent="flex-start" sx={{ mt: 2 }}>
                            <ReCAPTCHA
                                sitekey="6LdHTbwrAAAAAGawIo2escUPr198m8cP3o_ZzZK1"
                                onChange={(value) => setCaptchaValue(value)}
                            />
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={!captchaValue}
                        >
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
