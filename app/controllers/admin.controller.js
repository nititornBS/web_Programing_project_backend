const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");

const validUsername = (req, res) => {
  Admin.checkUsername(req.params.us, (err, data) => {
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

const createNewAdmin = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "content can not be empty." });
  }
  const salt = bcrypt.genSaltSync(10);
  const userObj = new Admin({
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
  });
  Admin.create(userObj, (err, data) => {
    if (err) {
      res
        .status(500)
        .send({ message: err.message || "Some error occured while creating" });
    } else res.send(data);
  });
};

const updateadminCtrl = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty." });
  }
  const data = {
    name: req.body.fullname,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
  };

  Admin.updateAdmin(req.params.id, data, (err, result) => {
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
const deletedUserAdmin = (req, res) => {
  Admin.removeAdmin(req.params.id, (err, result) => {
    if (err) {
      if (err.kind == "not_found") {
        res.status(401).send({ message: "Not found user: " + req.params.id });
      } else {
        res
          .status(500)
          .send({ messsage: "Error delete user: " + reqparams.id });
      }
    } else {
      res.send(result);
    }
  });
};
const getAllUsers = (req, res) => {
  Admin.getAllRecords((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};
const showAlluser = (req, res) => {
  Admin.getAlluser((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};

const getallroom = (req, res) => {
  console.log("you are in the controller");
  Admin.getAllRecordsroom((err, data) => {
    if (err) {
      res
        .status(500)
        .send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};
const getroomdetail = (req, res) => {
  console.log("you are in the controller");
  Admin.getRoomdetail((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};

const updateuserCtrl = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty." });
  }
  const salt = bcrypt.genSaltSync(10);
  const data = {
    name: req.body.fullname,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
  };

  Admin.updateUser(req.params.id, data, (err, result) => {
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

const login = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: " contant can not be empty" });
  }
  const acc = new Admin({
    username: req.body.username,
    password: req.body.password,
  });
  Admin.loginModel(acc, (err, data) => {
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

const AdminupdateRoom = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty." });
    return;
  }

  const data = {
    roomnumber: req.body.roomnumber,
    sizeid: req.body.sizeid,
    status: req.body.status,
  };

  Admin.updateroom(req.params.id, data, (err, result) => {
    if (err) {
      console.log(data);
      if (err.kind == "not_found") {
        res
          .status(404)
          .send({ message: "Not found room: " + req.params.sizeid });
      } else {
        res.status(500).send({
          message: "Error updating room: " + req.params.sizeid,
          error: "Error: " + err,
        });
      }
    } else {
      res.send(result);
    }
  });
};


const AdminupdateSizeRoom = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content cannot be empty." });
    return;
  }
  const data = {
    id: req.body.id,
    sizename: req.body.sizename,
    maxcapacity: req.body.maxcapacity,
    price: req.body.price,
  };

  Admin.updatesizeroom(data, (err, result) => {
    if (err) {
      console.log(data);
      if (err.kind == "not_found") {
        res.status(404).send({ message: "Not found size room: " + req.params.id });
      } else {
        res.status(500).send({
          message: "Error updating size room: " + req.params.id,
          error: "Error: " + err,
        });
      }
    } else {
      res.send(result);
    }
  });
};

const addRoom = (req, res) => {
  let newRoom; // Declare the variable here

  if (!req.body) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  // Initialize newRoom
  newRoom = {
    RoomNumber: req.body.RoomNumber,
    SizeID: req.body.SizeID,
    status: req.body.status,
  };

  console.log("New Room Number:", newRoom.RoomNumber);
  console.log("New Room SizeID:", newRoom.SizeID);

  Admin.createRoom(newRoom, (err, room) => {
    if (err) {
      console.error("Error adding room: " + err.message);
      return res.status(500).json({ message: "Error adding room" });
    } else {
      console.log("Added room:", room);
      return res.status(201).json(room);
    }
  });
};


const updateUserCtrl = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty." });
  }
  const salt = bcrypt.genSaltSync(10);
  const data = {
    id: req.body.id,
    name: req.body.name,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, salt),
  };

  Admin.updateUser(data, (err, result) => {
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

module.exports = {
  validUsername,
  updateuserCtrl,
  getAllUsers,
  deletedUserAdmin,
  updateadminCtrl,
  createNewAdmin,
  login,
  AdminupdateRoom,
  AdminupdateSizeRoom,
  addRoom,
  getallroom,
  updateUserCtrl,
  showAlluser,
  getroomdetail,

};
