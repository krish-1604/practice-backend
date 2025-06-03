const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({origin: 'https://main.d3zzjjalhmqmq.amplifyapp.com'}));

const userRoutes = require('./routes/users');

app.use(express.json());

app.use('/users', userRoutes);

const PORT = 8000;  // Use a web server port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
