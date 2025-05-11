import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 1337,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  NODE_ENV: process.env.NODE_ENV,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  // SSL Commerz configuration
  ssl: {
    storeId: process.env.SSL_STORE_ID,
    storePass: process.env.SSL_STORE_PASSWORD,
    sslPaymentApi:
      process.env.NODE_ENV === 'production'
        ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
        : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
    sslValidationApi:
      process.env.NODE_ENV === 'production'
        ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
        : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php',
    successUrl: process.env.SSL_SUCCESS_URL,
    failUrl: process.env.SSL_FAIL_URL,
    cancelUrl: process.env.SSL_CANCEL_URL,
  },

  // Backend and Frontend URLs for redirects
  backend_url: process.env.BACKEND_URL || 'http://localhost:1337',
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export default config;
