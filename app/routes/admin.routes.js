const authJwt = require("../middleware/auth.jwt");

module.exports = (app) => {
  const admin_controller = require("../controllers/admin.controller");
  var router = require("express").Router();
  router.get("/validuser/:us", admin_controller.validUsername);
  app.use("/api/admin/auth", router);
  router.post("/signup", admin_controller.createNewAdmin);
  router.post("/login", admin_controller.login);
  router.put("/updateUser/:id", authJwt, admin_controller.updateuserCtrl);
  router.delete("/:id", authJwt, admin_controller.deletedUserAdmin);
  router.get("/alladmin", authJwt, admin_controller.getAllUsers);
  router.get("/showAlluser", authJwt, admin_controller.showAlluser);
  router.get("/allroom", authJwt, admin_controller.getallroom);
  router.get("/showallroomdetail", authJwt, admin_controller.getroomdetail);

  router.put("/uproomDtail", authJwt, admin_controller.AdminupdateSizeRoom);
  router.put("/uproom/:id", authJwt, admin_controller.AdminupdateRoom);
  
  router.post("/addroom", admin_controller.addRoom);
  router.put("/updateuser", authJwt, admin_controller.updateUserCtrl);
// router.get("/", authJwt, admin_controller.getAllUsers);
};
