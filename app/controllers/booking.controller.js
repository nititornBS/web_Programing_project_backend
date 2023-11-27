const booking = require("../models/booking.model");

  const addNewBook = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: "content can not be empty." });
    }
  
    const userObj = new booking({
      RoomID: req.body.RoomID,
      UserID: req.body.UserID,
      BookingDate: req.body.BookingDate,
      StartTime: req.body.StartTime,
      EndTime: req.body.EndTime,
      TotalHour: req.body.TotalHour,
      TotalPrice: req.body.TotalPrice,
    });

    booking.newbooking(userObj, (err, data) => {
      if (err) {
        res
          .status(500)
          .send({
            message: err.message || "Some error occured while creating",
          });
      } else res.send(data);
    });
  };

const showAllTime = (req, res) => {
  booking.getAlltime((err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};


const getRoomTime = (req, res) => {

  const data = {
    RoomID: req.body.RoomID,
    BookingDate: req.body.BookingDate
  };
  booking.RoomTime( data, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};
const gettimefull = (req, res) => {
  const data = {
    BookingDate: req.body.BookingDate,
  };
  booking.gettimefulls(data, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};


const getcurrentstetus = (req, res) => {
  const data = {
    CurrentTime: req.body.CurrentTime,
    CurrentDate: req.body.CurrentDate,
  };
  booking.currentstetus(data, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};

const getIncome = (req, res) => {
  const data = {
    BookingDate: req.body.BookingDate,
  };
  booking.getsumincome(data, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};
const overview = (req, res) => {
  const data = {
    BookingDate: req.body.BookingDate,
  };
  booking.getoverview(data, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};
const getuser = (req, res) => {
  const data = {
    BookingDate: req.body.BookingDate,
  };
  booking.getUser(data, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};
const gettotalhour = (req, res) => {
  const data = {
    BookingDate: req.body.BookingDate,
  };
  booking.getTotalHour(data, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};

const showRoomDetail = (req, res) => {
   booking.showroomdetail((err, data) => {
     if (err) {
       res.status(500).send({ message: err.message || "Some error ocurred." });
     } else res.send(data);
   });
}
const getAllBooked = (req, res) => {
  const data = {
    UserID: req.body.UserID,
  };
  booking.getAllbooked(data,(err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};
const getABooked = (req, res) => {
  const data = {
    BookingID: req.body.BookingID,

  };
  booking.getAbooked(data,(err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
  
};
const weeklyOverview = (req, res) => {
  const data = {
    BookingData: req.body.BookingData,
    BookingDataEnd: req.body.BookingDataEnd,
  };
  booking.getWeeklyOverview(data, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};

const MostBookedRoom = (req, res) => {
  const data = {
    BookingDate: req.body.BookingDate,
    RoomNumber: req.body.RoomNumber,
    BookingCount: req.body.BookingCount,
  };
  booking.getMostBookedRoom(data, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};

const TopSpender = (req, res) => {
  const data = {
    Username: req.body.Username,
    spend: req.body.spend,
  };
  booking.getTopSpender(data, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error ocurred." });
    } else res.send(data);
  });
};
module.exports = {
  showAllTime,
  showRoomDetail,
  addNewBook,
  getRoomTime,
  getAllBooked,
  getIncome,
  getuser,
  gettotalhour,
  overview,
  gettimefull,
  getABooked,
  MostBookedRoom,
  weeklyOverview,
  TopSpender,
  getcurrentstetus,
};