import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import equipmentRoutes from './src/routes/equipment.js';
import cartRoutes from './src/routes/cart.js';
import orderRoutes from './src/routes/orders.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Database
await connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/agri_equip_marketplace'
  })
};
app.use(session(sessionConfig));

// Flash-like helper via session
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;
  delete req.session.success;
  delete req.session.error;
  next();
});

// Home route
import Equipment from './src/models/Equipment.js';
import { formatCurrency } from './src/utils/formatCurrency.js';
app.get('/', async (req, res) => {
  const latest = await Equipment.find().sort({ createdAt: -1 }).limit(8).lean();
  res.render('index', { title: 'AgriEquip Marketplace', latest, formatCurrency });
});

// Routes
app.use('/auth', authRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
