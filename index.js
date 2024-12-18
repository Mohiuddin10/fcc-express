const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose")
require("dotenv").config();
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000;

// DB config 
const connectDB = () => {
    try {
        mongoose.connect(process.env.DB_URL)
        console.log("DB connected successfully");
    } catch (error) {
        console.log("DB connection failed");
    }
}

connectDB();

// schema section 
const userSchema = new mongoose.Schema({
    username: { type: String, require }
})

const exerciseSchema = new mongoose.Schema({
    user_id: { type: String, require: true },
    description: { type: String, require: true },
    duration: { type: Number, require: true },
    date: { type: Date, default: Date.now }
})

const User = mongoose.model("User", userSchema);

const Exercise = mongoose.model("Exercise", exerciseSchema);

app.get("/", (req, res) => {
    res.json({ message: "Server run successfully" })
})

app.post("/user", async (req, res) => {
    const username = req.body.username;
    const isAdded = await User.find({ username: username })
    if (!username) {
        res.json({ message: "user name required" })
    }
    else if (isAdded) {
        res.json({ message: "user already added" })
    } else {
        const user = await new User({
            username
        });
        user.save()
        res.json({ message: `new user named ${username} is added successfully` })
    }
})



app.get('/users/list', async (req, res) => {
    try {
        const users = await User.find();
        if (users.length < 1) {
            res.json({ message: "no user added" })
        } else {
            res.json({
                message: "users found",
                users
            })
        }
    } catch (error) {
        res.json({ message: "something broken" })
    }
})

app.listen(PORT, () => {
    console.log(`app is running at port no: http://localhost:${PORT}`);
})