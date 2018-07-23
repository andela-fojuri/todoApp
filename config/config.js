import dotenv from 'dotenv';

dotenv.config();
module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
    operatorsAliases: false,
  },
};
