const {Thought, User} = require('../models');

const thoughtsController = {
    //get thoughts
    getAllThoughts(req,res) {
        Thought.find()
        .sort({createdAt: -1})
        .then((dbThoughtData) => {
            res.json(dbThoughtData)
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //get a thought by id
    getThoughtById(req,res) {
        Thought.findOne({_id: req.params.id})
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({message: 'No thought with this id was found!'});
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //create a new thought
    createThought(req,res) {
        Thought.create(req.body)
        .then((dbThoughtData) => {
            return User.findOneAndUpdate(
                {_id: req.body.userId},
                {$push: {thoughts: dbThoughtData._id}},
                {new: true}
            );
        })
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({message: 'No thought with this id!'});
                return;
            }
            res.json(dbThoughtData)
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //update a thought by id
    updateThought(req,res) {
        Thought.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({message: 'No thought with this id!'});
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //delete a thought by id
    deleteThought(req,res) {
        Thought.findOneAndDelete({_id: req.params.id})
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({message: 'No thought with this id!'});
            }
            res.json(dbThoughtData);
        })
    },
    //add a reaction
    addReaction(req,res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$push: {reactions: req.body}},
            {new: true}
        )
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({message: 'No thought with this id!'});
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //delete a reaction
    deleteReaction(req,res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {new: true}
        )
        .then((dbThoughtData) => {
            if(!dbThoughtData) {
                return res.status(404).json({message: 'No thought with this id!'});
            }
            res.json(dbThoughtData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
};

module.exports = thoughtsController;