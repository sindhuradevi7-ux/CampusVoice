import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas / Local
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 CampusVoice Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔒 Privacy Model: Verified Anonymity Active`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
});
