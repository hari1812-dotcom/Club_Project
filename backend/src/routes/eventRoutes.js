const express = require("express");
const router = express.Router();
const {
  createEvent,
  getMyClubEvents,
  getEventsForMyClubs,
  getEventById,
  updateEventAttendanceAndRewards,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("faculty"), createEvent);
router.get("/my-events", protect, authorize("student"), getMyClubEvents);
router.get("/faculty-events", protect, authorize("faculty"), getEventsForMyClubs);
router.get("/:id", protect, authorize("faculty"), getEventById);
router.patch(
  "/:id/attendance",
  protect,
  authorize("faculty"),
  updateEventAttendanceAndRewards
);

module.exports = router;
