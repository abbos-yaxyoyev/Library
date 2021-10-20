const jwt = require('jsonwebtoken')
const config = require('config');

//*************************************************** *//

function checkUser(req, res, next) {
  const { authorization } = req.headers;
  if (authorization && authorization.split(" ")[0] === 'Bearer') {
    token = authorization.split(" ")[1];
    if (!token) {
      res.status(401).send({ message: 'Error token not found' });
    }
    let decoded = jwt.verify(token, config.get('SECRET_KEY'))
    req.user = decoded
    next();
  } else {
    res.status(401).send({ message: 'Unauthorization' })
  }
}

//*************************************************** *//

const checkPermission = (role) => {
  return async (req, res, next) => {
    try {
      console.log(role);
      if (role.includes(req.user.role)) {
        next()
      } else {
        res.status(403).send({
          message: "You don't have permission"
        })
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "You don't have permission"
      })
    }
  }
}

//*************************************************** *//

function checkToken(req, res, next) {
  const { authorization } = req.headers;
  if (authorization && authorization.split(" ")[0] === 'Bearer') {
    token = authorization.split(" ")[1];
    let decoded = jwt.verify(token, config.get('SECRET_KEY'));
    if (decoded) {
      return res.status(201).send({ message: true });
    }
    return res.status(401).send({ message: false })
  } else {
    return res.status(401).send({ message: false })
  }
}

//*************************************************** *//

module.exports = {
  checkUser,
  checkPermission,
  checkToken
}