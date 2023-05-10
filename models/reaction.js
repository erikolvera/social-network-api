const { Schema, Types } = require('mongoose');
const moment = require('moment');

const ReactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: 'Please enter a reaction',
            maxlength: 280
        },
        username: {
            type: String,
            required: 'Please enter a username'
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamps) => moment(timestamps).format('MMMM Do YYYY, h:mm:ss a'),
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

module.exports = ReactionSchema;
