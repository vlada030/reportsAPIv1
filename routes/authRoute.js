const express = require('express');
const { check, body} = require('express-validator');

const {register, login, getMe, deleteMe, logout, logoutAll, updateDetails, updatePassword, forgotPassword, updateAvatar, deleteAvatar, resetPassword, uploadUserPhoto, getAvatar} = require('../controllers/authController');

const router = express.Router();

// importuj middleware za autentikaciju
const { protect } = require('../middleware/auth');

router
    .route("/register")
    .post(
        [
            check("name")
                .not()
                .isEmpty()
                .withMessage("Unesite korisničko ime")
                .trim(),
            check("email")
                .isEmail()
                .withMessage("Unesite ispravnu email adresu")
                .normalizeEmail(),
            check(
                "password",
                "Šifra treba da sadrži slova i brojeve, 7 - 15 karaktera"
            )
                .isLength({ min: 7, max: 15 })
                .isAlphanumeric(),
            body("confirmPassword").custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Šifre se ne podudaraju, ponovite unos");
                }
                return true;
            }),
        ],
        register
    );
router.route("/login").post(login);
router.route("/me").get(protect, getMe).delete(protect, deleteMe);
router
    .route("/me/avatar")
    .get(protect, getAvatar)
    .post(protect, uploadUserPhoto, updateAvatar)
    .delete(protect, deleteAvatar);
router.post("/logout", protect, logout);
router.post("/logoutAll", protect, logoutAll);
router.put("/update", updateDetails);
router.put("/updatepassword", updatePassword);
router.post("/resetpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;