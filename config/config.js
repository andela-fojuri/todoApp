export default {
  development: {
    use_env_variable: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
};
