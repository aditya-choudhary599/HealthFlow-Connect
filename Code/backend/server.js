// Configuration for accessing the env file data
import dotenv from "dotenv";
dotenv.config();

// Express is required for creating the server
import express from "express";

// Cors is required for cross-site origin access
import cors from "cors";

// Importing the function for connection to database
import { connect_db } from "./db_scripts/db_connect.js";

// Importing the routes
import { general_router } from "./api_routes/general_routes.js";
import { admin_router } from "./api_routes/admin_routes.js";
import { counter_router } from "./api_routes/counter_routes.js";
import { lab_technician_router } from "./api_routes/lab_technician_routes.js";
import { doctor_router } from "./api_routes/doctor_routes.js";
import { pharmacist_router } from "./api_routes/pharmacist_routes.js";
import { otp_router } from "./api_routes/otp_routes.js"

// This will be used for connection with local mongo database
await connect_db(process.env.DATABASE_URL);

// Configuration for backend express server
const app = express();
const server_port = process.env.SERVER_PORT;

// Configuration for api interaction
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Configuration of routes
app.use('', general_router);
app.use('/admin', admin_router);
app.use('/counter', counter_router);
app.use('/lab_technician', lab_technician_router);
app.use('/doctor', doctor_router);
app.use('/pharmacist', pharmacist_router);
app.use('/otp', otp_router);

// Setting up the server
app.listen(server_port, () => {
    return console.log(`Server is running at http://localhost:${server_port}`);
});