const express = require('express');
const { getUsers, getUser, deleteUser} = require('../controllers/usersController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/:id').get(protect, authorize('admin'), getUser).delete(protect, authorize('admin'), deleteUser);

module.exports = router;