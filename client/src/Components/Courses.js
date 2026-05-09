import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Table } from "reactstrap";

const Courses = () => {
  const email = useSelector((state) => state.users.user?.email);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/getcoursedepartments",
        );
        setDepartments(response.data.departments || []);
      } catch (err) {
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [email, navigate]);

  useEffect(() => {
    if (!email) {
      return;
    }

    const fetchCourses = async () => {
      setError("");
      setIsLoading(true);

      try {
        const response = await axios.get("http://localhost:3001/getcourses", {
          params: selectedDepartment ? { department: selectedDepartment } : {},
        });
        setCourses(response.data.courses || []);
      } catch (err) {
        setError("Failed to fetch courses. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [email, selectedDepartment]);

  return (
    <Container className="mt-4">
      <h4>Courses</h4>
{  /*dynamic dropdown for departments filled with list of unique departments fetched by API :getcoursedepartments*/  }
      <div className="mb-3" style={{ maxWidth: "340px" }}>
        <label htmlFor="departmentFilter" className="form-label">
          Filter by Department
        </label>
        <select
          id="departmentFilter"
          className="form-select"
          value={selectedDepartment}
          onChange={(event) => setSelectedDepartment(event.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {isLoading && <p className="text-muted">Loading...</p>}

      {courses.length > 0 ? (
        <Table bordered striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Specialisation</th>
              <th>Level</th>
              <th>Offered By</th>
              <th>Theory Hours</th>
              <th>Practical Hours</th>
              <th>Passing Grade</th>
              <th>Passing Mark</th>
              <th>Grade Point</th>
              <th>Course Status</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course._id || course.courseid || index}>
                <td>{index + 1}</td>
                <td>{course.courseid || "-"}</td>
                <td>{course.coursename || "-"}</td>
                <td>{course.specialisation || "-"}</td>
                <td>{course.level || "-"}</td>
                <td>{course.offeredby || "-"}</td>
                <td>{course.thrs ?? "-"}</td>
                <td>{course.phrs ?? "-"}</td>
                <td>{course.pgrade || "-"}</td>
                <td>{course.pmark ?? "-"}</td>
                <td>{course.pgradepoint ?? "-"}</td>
                <td>{course.cstatus || "-"}</td>
                <td>{course.department || "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        !isLoading && !error && <p className="text-muted">No courses found.</p>
      )}
    </Container>
  );
};

export default Courses;
