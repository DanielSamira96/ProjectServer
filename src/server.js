const express = require("express");
const cors = require("cors");
const { getFilteredTickets } = require('./service');
const { validationResult, query } = require("express-validator");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get(
  "/tickets",
  query("searchTerm", "searchTerm must not be empty").optional().notEmpty(),
  // I assumed that the desired behavior is to send ISO date string instead of timestamp, so I check the date regardless the time
  query(["from", "to"], "date must be in a date format").optional().isDate().toDate(),
  query("from", "from date must be before to date").optional().custom((from, { req }) => !req.query.to || from <= req.query.to),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tickets = getFilteredTickets(req.query);

    res.send(tickets);
  }
);

app.listen(port, () =>
  console.log(`Tickets express application listening on port ${port}!`)
);

module.exports = app; // for testing
