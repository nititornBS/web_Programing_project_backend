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
    "SELECT * FROM users WHERE Username=?",
    [account.username],
    async (err, res) => {
      if (err) {
        console.log("err: " + err);
        return;
      }
      if (res.length) {

        const inputPassword = account.password;
        const storedPassword = res[0].Password;

        if (!inputPassword || !storedPassword) {
          console.log("Input or stored password is undefined.");
          result({ kind: "invalid_pass" }, null);
          return;
        }

        try {
          const validPassword = await bcrypt.compare(
            inputPassword,
            storedPassword
          );

          if (validPassword) {
            const token = jwt.sign({ id: res.insertId }, scKey.secret, {
              expiresIn: expireTime,
            });
            console.log("Login success. Token was generated: " + token);
            res[0].accessToken = token;
            result(null, res[0]);
            return;
          } else {
            console.log("Password does not match");
            result({ kind: "invalid_pass" }, null);
            return;
          }
        } catch (error) {
          console.log("Error comparing passwords: " + error);
          result({ kind: "compare_error" }, null);
          return;
        }
      } else {
        console.log("User not found");
        result({ kind: "not_found" }, null);
      }
    }
  );
};

User.updateUser = (id, data, result) => {
  sql.query(
    "UPDATE users SET Name = ?,Username = ? ,Password = ? WHERE UserID=?",
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

  sql.query("DELETE FROM users WHERE  UserID = ?", [id], (err, res) => {
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
    result(null, {"message":"successfully to delete user", id: id });
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
