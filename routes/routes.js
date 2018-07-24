import { Users, Todos } from '../controllers';
import middleware from '../middlewares';

const { authenticate, validateEmail, verifyOwner } = middleware;

export default (app) => {
  app.post('/users', validateEmail, Users.create);
  app.post('/users/login', Users.login);
  app.put('/users/:id', authenticate, verifyOwner, Users.updateUser);
  app.post('/todos', authenticate, Todos.create);
  app.get('/todos/:id', authenticate, Todos.getUserTodos);
  app.delete('/todos/:id', authenticate, Todos.deleteUserTodo);
};
