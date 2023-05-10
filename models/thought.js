const {Schema, model, Types} = require('mongoose');
const ReactionSchema = require('../models/reaction')
const moment = require('moment');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamps) => moment(timestamps).format('MMMM Do YYYY, h:mm:ss a'),
        },
        username: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema],
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            getters: true,
            id: false
        }
    }
);

thoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;

