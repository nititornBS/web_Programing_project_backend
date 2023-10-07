const sql = require("./db");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs");
const expireTime = "2h";

const User = function (user) {
  this.name = user.name;
  this.username = user.username;
  this.password = user.password;
};
User.checkUsername = (username, result) => {
  sql.query(
    "SELECT * FROM `users` WHERE username = '" + username + "'",
    (err, res) => {
      if (err) {
        console.log("Error:" + err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("Found username :" + res[0]);
        result(null, res[0]);
        return;
      }
    }
  );
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("Qurey error : " + err);
      result(err, null);
      return;
    }
    const token = jwt.sign({ id: res.insertId }, scKey.secret, {
      expiresIn: expireTime,
    });
    result(null, { id: res.insertId, ...newUser, accessToken: token });
    console.log("Created user: ", {
      id: res.insertId,
      ...newUser,
      accessToken: token,
    });
  });
};

User.loginModel = (account, result) => {
  sql.query(
    "SELECT * FROM users WHERE  username=?",
    [account.username],
    (err, res) => {
      if (err) {
        console.log("err :" + err);
        return;
      }
      if (res.length) {
        const validPassword = bcrypt.compare(account.password, res[0].password);
        if (validPassword) {
          const token = jwt.sign({ id: res.insertId }, scKey.secret, {
            expiresIn: expireTime,
          });
          console.log("Login success. Token was generate Token: " + token);
          res[0].accessToken = token;
          result(null, res[0]);
          return;
        } else {
          console.log("Password not match");
          result({ kind: "invalid_pass" }, null);
          return;
        }
      }
      result({ kind: "not_found" }, null);
    }
  );
};



User.updateUser = (id, data, result) => {
  sql.query(
    "UPDATE users SET name=?,username = ? ,password = ?, WHERE id=?",
    [data.name, data.username, data.password, id],
    (err, res) => {
      if (err) {
        console.log("Error: " + err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, nall);
        return;
      }
      console.log("Update user: " + { id: id, ...data });
      result(null, { id: id, ...data });
      return;
    }
  );
};
User.removeUser = (id, result) => {
  removeOldImage(id);
  sql.query("DELETE FROM users WHERE  ID = ?", [id], (err, res) => {
    if (err) {
      console.log("Query : " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" });
      return;
    }
    console.log("Deleted user id : " + id);
    result(null, { id: id });
  });
};


User.getAllRecords = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("Query err: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};
module.exports = User;
