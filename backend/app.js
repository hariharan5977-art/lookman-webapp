const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const solutionRoutes = require('./routes/solutionRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const lookmanAiRoutes = require('./routes/lookmanAiRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/lookman-ai', lookmanAiRoutes);

app.get('/api/health', (req, res) => {
  const { isMongoConnected } = require('./config/db');
  const mongoActive = isMongoConnected();
  res.json({
    status: 'online',
    service: 'Lookman Distribution Full-Stack API',
    database: {
      engine: mongoActive ? 'MongoDB Atlas' : 'Local JSON Database (Fallback)',
      mongoConnected: mongoActive
    },
    timestamp: new Date().toISOString()
  });
});

const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
