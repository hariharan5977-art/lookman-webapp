const serverless = require('serverless-http');
const app = require('../../app');
const { connectDB, isMongoConnected } = require('../../config/db');

const expressHandler = serverless(app);

function serviceUnavailable(message) {
  return {
    statusCode: 503,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: false, message })
  };
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const functionPrefix = '/.netlify/functions/api';
  const functionPath = event.path.replace(functionPrefix, '') || '/';
  const apiPath = `/api${functionPath === '/' ? '' : functionPath}`;

  const isAuthRequest = apiPath.startsWith('/api/auth/');
  if (isAuthRequest && !process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured for the Netlify function.');
    return serviceUnavailable('Authentication is not configured. Set JWT_SECRET in Netlify environment variables.');
  }

  try {
    if (!isMongoConnected()) {
      if (process.env.MONGODB_URI) {
        const connected = await connectDB({
          seedOnlyIfEmpty: true,
          waitForSeed: true
        });
        if ((!connected || !isMongoConnected()) && !isAuthRequest) {
          return serviceUnavailable('The API database is unavailable.');
        }
      } else if (!isAuthRequest) {
        console.error('MONGODB_URI is not configured for the Netlify function.');
        return serviceUnavailable('The API database has not been configured.');
      }

      if (!isMongoConnected() && !isAuthRequest) {
        return serviceUnavailable('The API database is unavailable.');
      }
    }

    return await expressHandler({ ...event, path: apiPath }, context);
  } catch (error) {
    console.error('Netlify API function failed:', error);
    return serviceUnavailable('The API is temporarily unavailable.');
  }
};
