const sql = require("./db");
const jwt = require("jsonwebtoken");
const scKey = require("../config/jwt.config");
const bcrypt = require("bcryptjs");
const expireTime = "2h";

const Booking = function (booking) {
  this.RoomID = booking.RoomID;
  this.UserID = booking.UserID;
  this.BookingDate = booking.BookingDate;
  this.StartTime = booking.StartTime;
  this.EndTime = booking.EndTime;
  this.TotalHour = booking.TotalHour;
  this.TotalPrice = booking.TotalPrice;
};

Booking.newbooking = (newbooking, result) => {
  sql.query("INSERT INTO booking SET ?", newbooking, (err, res) => {
    if (err) {
      console.log("Qurey error : " + err);
      result(err, null);
      return;
    }

    result(null, {
      message: "booking sucessfuly",
      BookingID: res.insertId,
      ...newbooking,
    });
    console.log("add room: ", {
      ...newbooking,
    });
  });
};

Booking.getAlltime = (result) => {
  sql.query("SELECT * FROM timeperiod", (err, res) => {
    if (err) {
      console.log("Query err: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Booking.RoomTime = (room, result) => {
  sql.query(
    "SELECT StartTime,EndTime,TotalHour,TotalPrice FROM booking WHERE RoomID=? AND BookingDate = ? ",
    [room.RoomID, room.BookingDate],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};

Booking.getsumincome = (date, result) => {
  sql.query(
    "SELECT SUM(TotalPrice) AS TotalIncome FROM `booking`WHERE BookingDate = ?  ",
    [date.BookingDate],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      } else {
        console.log("return the total price for date: " + date.BookingDate);
        result(null, res);
      }
    }
  );
};
Booking.getoverview = (date, result) => {
  sql.query(
    "SELECT COUNT(DISTINCT UserID)AS NumberOFuser_today, SUM(TotalPrice) AS TotalIncome, SUM(TotalHour) AS TotalHour FROM `booking`WHERE BookingDate = ? GROUP BY BookingDate  ",
    [date.BookingDate],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      } else {
        console.log("return the total price for date: " + date.BookingDate);
        result(null, res);
      }
    }
  );
};

Booking.getUser = (date, result) => {
  sql.query(
    "SELECT COUNT(DISTINCT UserID)AS NumberOFuser_today FROM `booking`WHERE BookingDate = ? ",
    [date.BookingDate],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      } else {
        console.log("return the total income for date: " + date.BookingDate);
        result(null, res);
      }
    }
  );
};
Booking.getTotalHour = (date, result) => {
  sql.query(
    "SELECT SUM(TotalHour) AS TotalHour FROM `booking`WHERE BookingDate = ?",
    [date.BookingDate],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      } else {
        console.log("return the total hour for date: " + date.BookingDate);
        result(null, res);
      }
    }
  );
};

Booking.showroomdetail = (result) => {
  sql.query("SELECT * FROM `sizedetail` ", (err, res) => {
    if (err) {
      console.log("Query err: " + err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};
Booking.getAllbooked = (data,result) => {
  sql.query(
    "SELECT * FROM `booking` WHERE UserID = ?",
    [data.UserID],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};
Booking.getAbooked = (data,result) => {
  sql.query(
    "SELECT * FROM `booking` WHERE BookingID =?",
    [data.BookingID],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      }
      result(null, res);
    }
  );
};
module.exports = Booking;
