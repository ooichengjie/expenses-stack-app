const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Expense = require("../models/Expense");

router.post("/:id",[auth,[check("amount", "Please enter an amount").not().isEmpty(),check("category", "Please select a category").not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { amount, description, category, date } = req.body;
        try {
            const newExpense = new Expense({
                amount,
                description,
                category,
                date,
                user: req.user.id
            });
            const expense = await newExpense.save();
            res.json(expense);
          } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;