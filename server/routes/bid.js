const router = require("express").Router();

const Bid = require("../models/Bid");
const Lot = require("../models/Lot");

/* CREATE OR UPDATE BID */
router.post("/create", async (req, res) => {
  try {
    const { lotId, userId, amount } = req.body;
    console.log("Creating bid:", { lotId, userId, amount });

    // Check if lot exists and is still active
    const lot = await Lot.findById(lotId);
    if (!lot) {
      return res.status(404).json({ message: "Lot not found" });
    }

    if (lot.status !== "active") {
      return res.status(400).json({ message: "Lot is no longer active" });
    }

    if (new Date() > lot.endDate) {
      return res.status(400).json({ message: "Auction has ended" });
    }

    // Check if bid is higher than current price
    if (amount <= lot.currentPrice) {
      return res.status(400).json({ 
        message: "Bid must be higher than current price" 
      });
    }

    // Check if user already has a bid for this lot
    const existingBid = await Bid.findOne({ lotId, userId });
    console.log("Existing bid found:", existingBid);

    let bid;
    if (existingBid) {
      // Update existing bid
      bid = await Bid.findByIdAndUpdate(
        existingBid._id,
        { amount },
        { new: true }
      );
      console.log("Updated bid:", bid);
    } else {
      // Create new bid
      bid = new Bid({
        lotId,
        userId,
        amount,
      });
      await bid.save();
      console.log("Created new bid:", bid);
    }

    // Update lot's current price
    await Lot.findByIdAndUpdate(lotId, { currentPrice: amount });
    console.log("Updated lot current price to:", amount);

    res.status(200).json(bid);
  } catch (err) {
    console.log("Error creating bid:", err);
    res
      .status(400)
      .json({ message: "Fail to create bid!", error: err.message });
  }
});

/* GET BIDS FOR LOT (Top 10 - only best bid per user) */
router.get("/lot/:lotId", async (req, res) => {
  try {
    const { lotId } = req.params;
    console.log("Fetching bids for lot:", lotId);
    
    // Получаем все ставки для лота
    const allBids = await Bid.find({ lotId })
      .populate("userId", "username")
      .sort({ amount: -1 });
    
    console.log("All bids found:", allBids.length);
    console.log("All bids:", allBids);
    
    // Фильтруем ставки с валидными пользователями
    const validBids = allBids.filter(bid => bid.userId && bid.userId._id);
    console.log("Valid bids:", validBids.length);
    
    // Группируем по пользователям и берем только лучшую ставку каждого
    const userBestBids = {};
    validBids.forEach(bid => {
      const userId = bid.userId._id.toString();
      if (!userBestBids[userId] || bid.amount > userBestBids[userId].amount) {
        userBestBids[userId] = bid;
      }
    });
    
    // Преобразуем в массив и сортируем по сумме
    const topBids = Object.values(userBestBids)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
    
    console.log("Top bids to return:", topBids);
    res.status(200).json(topBids);
  } catch (err) {
    console.log("Error fetching bids:", err);
    res
      .status(404)
      .json({ message: "Fail to fetch bids", error: err.message });
  }
});

/* GET USER BIDS (only latest bid per lot) */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all bids for user
    const allBids = await Bid.find({ userId })
      .populate("lotId", "title imageUrl")
      .sort({ createdAt: -1 });
    
    // Group by lot and keep only the latest bid for each lot
    const lotBids = {};
    allBids.forEach(bid => {
      const lotId = bid.lotId._id.toString();
      if (!lotBids[lotId] || bid.createdAt > lotBids[lotId].createdAt) {
        lotBids[lotId] = bid;
      }
    });
    
    // Convert to array and sort by creation date
    const userBids = Object.values(lotBids)
      .sort((a, b) => b.createdAt - a.createdAt);
    
    res.status(200).json(userBids);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Fail to fetch user bids", error: err.message });
  }
});

/* GET USER BID FOR SPECIFIC LOT */
router.get("/user/:userId/lot/:lotId", async (req, res) => {
  try {
    const { userId, lotId } = req.params;
    
    const userBid = await Bid.findOne({ userId, lotId })
      .populate("lotId", "title currentPrice");
    
    res.status(200).json(userBid);
  } catch (err) {
    res
      .status(404)
      .json({ message: "Fail to fetch user bid", error: err.message });
  }
});

/* DELETE USER BID */
router.delete("/user/:userId/lot/:lotId", async (req, res) => {
  try {
    const { userId, lotId } = req.params;
    
    // Check if lot exists and is still active
    const lot = await Lot.findById(lotId);
    if (!lot) {
      return res.status(404).json({ message: "Lot not found" });
    }

    if (lot.status !== "active") {
      return res.status(400).json({ message: "Cannot delete bid for inactive lot" });
    }

    if (new Date() > lot.endDate) {
      return res.status(400).json({ message: "Cannot delete bid after auction end" });
    }

    // Find and delete the user's bid
    const deletedBid = await Bid.findOneAndDelete({ userId, lotId });
    
    if (!deletedBid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // If this was the highest bid, update lot's current price
    const highestBid = await Bid.findOne({ lotId })
      .sort({ amount: -1 });
    
    if (highestBid) {
      await Lot.findByIdAndUpdate(lotId, { currentPrice: highestBid.amount });
    } else {
      // No bids left, reset to start price
      await Lot.findByIdAndUpdate(lotId, { currentPrice: lot.startPrice });
    }

    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (err) {
    console.log("Error deleting bid:", err);
    res
      .status(500)
      .json({ message: "Fail to delete bid", error: err.message });
  }
});

module.exports = router;
