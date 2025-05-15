
import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';


import adminRoutes from "./src/routes/adminRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import publicRoutes from "./src/routes/publicRoutes.js";

dotenv.config()
const app = express();
const port = process.env.PORT
app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(helmet());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})