const express = require("express");

const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/balance", auth, async (req, res) => {
  const user = await User.findById(req.userId);

  res.json({
    balance: user.balance,
  });
});

router.post("/deposit", auth, async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.userId);

  user.balance += Number(amount);

  await user.save();

  res.json({
    balance: user.balance,
  });
});

router.post("/withdraw", auth, async (req, res) => {
  const { amount } = req.body;

  const user = await User.findById(req.userId);

  if (user.balance < amount) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  user.balance -= Number(amount);

  await user.save();

  res.json({
    balance: user.balance,
  });
});

module.exports = router;