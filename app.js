const express = require('express');
const app = express();
const cors = require('cors');
const allowedOrigins = [
  'https://main.d3zzjjalhmqmq.amplifyapp.com',
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

const userRoutes = require('./routes/users');
// const igRoutes = require('./routes/ig');

app.use(express.json());

app.use('/users', userRoutes);
// app.use('/ig', igRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
