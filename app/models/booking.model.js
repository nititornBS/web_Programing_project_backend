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
Booking.gettimefulls = (room, result) => {
  sql.query(
    "SELECT RoomID, SUM(TotalHour) AS SUM_TotalHour FROM booking WHERE BookingDate = ? GROUP BY RoomID HAVING SUM(TotalHour) = 8",
    [room.BookingDate],
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
Booking.currentstetus = (room, result) => {
  sql.query(
    "SELECT RoomNumber,RoomID FROM room WHERE RoomID NOT IN (SELECT RoomID FROM booking WHERE StartTime < ? AND EndTime > ?  AND BookingDate = ?) ",
    [room.CurrentTime, room.CurrentTime, room.CurrentDate],
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
    "SELECT SUM(TotalPrice) AS TotalIncome FROM `booking` WHERE BookingDate = ?  ",
    [date.BookingDate],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      } else {
        console.log(
          "return the total price for date: " +
            date.BookingDate +
            " " +
            res[0].TotalIncome  
        );
        
        result(null, res[0].TotalIncome);
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
Booking.getWeeklyOverview = (data, result) => {
  sql.query(
    "SELECT BookingDate, COUNT(DISTINCT UserID) AS NumberOfUsers,SUM(TotalPrice) AS TotalIncome,SUM(TotalHour) AS TotalHour FROM booking WHERE BookingDate BETWEEN ? AND ? GROUP BY BookingDate ",
    [data.BookingData, data.BookingDataEnd],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      } else {
        console.log(
          "return the total price for data: " +
            data.BookingData +
            "till this data:" +
            data.BookingDataEnd
        );
        result(null, res);
      }
    }
  );
};
Booking.getMostBookedRoom = (data, result) => {
  sql.query(
    "SELECT r.RoomNumber, COUNT(*) AS BookingCount FROM booking b join room r ON b.RoomID = r.RoomID WHERE b.BookingDate = ? GROUP BY b.RoomID ORDER BY BookingCount DESC",
    [data.BookingDate, data.RoomNumber, data.BookingCount],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      } else {
        console.log(
          "return the Most Booked Room From this date" +
            data.BookingDate +
            "Room Number:" +
            data.RoomNumber +
            "Booking Count:" +
            data.BookingCount
        );
        result(null, res);
      }
    }
  );
};

Booking.getTopSpender = (data, result) => {
  sql.query(
    "SELECT u.Username, SUM(TotalPrice) AS Spend FROM booking b join users u ON b.UserID = u.UserID GROUP BY b.UserID ORDER BY Spend DESC LIMIT 5",
    [data.Username, data.spend],
    (err, res) => {
      if (err) {
        console.log("Query err: " + err);
        result(err, null);
        return;
      } else {
        console.log(
          "return the Most Booked Room From this date" +
            data.BookingDate +
            "Room Number:" +
            data.RoomNumber +
            "Booking Count:" +
            data.BookingCount
        );
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
    "SELECT * FROM `booking` WHERE BookingID = ?",
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
