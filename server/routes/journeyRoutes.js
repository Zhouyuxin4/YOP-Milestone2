const express = require('express');
const router = express.Router();
const journeyController = require('../controllers/journeyController');
const { authenticateToken } = require('../middleware/authMiddleware.js');

//router.get('/', journeyController.getAllJourneys);
router.get('/:userName', journeyController.getAllJourneys);
router.get('/:userName/:journeyId', journeyController.getJourneyId);
//router.post('/:userName/createJourneys', authenticateToken, journeyController.createJourney);
router.post('/:userName', journeyController.createJourney);
router.delete('/:userName/:journeyId', authenticateToken, journeyController.deleteJourney);
router.put('/:journeyId', journeyController.updateJourney);

module.exports = router;