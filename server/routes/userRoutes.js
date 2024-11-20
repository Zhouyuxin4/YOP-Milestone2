const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/', userController.getAllUsers);
router.get('/:userName', userController.getuserName);
router.post('/', userController.createUser);
router.delete('/:userName', userController.deleteUser);
router.put('/:userName', userController.updateUser);
router.get('/:userName/search', userController.searchJourneys);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController.js');
// const { authenticateToken } = require('../middleware/authMiddleware.js');

// // Print all users (test only)
// router.get('/', userController.getAllUsers); //get all users

// // Don't need the authentication
// router.post('/register', userController.createUser); //create a new user
router.post('/login', userController.login); //to login

// // Need the authentication
// router.get('/:id', authenticateToken, userController.getUserId); //get a specific user
// router.delete('/:id', authenticateToken, userController.deleteUser); //delete an existed user
// router.put('/:id', authenticateToken, userController.updateUser); //update an existed user
// router.get('/:id/search', authenticateToken, userController.searchJourneys); //search for one user's past journeys with keywords

// module.exports = router;