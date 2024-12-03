const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { authenticateToken } = require('../middleware/authMiddleware.js');

const upload = multer({ storage: multer.memoryStorage() });
router.post('/', upload.single('profilePicture'), userController.createUser); //to create a new user
router.post('/login', userController.login); //to login

router.get('/:userName', authenticateToken, userController.getuserName);
router.delete('/:userName', authenticateToken, userController.deleteUser);
router.put('/:userName', authenticateToken, upload.single('profilePicture'), userController.updateUser);
router.put('/:userName', authenticateToken, userController.updateUser);
router.get('/:userName/search', authenticateToken, userController.searchJourneys);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController.js');

// // Print all users (test only)
// router.get('/', userController.getAllUsers); //get all users

// // Don't need the authentication
// router.post('/register', userController.createUser); //create a new user

// // Need the authentication
// router.get('/:id', authenticateToken, userController.getUserId); //get a specific user
// router.delete('/:id', authenticateToken, userController.deleteUser); //delete an existed user
// router.put('/:id', authenticateToken, userController.updateUser); //update an existed user
// router.get('/:id/search', authenticateToken, userController.searchJourneys); //search for one user's past journeys with keywords

// module.exports = router;