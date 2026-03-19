const db = require("../config/db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const SECRET = "ucu_secret_key"

exports.register = async (req, res) => {
    const { name, email, password, role, faculty } = req.body
    
    // Email Validation: Must end with @ucu.ac.ug
    if (!email.endsWith("@ucu.ac.ug")) {
        return res.status(400).json({ error: "Email must be a valid UCU email (e.g., student@ucu.ac.ug)" });
    }

    // Password Validation: At least 8 characters, numbers, letters, and special characters
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+£[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
            error: "Password must be at least 8 characters long and contain letters, numbers, and special characters (e.g., £, !, @)." 
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const sql = "INSERT INTO users (name, email, password, role, faculty) VALUES (?, ?, ?, ?, ?)"
        
        const [result] = await db.query(sql, [name, email, hashedPassword, role, faculty]);
        
        const userId = result.insertId;
        const user = { id: userId, name, email, role, faculty };

        const token = jwt.sign(
            { id: userId, role: role, name },
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "User registered successfully",
            token,
            user
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const sql = "SELECT * FROM users WHERE email = ?"
        const [rows] = await db.query(sql, [email]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const user = rows[0]
        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            SECRET,
            { expiresIn: "1d" }
        )

        res.json({
            message: "Login successful",
            token,
            user
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}