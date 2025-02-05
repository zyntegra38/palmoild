import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  activeUser,
  inactiveUser,
  passwordreset,
  updateUserD,
  forgetPassword,
  deleteUser,
  updateUserPassword
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/active', activeUser);
router.get('/inactive', inactiveUser);
router.route('/:id').delete(deleteUser);
router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.put('/subscribe', updateUserD);
router.post('/forget-password', forgetPassword);
router.post('/newpassword/:token', passwordreset);
router.put('/profile', getUserProfile);
router.put('/profilepassword', updateUserPassword);
router.get('/profile', updateUserProfile);
// router
//   .route("/profile")
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile);

export default router;
