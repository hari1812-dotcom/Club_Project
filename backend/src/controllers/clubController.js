const Club = require("../models/Club");
const Event = require("../models/Event");

// Public / student: list clubs (optionally by category)
exports.getClubs = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) {
      query.category = category;
    }

    const clubs = await Club.find(query)
      .populate("facultyIncharge", "name email department phone")
      .lean();

    res.json(clubs);
  } catch (err) {
    next(err);
  }
};

// Detailed view with upcoming approved events
exports.getClubById = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("facultyIncharge", "name email department phone")
      .populate("members", "name email")
      .lean();

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    const upcomingEvents = await Event.find({
      clubId: club._id,
      status: "Approved",
      date: { $gte: new Date() },
    }).sort({ date: 1 });

    res.json({
      ...club,
      memberCount: club.members ? club.members.length : 0,
      upcomingEvents,
    });
  } catch (err) {
    next(err);
  }
};

// Admin: create club
exports.createClub = async (req, res, next) => {
  try {
    const { name, category, description, equipment, facultyIncharge, maxCapacity } =
      req.body;

    const existing = await Club.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Club with this name already exists" });
    }

    const club = await Club.create({
      name,
      category,
      description,
      equipment: equipment || [],
      facultyIncharge,
      maxCapacity: maxCapacity || 100,
    });

    res.status(201).json(club);
  } catch (err) {
    next(err);
  }
};

// Faculty: clubs they manage
exports.getMyClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find({ facultyIncharge: req.user.id }).lean();
    res.json(clubs);
  } catch (err) {
    next(err);
  }
};

// Student: clubs they belong to
exports.getStudentClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find({ members: req.user.id }).lean();
    res.json(clubs);
  } catch (err) {
    next(err);
  }
};

