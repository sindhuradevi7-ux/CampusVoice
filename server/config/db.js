import mongoose from 'mongoose';

let isConnecting = false;


const VERIFIED_ATLAS_URI =
  'mongodb+srv://sindhuradevi7_db_user:CvbYI6yaEMe8B6xK@cluster0.4wyjjlw.mongodb.net/campusvoice?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) return;
  isConnecting = true;

  let primaryUri = process.env.MONGODB_URI;

  // Auto-resolve missing or incomplete URI (without hash) directly to verified Atlas cluster
  if (!primaryUri || primaryUri.includes('@cluster0.mongodb.net')) {
    primaryUri = VERIFIED_ATLAS_URI;
  }

  const fallbackUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/campusvoice';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 12000,
    });
    console.log(`✅ MongoDB Connected successfully to: ${conn.connection.host}`);
    isConnecting = false;
    return conn;
  } catch (primaryError) {
    console.warn(`⚠️ Primary MongoDB connection failed: ${primaryError.message}`);

    // Attempt local fallback if available
    if (fallbackUri && !primaryUri.includes('127.0.0.1')) {
      console.log(`🔄 Attempting fallback connection to local MongoDB instance: ${fallbackUri}`);
      try {
        const fallbackConn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 4000,
        });
        console.log(`✅ Connected to local MongoDB fallback: ${fallbackConn.connection.host}`);
        isConnecting = false;
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`❌ Local MongoDB fallback failed: ${fallbackError.message}`);
      }
    }
    isConnecting = false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting reconnection...');
  setTimeout(() => {
    connectDB();
  }, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
});

export default connectDB;

