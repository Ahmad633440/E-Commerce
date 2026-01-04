import express from "express";
import { adminRoutes, protectedRoute } from "../middleware/authMiddleware.js";
import { getAnalyticData, getDailySalesData } from "../controllers/analyticController.js";

const router = express.Router();

router.get("/", protectedRoute, adminRoutes, async (req, res) => {
	try {
		const analyticsData = await getAnalyticData();

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		const dailySalesData = await getDailySalesData(startDate, endDate);

		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;