const JourneyDetails = require('../models/JourneyDetails.js');
const Journeys = require('../models/Journeys.js');

//Get details by the journey ID
exports.getDetailsByJourneyId = async (req, res) => {
    try {
        const journeyId = req.params.journeyId;
        const details = await JourneyDetails.find({ journeyId }).select(
            'time location journalText journalPhoto');
        res.status(200).json(details);
    } catch (error) {
        res.status(500).json( {message: error.message} );
    }
};

//Get detail by ID
exports.getDetailId = async (req, res) => {
    try {
        const detail = await JourneyDetails.findById(req.params.detailId);
        res.status(200).json(detail);
    } catch (error) {
        res.status(500).json( {message: error.message} );
    }
};

//Create a new detail
exports.createDetail = async (req, res) => {
    try {
        //find the journey id
        const journeyId = req.params.journeyId;
        //create and save a new journeydetail
        const detail = new JourneyDetails({ ...req.body, journeyId });
        const newDetail = await detail.save();
        //save the new detail's id into the journey collection
        await Journeys.findByIdAndUpdate(
            journeyId,
            { $push: { details: newDetail._id } },
            { new: true }
        )
        //return the result
        res.status(201).json(newDetail);
    } catch (error) {
        res.status(500).json( {message: error.message} );
    }
};

//Delete a detail
exports.deleteDetail = async (req, res) => {
    try {
        //delete the detail
        const detail = await JourneyDetails.findByIdAndDelete(req.params.detailId);
        if (!detail) {
            return res.status(404).json( {message: 'Journey Detail not found.'} );
        }
        //delete the detail's id from the Journeys collection
        const updatedJourney = await Journeys.findByIdAndUpdate(
            detail.journeyId,
            { $pull: { details: req.params.detailId } },
            {new: true}

        );
        if (!updatedJourney) {
            return res.status(404).json({ message: 'Journey update failed.' })
        }
        res.status(200).json({ message: 'Journey Detail deleted successfully.' })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Update a detail
exports.updateDetail = async (req, res) => {
    try {
        const id = req.params.detailId;
        const updatedData = req.body;
        const updatedDetail = await JourneyDetails.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedDetail) {
            res.status(404).json({ message:'Journey detail not found.' });
        }
        res.status(200).json(updatedDetail);
    } catch (error) {
        res.status(500).json( {message: error.message} );
    }
};
