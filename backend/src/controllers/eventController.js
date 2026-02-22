const Event = require("../models/Event");
const Club = require("../models/Club");
const Notification = require("../models/Notification");
const User = require("../models/User");

// Faculty: create event (goes to admin for approval)
exports.createEvent = async (req, res, next) => {
  try {
    const { clubId, venue, date, description } = req.body;

    if (!clubId || !venue || !date || !description) {
      return res
        .status(400)
        .json({ message: "clubId, venue, date and description are required" });
    }

    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (String(club.facultyIncharge) !== String(req.user.id)) {
      return res.status(403).json({ message: "You are not incharge of this club" });
    }

    const event = await Event.create({
      clubId,
      createdBy: req.user.id,
      venue,
      date: new Date(date),
      description,
    });

    // Notify all admins for approval
    const admins = await User.find({ role: "admin", isActive: true });
    await Promise.all(
      admins.map((admin) =>
        Notification.create({
          userId: admin._id,
          message: `New event submitted for approval for club ${club.name}`,
        })
      )
    );

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

// Student: events for my clubs (approved only)
exports.getMyClubEvents = async (req, res, next) => {
  try {
    const clubs = await Club.find({ members: req.user.id }).select("_id");
    const clubIds = clubs.map((c) => c._id);

    const events = await Event.find({
      clubId: { $in: clubIds },
      status: "Approved",
    })
      .populate("clubId", "name")
      .sort({ date: 1 });

    res.json(events);
  } catch (err) {
    next(err);
  }
};

// Faculty: events for clubs they manage
exports.getEventsForMyClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find({ facultyIncharge: req.user.id }).select("_id");
    const clubIds = clubs.map((c) => c._id);

    const events = await Event.find({ clubId: { $in: clubIds } })
      .populate("clubId", "name")
      .sort({ date: 1 });

    res.json(events);
  } catch (err) {
    next(err);
  }
};

// Faculty: get single event (for manage page)
exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("clubId", "name members")
      .populate("studentCoordinator", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const clubId = event.clubId?._id || event.clubId;
    const club = await Club.findById(clubId);
    if (!club || String(club.facultyIncharge) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not your event" });
    }
    const members = await User.find({ _id: { $in: club.members }, role: "student" }).select("name email");
    res.json({ ...event.toObject(), clubMembers: members });
  } catch (err) {
    next(err);
  }
};

// Faculty: assign coordinator and mark attendance + reward points
exports.updateEventAttendanceAndRewards = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { coordinatorId, attendees } = req.body;
    // attendees: [{ studentId, present, points, reason }]

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const club = await Club.findById(event.clubId);
    if (!club || club.facultyIncharge.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (coordinatorId) {
      event.studentCoordinator = coordinatorId;
      await Notification.create({
        userId: coordinatorId,
        message: `You have been assigned as Student Coordinator for event in ${club.name}`,
      });
    }

    if (Array.isArray(attendees) && attendees.length > 0) {
      event.attendance = attendees.map((a) => ({
        student: a.studentId,
        present: !!a.present,
      }));

      // Update reward points
      await Promise.all(
        attendees.map(async (a) => {
          if (a.points && a.points > 0) {
            const student = await User.findById(a.studentId);
            if (!student) return;

            student.rewardPoints += a.points;
            student.rewardHistory.push({
              event: event._id,
              points: a.points,
              reason: a.reason || "participation",
            });
            await student.save();

            await Notification.create({
              userId: student._id,
              message: `You received ${a.points} reward points for event in ${club.name}`,
            });
          }
        })
      );
    }

    await event.save();
    res.json(event);
  } catch (err) {
    next(err);
  }
};

