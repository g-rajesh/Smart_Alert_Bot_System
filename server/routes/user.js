const express = require("express");

const auth = require("../util/is-auth");

const router = express.Router();

const userController = require("../controllers/user");
const messageController = require("../controllers/messages");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/messages", auth, messageController.getMessages);
router.post("/addMessage", auth, messageController.addMessage);
router.get("/adminMessages", auth, messageController.getAdminMessages);

module.exports = router;