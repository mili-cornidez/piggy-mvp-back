import express from "express";
import { sendAnalyticsEvent } from "../controllers/privyController";

const router = express.Router();

router.post("/analytics", sendAnalyticsEvent);

export default router;
