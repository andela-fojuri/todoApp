import Users from '../controllers';
import middleware from '../middlewares';

export default (app) => {
  app.post('/users', middleware.validateEmail, Users.create);
  app.post('/users/login', Users.login);
};
