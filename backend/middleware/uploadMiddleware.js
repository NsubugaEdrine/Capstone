const multer = require("multer")
const path = require("path")

const uploadsDir = path.join(__dirname, "..", "uploads")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        const safeName = (file.originalname || "document").replace(/[^a-zA-Z0-9._-]/g, "_")
        cb(null, Date.now() + "-" + safeName)
    }

})

const upload = multer({
storage:storage
})

module.exports = upload