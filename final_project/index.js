const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {

    const token = req.headers.authorization;


    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token is missing" });
    }

    try {

        const decoded = jwt.verify(token, "your_secret_key");

        next();
    } catch (error) {

        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
