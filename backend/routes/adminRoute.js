const express = require("express")
const router = express.Router()

const {
projectsPerFaculty,
projectStatusStats,
trendingTechnologies,
mostActiveStudents
} = require("../controllers/adminController")

const verifyToken = require("../middleware/authMiddleware")
const authorizeRole = require("../middleware/roleMiddleware")

router.get(
"/projects-per-faculty",
verifyToken,
authorizeRole("admin"),
projectsPerFaculty
)

router.get(
"/status-stats",
verifyToken,
authorizeRole("admin"),
projectStatusStats
)

router.get(
"/trending-tech",
verifyToken,
authorizeRole("admin"),
trendingTechnologies
)

router.get(
"/top-students",
verifyToken,
authorizeRole("admin"),
mostActiveStudents
)

module.exports = router