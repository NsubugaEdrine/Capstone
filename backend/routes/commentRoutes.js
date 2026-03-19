const express = require("express")
const router = express.Router()

const {addComment,getComments} = require("../controllers/commentController")

const verifyToken = require("../middleware/authMiddleware")

router.post("/add",verifyToken,addComment)

router.get("/:id",getComments)

module.exports = router
