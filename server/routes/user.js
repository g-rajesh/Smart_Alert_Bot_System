const express = require("express");

const auth = require("../util/is-auth");

const router = express.Router();

const userController = require("../controllers/user");
const messageController = require("../controllers/messages");

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.get("/messages", auth, messageController.getMessages);
router.post("/addMessage", auth, messageController.addMessage);

router.get("/getFeedback", auth, messageController.getFeedback);
router.post("/addFeedback", auth, messageController.addFeedback);

router.get("/officialMessages", auth, messageController.getOfficalMessages);
router.get("/getAreas", auth, messageController.fetchAreas);
router.post("/updateStatus", auth, messageController.updateArea);

module.exports = router;