const {User, Thought} = require('../models');

const usersController = {
    //get all users
    getAllUsers(req,res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then((dbUserData) => {
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //get a user by id
    getUserById(req,res) {
        User.findOne({_id: req.params.id})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then((dbUserData) => {
            if(!dbUserData) {
                return res.status(404).json({message: 'No user with this id!'});
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //create a new user
    createUser(req,res) {
        User.create(req.body)
        .then((dbUserData) => {
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //update a user by id
    updateUser(req,res) {
        User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, runValidators: true})
        .then((dbUserData) => {
            if(!dbUserData) {
                return res.status(404).json({message: 'No user with this id!'});
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //delete a user by id
    deleteUser(req,res) {
        User.findOneAndDelete({_id: req.params.id})
        .then((dbUserData) => {
            if(!dbUserData) {
                return res.status(404).json({message: 'No user with this id!'});
            }
            //remove user from friends list
            User.updateMany(
                {_id: {$in: dbUserData.friends}},
                {$pull: {friends: req.params.id}}
            )
            .then(() => {
                //remove user's thoughts
                Thought.deleteMany({username: dbUserData.username})
                .then(() => {
                    res.json({message: 'User deleted!'});
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json(err);
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //add a friend
    addFriend(req,res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$push: {friends: req.params.friendId}},
            {new: true}
        )
        .then((dbUserData) => {
            if(!dbUserData) {
                return res.status(404).json({message: 'No user with this id!'});
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    //delete a friend
    deleteFriend(req,res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            {new: true}
        )
        .then((dbUserData) => {
            if(!dbUserData) {
                return res.status(404).json({message: 'No user with this id!'});
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
};

module.exports = usersController;