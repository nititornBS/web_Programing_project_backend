const sql = require("./db");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs");
const expireTime = "2h";

const Admin = function (admin) {
    this.name = admin.name;
    this.surname = admin.surname;
  this.username = admin.username;
  this.password = admin.password;
};

Admin.checkUsername = (username, result) => {
  sql.query(
    "SELECT * FROM `admins` WHERE username = '" + username + "'",
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

Admin.create = (newUser, result) => {
  sql.query("INSERT INTO admins SET ?", newUser, (err, res) => {
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

Admin.loginModel = (account, result) => {
  sql.query(
    "SELECT * FROM admins WHERE Username=?",
    [account.username],
    async (err, res) => {
      if (err) {
        console.log("err: " + err);
        return;
      }
      if (res.length) {
        console.log("Input Password: " + account.password);
        console.log("Stored Password: " + res[0].Password);

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

Admin.updateAdmin = (id, data, result) => {
  sql.query(
    "UPDATE admins SET name=?,username = ? ,password = ?, WHERE AdminID=?",
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

Admin.updateuser = (id, data, result) => {
  sql.query(
    "UPDATE users SET name=?,username = ? ,password = ?, WHERE UserpasswordID=?",
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

Admin.updateroom = (id,dataRoom, result) => {
  sql.query(
    "UPDATE room SET RoomNumber=?, SizeID=?, status = ? WHERE RoomID=?",
    [dataRoom.roomnumber, dataRoom.sizeid, dataRoom.status, id],
    (err, res) => {
      if (err) {
        console.log("Error: " + err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("Update room: " + { ...dataRoom });
      result(null, { message: "success", room: dataRoom });
      return;
    }
  );
};

Admin.updatesizeroom = (dataSizeRoom, result) => {
  sql.query(
    "UPDATE sizedetail SET SizeName=?,MaxCapacity = ? WHERE SizeID =?",
    [dataSizeRoom.sizename, dataSizeRoom.maxcapacity, dataSizeRoom.price, dataSizeRoom.id],
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
      console.log("Update size roomdetail: " + { ...dataSizeRoom });
      result(null, { "update":"finished" });
      return;
    }
  );
};

Admin.removeAdmin = (id, result) => {
  sql.query("DELETE FROM admins WHERE  AdminID = ?", [id], (err, res) => {
    if (err) {
      console.log("Query : " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" });
      return;
    }
    console.log("Deleted admin id : " + id);
    result(null, { id: id });
  });
};

Admin.removeUser = (id, result) => {
 
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
    result(null, { id: id });
  });
};

Admin.removeRoom = (roomNumber, result) => {
  
  sql.query("DELETE FROM Room WHERE  RoomNumber  = ?", [roomNumber], (err, res) => {
    if (err) {
      console.log("Query : " + err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" });
      return;
    }
    console.log("Deleted roomNumber : " + roomNumber);
    result(null, { roomNumber: roomNumber });
  });
};

Admin.getAllRecordsroom = (result) => {
  console.log("you are in the adminmodel");
  sql.query("SELECT * FROM `room`", (err, res) => {
    if (err) {
      console.log("Query err: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Admin.getAllRecords = (result) => {
  sql.query("SELECT * FROM admins", (err, res) => {
    if (err) {
      console.log("Query err: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};
Admin.getAlluser = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("Query err: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};
Admin.getRoomdetail = (result) => {
  sql.query("SELECT * FROM sizedetail", (err, res) => {
    if (err) {
      console.log("Query err: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Admin.createRoom = (newRoom, result) => {
  sql.query("INSERT INTO room SET ?", newRoom, (err, res) => {
    if (err) {
      console.log("Error inserting room: " + err);
      result(err, null);
      return;
    }
    console.log("Created room: ", { id: res.insertId, ...newRoom });
    result(null, { id: res.insertId, ...newRoom });
  });
};

Admin.updateUser = ( data, result) => {
  sql.query(
    "UPDATE users SET Name = ?,Username = ? ,Password = ? WHERE UserID=?",
    [data.name, data.username, data.password, data.id],
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
      console.log("Update user: " + { ...data });
      result(null, { ...data });
      return;
    }
  );
};
module.exports = Admin;
