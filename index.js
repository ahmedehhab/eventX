import express from "express";
import dotenv from "dotenv";
import bootstrap from "./bootstrap.js";

dotenv.config();

const app = express();

bootstrap(app);

