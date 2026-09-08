const mongoose = require('mongoose');
const {Schema} = mongoose;

const submissionSchema = new Schema({
    UserId:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    ProblemId:{
        type: Schema.Types.ObjectId,
        ref:"problem",
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
        enum:['javascript','java','python','c++','cpp']
    },
    status:{
        type:String,
        enum:['pending','accepted','wrong','error'],
        default:'pending'
    },
    runtime:{
        type:Number,
        default:0
    },
    memory:{
        type:Number,
        default:0
    },
    errorMessage:{
        type:String,
        default: " "
    },
    testCasesPassed:{
        type:Number,
        default:0
    },
    testCasesTotal:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})
submissionSchema.index({UserId:1, ProblemId:1});
const Submission = mongoose.model("UserSubmission",submissionSchema);
module.exports = Submission;