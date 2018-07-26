import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import model from '../models';

const { User } = model;

const Users = {
  create(req, res) {
    const { username, email, password } = req.body;
    User.findOrCreate({
      where: {
        [Op.or]: [
          { username },
          { email },
        ]
      },
      defaults: { username, email, password }
    })
      .spread((user, created) => {
        if (created) {
          const { id, email: newEmail } = user;
          const token = jwt.sign({ id, email: newEmail },
            process.env.SECRET,
            { expiresIn: '10h' });
          return res.send({ success: true, message: 'User Created Successfully', token });
        }
        return res.status(409).send({ success: false, message: 'User already exists' });
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
    const {
      username,
      oldPassword,
      newPassword,
      email
    } = req.body;
    User.findById(req.params.id).then((user) => {
      if (oldPassword && newPassword) {
        bcrypt.compare(oldPassword, user.password).then((err, response) => {
          if (response) {
            user.update({
              password: newPassword
            }).then((updatedUser) => {
              res.send({ success: true, message: 'Password Updated Successfully', updatedUser });
            });
          } else {
            res.status(400).send({ success: false, message: 'Incorrect Old Password' });
          }
        });
      } else if (username || email) {
        User.findOne({
          where: {
            [Op.or]: [
              { username },
              { email },
            ]
          }
        }).then((foundUser) => {
          if (!foundUser) {
            user.update({
              username: username || user.username,
              email: email || user.email
            }).then((updatedUser) => {
              res.send({ success: true, message: 'Details Updated Successfully', updatedUser });
            });
          } else {
            return res.status(409).send({ success: false, message: 'User already exists' });
          }
        });
      }
    }).catch(() => {
      res.status(500).send({ success: false, message: 'Unexpected error occured' });
    });
  },

};

export default Users;
