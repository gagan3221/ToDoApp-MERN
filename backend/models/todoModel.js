const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activitySchema = new Schema({
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'paused', 'completed'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const todoSchema = new Schema(
  {
    todo: {
      type: String,
      required: true,
    },

    uid: {
      type: String,
      required: true,
    },
    
    status: {
      type: String,
      enum: ['pending', 'ongoing', 'paused', 'completed'],
      default: 'pending'
    },
    
    activeDuration: {
      type: Number,
      default: 0
    },
    
    lastStartTime: {
      type: Date,
      default: null
    },
    
    activities: [activitySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todos", todoSchema);
