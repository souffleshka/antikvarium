const router = require("express").Router();
const multer = require("multer");

const Lot = require("../models/Lot");
const User = require("../models/User");
const Bid = require("../models/Bid");

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* CREATE LOT (Admin only) */
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      startPrice,
      endDate,
      creator,
    } = req.body;

    const imageUrl = req.file ? req.file.path : "";

    if (!imageUrl) {
      return res.status(400).send("No image uploaded.");
    }

    // Преобразуем дату в UTC для корректного сохранения
    const endDateUTC = new Date(endDate);
    
    const newLot = new Lot({
      title,
      description,
      startPrice,
      currentPrice: startPrice,
      endDate: endDateUTC,
      imageUrl,
      creator,
    });

    await newLot.save();
    res.status(200).json(newLot);
  } catch (err) {
    res
      .status(409)
      .json({ message: "Fail to create Lot", error: err.message });
    console.log(err);
  }
});

/* GET ALL LOTS */
router.get("/", async (req, res) => {
  try {
    const lots = await Lot.find().populate("creator").sort({ createdAt: -1 });
    res.status(200).json(lots);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Fail to fetch lots", error: err.message });
    console.log(err);
  }
});

/* DELETE LOT (Admin only) */
router.delete("/:lotId", async (req, res) => {
  try {
    const { lotId } = req.params;
    await Lot.findByIdAndDelete(lotId);
    res.status(200).json({ message: "Lot deleted successfully" });
  } catch (err) {
    res
      .status(404)
      .json({ message: "Fail to delete lot", error: err.message });
  }
});

/* END AUCTION AND DETERMINE WINNER */
router.post("/:lotId/end", async (req, res) => {
  try {
    const { lotId } = req.params;
    
    // Find the lot
    const lot = await Lot.findById(lotId);
    if (!lot) {
      return res.status(404).json({ message: "Lot not found" });
    }

    if (lot.status !== "active") {
      return res.status(400).json({ message: "Lot is not active" });
    }

    // Find the highest bid
    const highestBid = await Bid.findOne({ lotId })
      .populate("userId", "username")
      .sort({ amount: -1 });

    if (highestBid) {
      // Update lot with winner and mark as sold
      await Lot.findByIdAndUpdate(lotId, {
        status: "sold",
        winnerId: highestBid.userId._id,
        currentPrice: highestBid.amount
      });

      res.status(200).json({
        message: "Auction ended successfully",
        winner: {
          username: highestBid.userId.username,
          amount: highestBid.amount
        },
        lot: {
          title: lot.title,
          _id: lot._id
        }
      });
    } else {
      // No bids, mark as cancelled
      await Lot.findByIdAndUpdate(lotId, {
        status: "cancelled"
      });

      res.status(200).json({
        message: "Auction ended with no bids",
        lot: {
          title: lot.title,
          _id: lot._id
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to end auction", error: err.message });
  }
});

/* GET LOT DETAILS WITH WINNER INFO */
router.get("/:lotId", async (req, res) => {
  try {
    const { lotId } = req.params;
    const lot = await Lot.findById(lotId)
      .populate("creator")
      .populate("winnerId", "username");
    res.status(200).json(lot);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Lot not found!", error: err.message });
  }
});

module.exports = router;
