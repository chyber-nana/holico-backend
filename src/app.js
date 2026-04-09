const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");


const categoryRoutes = require('./routes/categoryRoutes');
const nomineeRoutes = require('./routes/nomineeRoutes');
const voteRoutes = require('./routes/votesRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get('/', (req, res) => {
  res.send('Voting API is running');
});

app.use('/api/categories', categoryRoutes);
app.use('/api/nominees', nomineeRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/portal", require("./routes/systemFlagRoutes"));

app.use(errorMiddleware);

module.exports = app;