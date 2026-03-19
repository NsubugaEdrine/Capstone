const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware")

const {
    createProject,
    getProjects,
    approveProject,
    rejectProject,
    getApprovedProjects,
    getProjectById,
    getProjectMilestones,
    addMilestone,
    updateMilestoneStatus,
    updateProjectProgress,
    getProjectComments,
    addProjectComment
} = require("../controllers/projectController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

// Student submits project
router.post(
    "/create",
    verifyToken,
    authorizeRole("student"),
    upload.single("document"),
    createProject
);


// Milestone and Progress tracking
router.get("/:id/milestones", verifyToken, getProjectMilestones);
router.post("/:id/milestones", verifyToken, authorizeRole("student"), addMilestone);
router.put("/milestones/:milestoneId", verifyToken, authorizeRole("student"), updateMilestoneStatus);
router.put("/:id/progress", verifyToken, authorizeRole("student"), updateProjectProgress);

// View all projects (Protected)
router.get("/", verifyToken, getProjects);

// Supervisor actions
router.put(
    "/approve/:id",
    verifyToken,
    authorizeRole("supervisor"),
    approveProject
);

router.put(
    "/reject/:id",
    verifyToken,
    authorizeRole("supervisor"),
    rejectProject
);

// Public gallery
router.get("/approved", getApprovedProjects);

// Public project detail (for approved projects)
router.get("/approved/:id", getProjectById);

// Comments & Feedback system
router.get("/:id/comments", getProjectComments);
router.post("/:id/comments", verifyToken, addProjectComment);

module.exports = router;

