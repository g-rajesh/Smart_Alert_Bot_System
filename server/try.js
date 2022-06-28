const mongoose = require("mongoose");
// require("dotenv").config();

// const bcrypt = require("bcryptjs");

// const Zone = require("./models/zone");
// const User = require("./models/user");
// const Area = require("./models/area");
// const Feedback = require("./models/feedback");

// message is sending even after already raised

mongoose.connect(process.env.DB_URL).then(async () => {
    console.log("Hello world");
});

// const name = "Tiruvottiyur";
// 	const feedbacks = await Feedback.find().sort({date: -1, createdAt: -1});
// 	console.log(feedbacks);

// await Feedback.create({
// 	from: "Williams",
// 	email: "teamtneb@gmail.com",
// 	message: "No current",
// 	userType: 0,
// 	date: "2022-06-28",
// 	ZoneId: "62ba52a878088052145f5eb9"
// })

// const user = await User.create({name: "Rajesh", age: 24});
// await user.save();

// const user = await User.updateOne({name: "Sathish"}, {age: 25});
// console.log(user); 

// const user = await User.findOne({name: "Rajesh"});
// console.log(user);

// const area = await Area.findOne({name: "Wimco Nagar"}).populate('ZoneId');