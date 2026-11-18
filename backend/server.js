const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().catch(err => {
  console.warn('Initial MongoDB connect notice:', err.message);
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Lookman Backend Server running on http://0.0.0.0:${PORT}`);
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. The backend service is already running on http://localhost:${PORT}`);
  } else {
    console.error('Server error:', err);
  }
});
