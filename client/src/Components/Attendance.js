import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container, Table } from "reactstrap";

const Attendance = () => {
  const email = useSelector((state) => state.users.user?.email);
  const navigate = useNavigate();

  const [classList, setClassList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
    if (email) {
      const fetchClassList = async () => {
        setError("");
        setIsLoading(true);
        try {
          const response = await axios.get(
            "http://localhost:3001/getclasslist",
          );
          setClassList(response.data.classList || []);
        } catch (err) {
          setError("Failed to fetch class list. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchClassList();
    }
  }, [email, navigate]);

  return (
    <Container className="mt-4">
      <h4>Attendance</h4>

      {error && <p className="text-danger">{error}</p>}

      {isLoading && <p className="text-muted">Loading...</p>}

      {classList.length > 0 ? (
        <Table bordered striped responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Course Code</th>
              <th>Semester</th>
              <th>Section</th>
              <th>Teacher ID</th>
            </tr>
          </thead>
          <tbody>
            {classList.map((item, index) => (
              <tr key={item._id || item.studentid || index}>
                <td>{index + 1}</td>
                <td>{item.studentid}</td>
                <td>{item.sname || "-"}</td>
                <td>{item.coursecode || "-"}</td>
                <td>{item.sem || "-"}</td>
                <td>{item.section || "-"}</td>
                <td>{item.teacherid || "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        !isLoading &&
        classList.length === 0 &&
        !error && <p className="text-muted">No students found.</p>
      )}
    </Container>
  );
};

export default Attendance;
