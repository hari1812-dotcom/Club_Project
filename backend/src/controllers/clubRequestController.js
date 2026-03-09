const Club = require("../models/Club");
const ClubRequest = require("../models/ClubRequest");
const Notification = require("../models/Notification");

// Student: request to join a club
exports.requestToJoin = async (req, res, next) => {
  try {
    const { clubId, reason, phone, year, regNo } = req.body;

    if (!clubId) {
      return res.status(400).json({ message: "clubId is required" });
    }

    const club = await Club.findById(clubId).populate("facultyIncharge");
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    if (club.members.some((m) => m.toString() === req.user.id.toString())) {
      return res.status(400).json({ message: "You are already a member of this club" });
    }

    const existingReq = await ClubRequest.findOne({
      studentId: req.user.id,
      clubId,
    });

    if (existingReq && existingReq.status !== "Rejected") {
      return res.status(400).json({ message: "You already have a request for this club" });
    }

    const request =
      existingReq && existingReq.status === "Rejected"
        ? await ClubRequest.findByIdAndUpdate(
            existingReq._id,
            { status: "Pending", reason, phone, year, regNo },
            { new: true }
          )
        : await ClubRequest.create({
            studentId: req.user.id,
            clubId,
            reason,
            phone,
            year,
            regNo,
          });

    if (club.facultyIncharge) {
      await Notification.create({
        userId: club.facultyIncharge._id,
        message: `New join request for ${club.name} from a student`,
      });
    }

    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

// Student: my requests
exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await ClubRequest.find({ studentId: req.user.id })
      .populate("clubId", "name category")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

// Faculty: requests for clubs they manage
exports.getRequestsForMyClubs = async (req, res, next) => {
  try {
    const myClubs = await Club.find({ facultyIncharge: req.user.id }).select("_id");
    const clubIds = myClubs.map((c) => c._id);

    const requests = await ClubRequest.find({ clubId: { $in: clubIds } })
      .populate("studentId", "name email")
      .populate("clubId", "name")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    next(err);
  }
};

// Faculty: approve / reject
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const requestId = req.params.id;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await ClubRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const club = await Club.findById(request.clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // ✅ Fixed: compare both as strings
    if (club.facultyIncharge.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not your club" });
    }

    if (status === "Approved") {
      const currentMembers = club.members.length;
      if (currentMembers >= club.maxCapacity) {
        return res.status(400).json({ message: "Member capacity reached for this club" });
      }

      if (!club.members.some((m) => m.toString() === request.studentId.toString())) {
        club.members.push(request.studentId);
        await club.save();
      }
    }

    request.status = status;
    request.reason = reason;
    await request.save();

    // Notify student
    await Notification.create({
      userId: request.studentId,
      message:
        status === "Approved"
          ? `Your request to join ${club.name} has been approved`
          : `Your request to join ${club.name} has been rejected${reason ? `: ${reason}` : ""}`,
    });

    res.json(request);
  } catch (err) {
    next(err);
  }
};