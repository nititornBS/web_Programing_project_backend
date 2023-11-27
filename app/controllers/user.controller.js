const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const validUsername = (req, res) => {
  // req = username
  User.checkUsername(req.params.us, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res.send({ message: "Not Found" + req.params, valid: true });
      } else {
        res.this
          .status(500)
          .send({ message: "Error query : " + req.params.us });
      }
    } else {
      res.send({ record: data, valid: false });
    }
  });
};


const createNewuser = (req, res) => {

  if (!req.body) {
    res.status(400).send({ message: "content can not be empty." });
  }
  const salt = bcrypt.genSaltSync(10);
  const userObj = new User({
    name: req.body.name,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
  });
  User.create(userObj, (err, data) => {
    if (err) {
      res
        .status(500)
        .send({ message: err.message || "Some error occured while creating" });
    } else res.send(data);
  });
};



const login = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: " contant can not be empty" });
  }
  const acc = new User({
    username: req.body.username,
    password: req.body.password,
  });
  console.log(req.body)
  User.loginModel(acc, (err, data) => {
    if (err) {
      if (err.kind == "not_found") {
        res
          .status(401)
          .send({ message: "Not found user: " + req.body.username });
      } else if (err.kind == "invalid_pass") {
        res.status(401).send({
          message: "Invalid password",
        });
      } else {
        res.status(500).send({
          message: "Query error: " + err,
        });
      }
    } else res.send(data);
  });
};

const updateUserCtrl = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty." });
  }
  const salt = bcrypt.genSaltSync(10);
  const data = {
    name: req.body.name,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
  };

  User.updateUser(req.params.id, data, (err, result) => {
    if (err) {
      console.log(data);
      if (err.kind == "not_found") {
        res.status(401).send({ message: "not found user: " + req.params.id });
      } else {
        res.status(500).send({
          message: "Error update user: " + req.params.id,
          error: "error " + err,
        });
      }
    } else {
      res.send(result);
    }
  });
};
const deletedUser = (req, res) => {
  User.removeUser(req.params.id, (err, result) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(401).send({ message: "Not found user: " + req.params.id });
      } else {
        res
          .status(500)
          .send({ messsage: "Error delete user: " + req.params.id });
      }
    } else {
      res.send(result);
    }
  });
};
const getAllUsers = (req, res) => {
  User.getAllRecords((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};

module.exports = {
  validUsername,
  createNewuser,
  login,
  updateUserCtrl,
  deletedUser,
  getAllUsers,
};
