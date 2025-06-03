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

app.use(express.json());

app.use('/users', userRoutes);

const PORT = 8000;  // Use a web server port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
