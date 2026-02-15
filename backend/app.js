const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth/auth.routes')
const categoryRoutes = require('./routes/category/category.routes')
const threadRoutes = require('./routes/threads/threads.routes');
const profileRoutes = require('./routes/users/users.routes');

app.use('/api/auth', authRoutes);

app.use('/api/', categoryRoutes);
app.use('/api/', threadRoutes);
app.use('/api/', profileRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
