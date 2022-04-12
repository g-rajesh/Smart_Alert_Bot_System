const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')

const userRoutes = require("./routes/user");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);

// use this as body da siva
// {
//     "email": "rajesh@gmail.com",
//     "password": "Rajesh3@"
// }

app.listen(process.env.PORT || PORT, () => {
    console.log(`Listening to PORT ${PORT}`);
});