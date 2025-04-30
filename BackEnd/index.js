const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173', // Hanya menerima request dari domain ini
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Hanya mengizinkan method tertentu
};

app.use(cors(corsOptions));

app.get('/cobaCORS', (req, res) => {
    res.send('CORS configuration is working!');
});

app.use('/item', require('./src/routes/item.route'));
app.use('/store', require('./src/routes/store.route'));
app.use('/user', require('./src/routes/user.route'));
app.use('/transaction', require('./src/routes/transaction.route'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});