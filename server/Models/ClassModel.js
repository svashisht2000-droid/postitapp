import mongoose from "mongoose";

const ClassSchema = mongoose.Schema({
  studentid: { type: String, required: true },
  coursecode: { type: String, required: true },
  sem: { type: String, required: true },
  section: { type: String, required: true },
  teacherid: { type: String, required: true },
});

const ClassModel = mongoose.model("classlists", ClassSchema);

export default ClassModel;
