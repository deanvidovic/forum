const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth/auth.routes')
const userRoutes = require('./routes/users/users.routes');

app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
