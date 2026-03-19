require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("UCU Innovators Hub Backend Running");
});

const PORT = process.env.PORT || 5000;



const authRoute = require("./routes/authRoute")
const projectRoute = require("./routes/projectRoute")
const adminRoutes = require("./routes/adminRoute")
const commentRoutes = require("./routes/commentRoutes")
const runDiagnosis = require("./diagnose")
const path = require("path")

app.use("/api/auth", authRoute)
app.use("/api/projects", projectRoute)
app.use("/api/admin", adminRoutes)
app.use("/api/comments", commentRoutes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/api/diagnose", async (req, res) => {
    try {
        const results = await runDiagnosis();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Diagnosis failed", details: error.message });
    }
});

// Full-Stack Integration: Serve React frontend static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Client-side routing catch-all: send index.html for any non-API requests
app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
        res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
