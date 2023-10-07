const authJwt = require("../middleware/auth.jwt");

module.exports = (app) => {
  const admin_controller = require("../controllers/admin.controller");
  var router = require("express").Router();
  router.get("/:us", admin_controller.validUsername);
  app.use("/api/admin/auth", router);
  router.post("/signup", admin_controller.createNewAdmin);
  router.post("/login", admin_controller.login);
  router.put("/:id", authJwt, admin_controller.updateuserCtrl);
  router.delete("/:id", authJwt, admin_controller.deletedUser);
  router.get("/", authJwt, admin_controller.getAllUsers);
};
