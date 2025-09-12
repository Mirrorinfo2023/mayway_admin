import React, { useState } from "react";
import {
    Grid,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    InputAdornment,
} from "@mui/material";
import api from "../../utils/api"; // axios instance
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";

// Icons
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HomeIcon from "@mui/icons-material/Home";
import TagIcon from "@mui/icons-material/Tag";
// helper for small inputs + icons
const smallInputProps = (icon) => ({
    size: "small",
    InputLabelProps: { shrink: false },  // 👈 important
    InputProps: {
        startAdornment: (
            <InputAdornment position="start">
                {React.cloneElement(icon, { fontSize: "small", sx: { fontSize: 18 } })}
            </InputAdornment>
        ),
    },
});
export default function AddUserDialog({ open, onClose }) {
    const [formData, setFormData] = useState({
        referred_by: "",
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        mobile: "",
        password: "",
        pincode: "",
        postOfficeName: "",
        circle: "",
        district: "",
        division: "",
        region: "",
        dob: "",
    });

    const [errors, setErrors] = useState({});
    const [referralStatus, setReferralStatus] = useState(null); // null, true, false
    const [loadingReferral, setLoadingReferral] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Reset referral check when editing
        if (name === "referred_by") setReferralStatus(null);

        // Trigger pincode lookup
        if (name === "pincode" && value.length === 6) {
            handleFetchAddress(value);
        }
    };

    // ✅ Validation rules
    const validateForm = () => {
        let tempErrors = {};

        if (!formData.first_name.trim()) tempErrors.first_name = "First name is required";
        if (!formData.last_name.trim()) tempErrors.last_name = "Last name is required";
        if (!formData.username.trim()) tempErrors.username = "Username is required";

        if (!formData.email) {
            tempErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = "Enter a valid email";
        }

        if (!formData.mobile) {
            tempErrors.mobile = "Mobile number is required";
        } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
            tempErrors.mobile = "Enter a valid 10-digit mobile number";
        }

        if (!formData.password) {
            tempErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            tempErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.pincode) {
            tempErrors.pincode = "Pincode is required";
        } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
            tempErrors.pincode = "Enter a valid 6-digit pincode";
        }

        if (!formData.state) tempErrors.state = "State is required";
        if (!formData.city) tempErrors.city = "City is required";
        if (!formData.address) tempErrors.address = "Address is required";

        if (!formData.referred_by) tempErrors.referred_by = "Referral ID is required";

        if (!formData.postOfficeName.trim()) tempErrors.postOfficeName = "Post Office Name is required";
        if (!formData.circle.trim()) tempErrors.circle = "Circle is required";
        if (!formData.district.trim()) tempErrors.district = "District is required";
        if (!formData.division.trim()) tempErrors.division = "Division is required";
        if (!formData.region.trim()) tempErrors.region = "Region is required";
        if (!formData.dob.trim()) tempErrors.dob = "Date of Birth is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleFetchAddress = async (pincode) => {
        console.log("pincode is: ", pincode);
        try {
            const encPincode = DataEncrypt(JSON.stringify({ pincode }));
            const resPincode = await api.post(
                "/api/pincode/916e4eb592f2058c43a3face75b0f9d49ef2bd17",
                { encPincode },
                { headers: { "Content-Type": "application/json" } }
            );
            const pincodeData = DataDecrypt(resPincode.data);

            if (pincodeData?.status === 200 && pincodeData?.data?.length > 0) {
                const office = pincodeData.data[0];

                // 🔹 Fetch state details
                const encState = DataEncrypt(JSON.stringify({ state: office.State }));
                const resState = await api.post(
                    "/api/state/d23d7537f9a6da6fd195810c82699cb2f81c3d11",
                    { encState },
                    { headers: { "Content-Type": "application/json" } }
                );
                const stateData = DataDecrypt(resState.data);

                // 🔹 Fetch city details
                const encCity = DataEncrypt(JSON.stringify({ district: office.District }));
                const resCity = await api.post(
                    "/api/city/e2caa4a86f1cda61fa7efc12c7a8791a8c59bc90",
                    { encCity },
                    { headers: { "Content-Type": "application/json" } }
                );
                const cityData = DataDecrypt(resCity.data);

                setFormData((prev) => ({
                    ...prev,
                    postOfficeName: office.Office_name || "Default PO",
                    circle: office.Circle || "Maharashtra",
                    district: office.District || "AHMEDNAGAR",
                    division: office.Division || "Shrirampur",
                    region: office.Region || "Pune",
                    state: stateName,
                    city: cityName,
                    // address: `${office.Office_name || "Default PO"}, ${cityName}, ${stateName} - ${office.Pincode || pincode}`,
                }));
            }
        } catch (error) {
            console.error("Failed to fetch address:", error);
        }
    };


    // Verify Referral ID API
    const handleVerifyReferral = async () => {
        if (!formData.referred_by) {
            setErrors((prev) => ({ ...prev, referred_by: "Referral ID is required" }));
            return;
        }
        setLoadingReferral(true);
        try {
            const encReferral = DataEncrypt(
                JSON.stringify({ mlm_id: formData.referred_by })
            );

            const response = await api.post(
                "/api/users/9a82bc2234a56504434ce88e3ab2a11f34b0dcc8",
                { encReq: encReferral },
                { headers: { "Content-Type": "application/json" } }
            );

            const decrypted = DataDecrypt(response.data);
            console.log("Referral verified:", decrypted);

            if (decrypted.status === 200) {
                setReferralStatus(true);
                setErrors((prev) => ({ ...prev, referred_by: "" }));
            } else {
                setReferralStatus(false);
            }
        } catch (error) {
            console.error("Referral verification failed:", error);
            setReferralStatus(false);
        } finally {
            setLoadingReferral(false);
        }
    };

    // Create User API
    const handleCreateUser = async () => {
        if (!validateForm()) return;

        if (referralStatus !== true) {
            alert("Please verify a valid referral ID before registering.");
            return;
        }

        console.log("formdata is: ", formData)
        try {
            const payload = { ...formData };
            const encReq = DataEncrypt(JSON.stringify(payload));

            const response = await api.post(
                "/api/users/13a2828b3adecc1c32ea3888d08afa51e147b3f3",
                { encReq },
                { headers: { "Content-Type": "application/json" } }
            );

            const decrypted = DataDecrypt(response.data);
            console.log("✅ Registration Success:", decrypted);
            alert("User registered successfully!");

            // ✅ Reset form fields
            setFormData({
                referred_by: "",
                first_name: "",
                last_name: "",
                username: "",
                email: "",
                mobile: "",
                password: "",
                pincode: "",
                postOfficeName: "",
                circle: "",
                district: "",
                division: "",
                region: "",
                dob: "",
            });

            // ✅ Reset errors and referral status
            setErrors({});
            setReferralStatus(null);

            onClose(); // optional: close dialog
        } catch (error) {
            let decryptedError = error.response?.data;
            try {
                decryptedError = DataDecrypt(error.response.data);
            } catch (e) {
                console.warn("⚠️ Could not decrypt error response:", e);
            }
            console.error("❌ Registration Failed:", decryptedError);
            alert(
                `Registration failed: ${decryptedError?.message || error.message}`
            );
        }
    };


    // helper for small inputs + icons
    const smallInputProps = (icon) => ({
        size: "small",
        InputProps: {
            startAdornment: (
                <InputAdornment position="start">
                    {React.cloneElement(icon, { fontSize: "small", sx: { fontSize: 18 } })}
                </InputAdornment>
            ),
        },
    });
    const smallInputProps1 = (icon) => ({
        size: "medium",
        InputProps: {
            startAdornment: (
                <InputAdornment position="start">
                    {React.cloneElement(icon, { fontSize: "small", sx: { fontSize: 25 } })}
                </InputAdornment>
            ),
        },
    });
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    fontWeight: 700,
                    fontSize: "20px",
                    textAlign: "center",
                    background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                    color: "#fff",
                    py: 2,
                }}
            >
                Add New User
            </DialogTitle>

            <DialogContent dividers sx={{ background: "#f9f9f9", p: 3 }}>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* First Name */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="first_name"
                            label="First Name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            {...smallInputProps(<PersonIcon />)}
                            error={!!errors.first_name}
                            helperText={errors.first_name}
                        />
                    </Grid>

                    {/* Last Name */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="last_name"
                            label="Last Name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            {...smallInputProps(<PersonIcon />)}
                            error={!!errors.last_name}
                            helperText={errors.last_name}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} sm={6} sx={{ color: "#333" }}>
                        <TextField
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            {...smallInputProps(<EmailIcon />)}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>

                    {/* Password */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            {...smallInputProps(<LockIcon />)}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                    </Grid>

                    {/* Username */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="username"
                            label="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            {...smallInputProps(<AccountCircleIcon />)}
                            error={!!errors.username}
                            helperText={errors.username}
                        />
                    </Grid>

                    {/* Mobile */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="mobile"
                            label="Mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            {...smallInputProps(<PhoneIcon />)}
                            error={!!errors.mobile}
                            helperText={errors.mobile}
                        />
                    </Grid>

                    {/* Pincode */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="pincode"
                            label="Pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            {...smallInputProps(<LocationOnIcon />)}
                            error={!!errors.pincode}
                            helperText={errors.pincode}
                        />
                    </Grid>

                    {/* Referral ID + Verify button */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="referred_by"
                            label="Referral ID"
                            value={formData.referred_by}
                            onChange={handleInputChange}
                            size="small"
                            error={!!errors.referred_by}
                            helperText={errors.referred_by}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TagIcon fontSize="small" sx={{ fontSize: 18 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={handleVerifyReferral}
                                            disabled={loadingReferral}
                                            sx={{
                                                height: "30px",
                                                backgroundColor:
                                                    referralStatus === true
                                                        ? "#4caf50"
                                                        : referralStatus === false
                                                            ? "#f44336"
                                                            : "#2196f3",
                                                color: "#fff",
                                                fontSize: "0.75rem",
                                                textTransform: "none",
                                            }}
                                        >
                                            {loadingReferral ? "Verifying..." : "Verify"}
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {referralStatus === true && (
                            <Typography sx={{ color: "green", mt: 0.5, fontSize: "0.75rem" }}>
                                Referral Valid ✅
                            </Typography>
                        )}
                        {referralStatus === false && (
                            <Typography sx={{ color: "red", mt: 0.5, fontSize: "0.75rem" }}>
                                Referral Invalid ❌
                            </Typography>
                        )}
                    </Grid>

                    {/* State */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="state"
                            label="State"
                            value={formData.state}
                            InputProps={{ readOnly: true }}
                            {...smallInputProps(<PublicIcon />)}
                            error={!!errors.state}
                            helperText={errors.state}
                        />
                    </Grid>

                    {/* City */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="city"
                            label="City"
                            value={formData.city}
                            InputProps={{ readOnly: true }}
                            {...smallInputProps(<LocationCityIcon />)}
                            error={!!errors.city}
                            helperText={errors.city}
                        />
                    </Grid>

                    {/* Post Office */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="postOfficeName"
                            label="Post Office Name"
                            value={formData.postOfficeName}
                            InputProps={{ readOnly: true }}
                            {...smallInputProps(<HomeIcon />)}
                            error={!!errors.postOfficeName}
                            helperText={errors.postOfficeName}
                        />
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="circle"
                            label="Circle"
                            value={formData.circle}
                            InputProps={{ readOnly: true }}
                            {...smallInputProps(<PublicIcon />)}
                            error={!!errors.circle}
                            helperText={errors.circle}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="district"
                            label="District"
                            value={formData.district}
                            InputProps={{ readOnly: true }}
                            {...smallInputProps(<LocationCityIcon />)}
                            error={!!errors.district}
                            helperText={errors.district}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="division"
                            label="Division"
                            value={formData.division}
                            InputProps={{ readOnly: true }}
                            {...smallInputProps(<LocationCityIcon />)}
                            error={!!errors.division}
                            helperText={errors.division}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="region"
                            label="Region"
                            value={formData.region}
                            InputProps={{ readOnly: true }}
                            {...smallInputProps(<LocationCityIcon />)}
                            error={!!errors.region}
                            helperText={errors.region}
                        />
                    </Grid> */}

                    {/* Date of Birth */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            name="dob"
                            label="Date of Birth"
                            type="date"
                            value={formData.dob}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            {...smallInputProps(<PersonIcon />)}
                            error={!!errors.dob}
                            helperText={errors.dob}
                        />
                    </Grid>

                    {/* Address */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2} // 👈 sets height (3 lines tall by default)
                            maxRows={5} // optional: prevents it from growing too big
                            name="address"
                            label="Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            {...smallInputProps1(<HomeIcon />)}
                            error={!!errors.address}
                            helperText={errors.address}
                        />

                    </Grid>



                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
                {/* Cancel Button */}
                <Button
                    onClick={onClose}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: 14,
                        px: 2.5,
                        py: 0.5,
                        textTransform: "none",
                        borderColor: "#888",
                        color: "#555",
                        "&:hover": {
                            borderColor: "#555",
                            backgroundColor: "#f5f5f5",
                        },
                    }}
                >
                    Cancel
                </Button>

                {/* Create User Button */}
                <Button
                    variant="contained"
                    onClick={handleCreateUser}
                    sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: 14,
                        px: 3,
                        py: 0.5, // 👈 smaller height
                        background: "linear-gradient(90deg, #4caf50 0%, #81c784 100%)",
                        textTransform: "none",
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
                        "&:hover": {
                            background: "linear-gradient(90deg, #43a047 0%, #66bb6a 100%)",
                        },
                    }}
                >
                    Create User
                </Button>
            </DialogActions>

        </Dialog>
    );
}
