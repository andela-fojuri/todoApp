import validator from 'validator';
import jwt from 'jsonwebtoken';

export default {
  validateEmail: (req, res, next) => {
    if (!validator.isEmail(req.body.email)) {
      return res.status(400).send({ success: false, message: 'Invalid Email' });
    }
    next();
  },
  authenticate: (req, res, next) => {
    const token = req.headers.authorization || req.headers['x-access-token'];
    // decode token
    if (token) {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
        }
        req.decoded = decoded;
        next();
      });
    } else {
      return res.status(403).send({
        success: false,
        message: 'User not authenticated'
      });
    }
  },
  verifyOwner: (req, res, next) => {
    const { id } = req.params;
    const { id: userId } = req.decoded;
    if (Number(id) === userId) {
      next();
    } else {
      res.status(400).send({
        success: false,
        message: 'Not authenticated as owner'
      });
    }
  }
};
