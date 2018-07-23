import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import model from '../models';

const { User } = model;

const Users = {
  create(req, res) {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }).then((createdUser) => {
      const token = jwt.sign({
        id: createdUser.id,
        email: createdUser.email,
      },
      process.env.SECRET,
      { expiresIn: '10h' });
      res.send({ success: true, message: 'User Created Successfully', token });
    }).catch(() => {
      res.status(500).send({ success: false, message: 'Unexpected error occured' });
    });
  },
  login(req, res) {
    User.findOne({
      where: { username: req.body.username }
    }).then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password).then((response) => {
          if (response) {
            const token = jwt.sign({
              id: user.id,
              email: user.email,
            }, process.env.SECRET, { expiresIn: '10h' });
            res.send({
              success: true, message: 'Successfully logged in', token
            });
          } else {
            res.send({ success: false, message: 'Invalid Username/Password' });
          }
        });
      } else {
        res.status(200).send({ success: false, message: 'User Not Registered, Kindly signup to proceed' });
      }
    }).catch(() => {
      res.status(500).send({ success: false, message: 'Unexpected error occured' });
    });
  },
};

export default Users;
