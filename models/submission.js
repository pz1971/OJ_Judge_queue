import mongoose from "mongoose";

const Schema = mongoose.Schema;

const submissionSchema = new Schema(
  {
    source: {
      type: String, // url
      required: true,
    },
    status: {
      type: String, //on_queue, judging, AC, TLE, MLE, WA
      required: true
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;