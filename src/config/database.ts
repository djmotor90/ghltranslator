import mongoose from 'mongoose';
import { config } from './env.js';
import logger from '../utils/logger.js';

export async function connectDatabase() {
  try {
    await mongoose.connect(config.mongodb.uri, {
      dbName: config.mongodb.name,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    logger.info('Database connected successfully');
    return mongoose.connection;
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Database disconnection error:', error);
    throw error;
  }
}

export default mongoose;
