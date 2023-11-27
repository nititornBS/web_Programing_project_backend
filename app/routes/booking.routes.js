const authJwt = require("../middleware/auth.jwt");

module.exports = (app) => {
  const booking_controller = require("../controllers/booking.controller");
  var router = require("express").Router();
 
  app.use("/api/booking", router);

  router.put("/getTotalhour", authJwt, booking_controller.gettotalhour);

  router.put("/getnumberforuser", authJwt, booking_controller.getuser);

  router.get("/overview", authJwt, booking_controller.overview);
  
  router.put("/getTotalIncome", authJwt, booking_controller.getIncome);
  router.get("/getAllBooked", authJwt, booking_controller.getAllBooked);

  router.get("/getABooked", authJwt, booking_controller.getABooked);


  router.put("/mostbookedroom", authJwt, booking_controller.MostBookedRoom);
  router.get("/topspender", authJwt, booking_controller.TopSpender);

  router.get("/showAllroomdetail", authJwt, booking_controller.showRoomDetail);;
  router.post("/newbooking", authJwt, booking_controller.addNewBook);
  router.put("/getroomtime", authJwt, booking_controller.getRoomTime);
  router.get("/gettime",authJwt, booking_controller.showAllTime);
  router.put("/gettimefull", authJwt, booking_controller.gettimefull);
  router.get("/currentstetus",authJwt, booking_controller.getcurrentstetus);
};