const authJwt = require("../middleware/auth.jwt");

module.exports = (app) => {
  const booking_controller = require("../controllers/booking.controller");
  var router = require("express").Router();
 
  app.use("/api/booking", router);

  router.get("/getTotalhour", authJwt, booking_controller.gettotalhour);

  router.get("/getnumberforuser", authJwt, booking_controller.getuser);

  router.get("/overview", authJwt, booking_controller.overview);
  
  router.get("/getTotalIncome", authJwt, booking_controller.getIncome);
  router.get("/getAllBooked", authJwt, booking_controller.getAllBooked);
  router.get("/getABooked", authJwt, booking_controller.getABooked);

  router.get("/showAllroomdetail", authJwt, booking_controller.showRoomDetail);;
  router.post("/newbooking", authJwt, booking_controller.addNewBook);
  router.get("/getroomtime", authJwt, booking_controller.getRoomTime);
  router.get("/gettime",authJwt, booking_controller.showAllTime);
};