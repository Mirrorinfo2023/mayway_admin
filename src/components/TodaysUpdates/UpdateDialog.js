import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Divider,
    Typography,
} from "@mui/material";
import { Upload } from "@mui/icons-material";
import api from "../../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption";

export default function UpdateDialog({ open, onClose, fetchUpdates, editData, sessionUserId }) {
    const [form, setForm] = useState({
        title: "",
        body: "",
        tags: "",
        image: null,
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({
                title: editData.title,
                body: editData.body,
                tags: editData.tags,
                image: null,
            });
        } else {
            setForm({ title: "", body: "", tags: "", image: null });
        }
    }, [editData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm({ ...form, [name]: files[0] });
        else setForm({ ...form, [name]: value });
    };
    const addTodaysUpdate = async () => {
        if (!form.title.trim() || !form.body.trim()) {
            alert("Please enter title and body");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("body", form.body);
        formData.append("tags", form.tags);
        if (form.image) formData.append("image", form.image);

        try {
            setSubmitting(true);
            const res = await api.post("/api/admin/add-todays-update", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log("res ", res)
            const data = res.data;

            if (data.status === 200) {
                alert("✅ Added successfully!");
                setForm({
                    title: " ",
                    body: " ",
                    tags: " ",
                    image: null,
                });
                onClose();
                fetchUpdates();
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (err) {
            console.error("Error adding update:", err);
            alert("Error adding update");
        } finally {
            setSubmitting(false);
        }
    };


    const editTodaysUpdate = async () => {
        if (!form.title.trim() || !form.body.trim()) {
            alert("Please enter title and body");
            return;
        }

        if (!editData?.id) {
            alert("Update ID missing for edit!");
            return;
        }

        const formData = new FormData();
        formData.append("id", editData.id); // required for editing
        formData.append("title", form.title);
        formData.append("body", form.body);
        formData.append("tags", form.tags || '');
        if (form.image) formData.append("image", form.image);

        try {
            setSubmitting(true);
            const res = await api.post("/api/admin/update-todays-update", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data.status === 200) {
                alert("✅ Update edited successfully!");
                onClose();
                fetchUpdates();
            } else {
                alert(res.data.message || "Something went wrong");
            }
        } catch (err) {
            console.error("Error editing update:", err);
            alert("Error editing update");
        } finally {
            setSubmitting(false);
        }
    };

   

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.15)", p: 1 },
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, bgcolor: "#f0f4ff", borderBottom: "1px solid #e0e0e0" }}>
                {editData ? "Edit Update" : "Add New Update"}
            </DialogTitle>
            <DialogContent dividers sx={{ bgcolor: "#fafafa" }}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            label="Title"
                            name="title"
                            fullWidth
                            value={form.title}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Body"
                            name="body"
                            multiline
                            rows={4}
                            fullWidth
                            value={form.body}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Tags (comma separated)"
                            name="tags"
                            fullWidth
                            value={form.tags}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" component="label" startIcon={<Upload />} fullWidth>
                            {editData ? "Change Image" : "Upload Image"}
                            <input type="file" hidden name="image" onChange={handleChange} />
                        </Button>
                        {form.image && (
                            <Typography sx={{ mt: 1 }} variant="body2">
                                Selected: {form.image.name}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={editData ? editTodaysUpdate : addTodaysUpdate}
                    disabled={submitting}
                >
                    {submitting ? "Saving..." : "Submit"}
                </Button>

            </DialogActions>
        </Dialog>
    );
}
