require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 5000;
app.use("/api/pending-vote-payments", require("./routes/pendingVotePaymentRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});