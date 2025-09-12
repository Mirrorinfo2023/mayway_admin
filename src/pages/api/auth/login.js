import jwt from "jsonwebtoken";

// Dummy users — replace with DB query
const USERS = [
  {
    id: "1",
    email: "admin@test.com",
    password: "Test@123",   // In production, store hashed passwords
    name: "Admin User",
    role: "admin",
  },
  {
    id: "1",
    email: "admin@test.com",
    password: "Test@123",   // In production, store hashed passwords
    name: "Admin User",
    role: "admin",
  },
];

const SECRET = process.env.JWT_SECRET || "dev_secret_key";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  const user = USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
