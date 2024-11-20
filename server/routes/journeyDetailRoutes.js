const express = require('express');
const router = express.Router();
const JourneyDetailController = require('../controllers/journeyDetailController');

router.get('/:username/:journeyId/allDetails', JourneyDetailController.getDetailsByJourneyId);
router.get('/:username/:journeyId/:detailId', JourneyDetailController.getDetailId);
router.post('/:userName/:journeyId/createDetails', JourneyDetailController.createDetail);
router.delete('/:userName/:journeyId/:detailId', JourneyDetailController.deleteDetail);
router.put('/:userName/:journeyId/:detailId/update', JourneyDetailController.updateDetail);

module.exports = router;
