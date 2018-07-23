import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import model from '../models';

const { User } = model;

const Users = {
  create(req, res) {
    const { username, email, password } = req.body;
    User.create({ username, email, password })
      .then((createdUser) => {
        const { id, email: newEmail } = createdUser;
        const token = jwt.sign({ id, email: newEmail },
          process.env.SECRET,
          { expiresIn: '10h' });
        return res.send({ success: true, message: 'User Created Successfully', token });
      }).catch(() => res.status(500).send({ success: false, message: 'Unexpected error occured' }));
  },
  login(req, res) {
    const { username, password } = req.body;
    User.findOne({
      where: { username }
    }).then((user) => {
      const { id, email } = user;
      if (user) {
        bcrypt.compare(password, user.password).then((response) => {
          if (response) {
            const token = jwt.sign({ id, email }, process.env.SECRET, { expiresIn: '10h' });
            return res.send({
              success: true, message: 'Successfully logged in', token
            });
          }
          return res.status(403).send({ success: false, message: 'Invalid Username/Password' });
        });
      } else {
        return res.status(400).send({ success: false, message: 'User Not Registered, Kindly signup to proceed' });
      }
    }).catch(() => res.status(500).send({ success: false, message: 'Unexpected error occured' }));
  },

  updateUser(req, res) {
    User.findById(req.params.id).then((user) => {
      const { username, oldPassword, newPassword } = req.body;
      if (oldPassword && newPassword) {
        bcrypt.compare(oldPassword, user.password).then((err, response) => {
          if (response) {
            user.update({
              password: newPassword,
              username: username || user.username
            }).then((updatedUser) => {
              res.send({ success: true, message: 'Details Updated Successfully', updatedUser });
            });
          } else {
            res.status(400).send({ success: false, message: 'Incorrect Old Password' });
          }
        });
      } else if (username) {
        user.update({ username: username || user.username }).then((updatedUser) => {
          res.send({ success: true, message: 'Username Updated Successfully', updatedUser });
        });
      }
    }).catch(() => {
      res.status(500).send({ success: false, message: 'Unexpected error occured' });
    });
  },

};

export default Users;
