import model from '../models';

const { Todo, User } = model;

const Todos = {
  create(req, res) {
    const { title } = req.body;
    Todo.findOrCreate({
      where: { title },
      defaults: {
        title,
        userId: req.decoded.id
      }
    }).spread((todo, created) => {
      if (created) {
        const createdTodo = todo.get({ plain: true });
        const response = { ...createdTodo, success: true, message: 'Todo Added' };
        return res.send(response);
      }
      return res.status(409).send({ success: false, message: 'Todo already exists' });
    }).catch(() => {
      res.status(500).send({ success: false, message: 'Unexpected error occured' });
    });
  },

  updateTodo(req, res) {
    const { id } = req.params;
    const { title, completed } = req.body;
    Todo.findById(id).then((todo) => {
      if (title) {
        Todo.findOne({ where: { title } }).then((foundTodo) => {
          if (!foundTodo) {
            todo.update({ title })
              .then((updatedTodo) => {
                res.send({ success: true, message: 'Title Updated Successfully', updatedTodo });
              });
          } else {
            return res.status(409).send({ success: false, message: 'Todo already exists' });
          }
        });
      } else if (completed) {
        todo.update({ completed })
          .then((updatedTodo) => {
            res.send({ success: true, message: 'Status Updated Successfully', updatedTodo });
          });
      }
    });
  },

  getUserTodos(req, res) {
    User.find({ where: { id: req.params.id } }).then((user) => {
      Todo.findAll({ where: { userId: user.id } }).then(todo => res.send(todo))
        .catch(() => {
          res.status(500).send({ success: false, message: 'Unexpected error occured' });
        });
    });
  },

  deleteUserTodo(req, res) {
    Todo.findById(req.params.id).then((todo) => {
      todo.destroy().then(() => res.send({ success: true, message: 'Todo deleted Successfully' }));
    }).catch(() => {
      res.status(500).send({ success: false, message: 'Unexpected error occured' });
    });
  }

};

export default Todos;
