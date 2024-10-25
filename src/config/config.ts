import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

export const config = {
  app: {
    port: process.env.AUDIT_PORT ? parseInt(process.env.AUDIT_PORT, 10) : 8030, // Default to 8030 if not set
  },
  database: {
    uri: process.env.AUDIT_DATABASE_URI || 'mongodb://139.59.152.170:27017/audit-logs' || 'mongodb://localhost:27017/audit-logs',
    // No need for useNewUrlParser and useUnifiedTopology in Mongoose v6+
    options: {},
  },
};
