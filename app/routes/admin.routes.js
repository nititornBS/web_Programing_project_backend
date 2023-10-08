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
  router.get("/alluser", authJwt, admin_controller.getAllUsers);
  router.get("/allroom", authJwt, admin_controller.getallroom);
  router.put("/uproom/:id", authJwt, admin_controller.AdminupdateRoom);
  
  router.post("/addroom", admin_controller.addRoom  );

};
