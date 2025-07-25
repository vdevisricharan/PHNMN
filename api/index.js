const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')

const stripe = require('stripe')(process.env.STRIPE_KEY);
const connectDB = require("./db/connection");
const favicon = require('serve-favicon');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.raw({ type: 'application/json' })); // for Stripe webhook
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

dotenv.config();
connectDB(); // Connect to MongoDB before starting the server

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// API Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/products', require('./routes/product'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/payments', require('./routes/payment'));
app.use('/api/webhook', require('./routes/webhook'));

app.get("/", (req, res) => {
  res.status(200).json({ message: "PHNMN API is running." });
});


const PORT = process.env.PORT || 5000;
let server;
server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});