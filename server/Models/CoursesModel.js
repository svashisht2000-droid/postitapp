import mongoose from "mongoose";

const CourseSchema = mongoose.Schema({
  courseid: {
    type: String,
    required: true,
  },
  coursename: {
    type: String,
    required: true,
  },
  specialisation: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  offeredby: {
    type: String,
    required: true,
  },
  thrs: {
    type: Number,
    required: true,
  },
  phrs: {
    type: Number,
    required: true,
  },
  pgrade: {
    type: String,
    required: true,
  },
  pmark: {
    type: Number,
    required: true,
  },
  pgradepoint: {
    type: Number,
    required: true,
  },
  cstatus: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
});

const CoursesModel = mongoose.model("courses", CourseSchema);

export default CoursesModel;
