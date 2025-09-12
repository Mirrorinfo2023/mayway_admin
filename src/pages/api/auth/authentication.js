import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "dev_secret_key";

export default function handler(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        res.status(200).json({ userId: decoded.userId, role: decoded.role });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
}
