import mongoose from 'mongoose';

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/campusvoice';

  try {
    const conn = await mongoose.connect(primaryUri || fallbackUri, {
      serverSelectionTimeoutMS: 6000,
    });
    console.log(`✅ MongoDB Connected successfully to: ${conn.connection.host}`);
    return conn;
  } catch (primaryError) {
    console.warn(`⚠️ Primary MongoDB connection failed: ${primaryError.message}`);
    
    // Attempt local fallback if primary was an external Atlas cluster
    if (primaryUri && primaryUri.includes('mongodb+srv') && fallbackUri) {
      console.log(`🔄 Attempting fallback connection to local MongoDB instance: ${fallbackUri}`);
      try {
        const fallbackConn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 4000,
        });
        console.log(`✅ Connected to local MongoDB fallback: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`❌ Local MongoDB fallback also failed: ${fallbackError.message}`);
      }
    }
  }
};

export default connectDB;

