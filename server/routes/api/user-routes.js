const router = require("express").Router();
// import middleware
const { authMiddleware } = require("../../utils/auth");
const {
  addUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require("../../controllers/user-controller");

// put authMiddleware anywhere we need to send a token for verification of user
router.route("/").post(addUser).put(authMiddleware, saveBook);

router.route("/login").post(login);

router.route("/me").get(authMiddleware, getSingleUser);

router.route("/books/:bookId").delete(authMiddleware, deleteBook);

module.exports = router;
