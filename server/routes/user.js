const express = require("express");

const auth = require("../util/is-auth");

const router = express.Router();

const userController = require("../controllers/user");
const messageController = require("../controllers/messages");
const userMessageController = require("../controllers/userMessage.js");
const officialMessageController = require("../controllers/officialMessage.js");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);

router.get("/messages", auth, userMessageController.getMessages);
router.post("/addMessage", auth, userMessageController.addMessage);

router.get("/getFeedback", auth, messageController.getFeedback);
router.post("/addFeedback", auth, messageController.addFeedback);
router.get("/getAreas", auth, messageController.fetchAreas);

router.get("/officialMessages", auth, officialMessageController.getOfficalMessages);
router.post("/updateStatus", auth, officialMessageController.updateArea);

module.exports = router;