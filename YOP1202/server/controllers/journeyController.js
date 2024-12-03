const Journeys = require('../models/Journeys.js');
const Users = require('../models/Users.js');

//Get a user's all journeys
exports.getAllJourneys = async (req, res) => {
    try {
        const user = await Users.findOne({"userName": req.params.userName });
        console.log('User found:', user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const journeys = await Journeys.find({ userName: user._id }); 
        console.log('Journeys found:', journeys); 
        res.status(200).json(journeys);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


//Get Journey by ID
exports.getJourneyId = async (req, res) => {
    try {
        const journey = await Journeys.findById(req.params.journeyId);
        res.status(200).json(journey);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// //Create Journey
// exports.createJourney = async (req, res) => {
//     const userId = req.user.userId; //get the user id from the request
//     const journey = new Journeys({ title: req.body.title, details: [], userId: userId });
//     try {
//         // save the new journey
//         const newJourney = await journey.save();

//         // save the new journey's id into the user collection
//         await Users.findByIdAndUpdate(
//             userId,
//             { $push: { journeys: newJourney._id } },
//             { new: true }
//         );

//         // return the result
//         res.status(201).json(newJourney);

//     } catch (error) {
//         console.error('Error creating journey:', error.message);
//         res.status(500).json({ message: error.message });
//     }
// };

exports.createJourney = async (req, res) => {
    let journey = new Journeys(req.body);
    try {
        const user = await Users.findOne({"userName": req.params.userName});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user);
        journey.userName = user._id;
        const newJourney = await journey.save();
        user.journeys.push(newJourney);
        const updatedUser = await user.save();
        console.log(updatedUser);
        res.status(201).json(newJourney);
    } catch (error) {
        console.error("Error creating journey:", error);
        res.status(500).json({ message: error.message });
    }
};


//Delete Journey
exports.deleteJourney = async (req, res) => {
    const userId = req.user.userId; // get the user id from the request
    try {
        // delete the journey
        const journey = await Journeys.findByIdAndDelete(req.params.journeyId);
        if (!journey) {
            return res.status(404).json({ message: 'Journey not found.'});
        }
        // delete the journey id from the user collection
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { $pull: { journeys: req.params.journeyId } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User update failed.' })
        }
        res.status(200).json( {message: 'Journey deleted successfully.'} );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Update Journey
exports.updateJourney = async (req, res) => {
    try {
        const journeyId = req.params.journeyId;
        const updatedData = req.body;
        const updatedJourney = await Journeys.findByIdAndUpdate(journeyId, updatedData, {new: true});

        if (!updatedJourney) {
            return res.status(404).json({ message: 'Journey not found.'});
        }
        res.status(200).json(updatedJourney);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

