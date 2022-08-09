const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routers
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const navbarRouter = require("./routes/Navbar");
app.use("/navbar", navbarRouter)

const homeRouter = require("./routes/Home");
app.use("/home", homeRouter)

const contactRouter = require("./routes/Contact");
app.use("/contact", contactRouter)

const settingsRouter = require("./routes/Settings");
app.use("/settings", settingsRouter)

const profileRouter = require("./routes/Profile");
app.use("/profile", profileRouter);

app.listen(3001, ()=>{
    console.log("Server listening on port 3001");
})

