import mongoose from "mongoose";

const StudentSchema = mongoose.Schema(
  {
    studentid: {
      type: String,
      required: true,
      index: true,
    },
    sname: {
      type: String,
      required: true,
    },
    // Compatibility fields for existing data variants.
    sid: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  {
    strict: false,
  },
);

const StudentsModel = mongoose.model("students", StudentSchema);

export default StudentsModel;
