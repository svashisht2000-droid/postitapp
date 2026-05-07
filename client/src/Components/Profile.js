import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import User from "./User";
import { updateUserProfile } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Input, Label, Button, Container, Row, Col } from "reactstrap";
const Profile = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userName, setUserName] = useState(user.name || "");
  const [pwd, setPwd] = useState(user.password || ""); // hashed password.Unsafe 
  const [confirmPassword, setConfirmPassword] = useState(user.password || "");
  const handleUpdate = async (event) => {
    event.preventDefault();
    if (pwd !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const userData = {
      email: user.email,
      name: userName,
      password: pwd,
    };
    console.log(userData);
    await dispatch(updateUserProfile(userData));
    alert("Profile Updated.");
    navigate("/profile");
  };
  useEffect(() => {
    if (!user.email) {
      navigate("/login");
    }
  }, [user.email, navigate]);
  return (
    <Container fluid>
      <h1>Profile</h1>
      <Row>
        <Col md={2}>
          <User />
        </Col>
        <Col md={4}>
          Update Profile
          <Form onSubmit={handleUpdate}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Name..."
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Email..."
                type="email"
                value={user?.email || ""}
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="Password..."
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword "
                name="confirmPassword"
                placeholder="Confirm Password..."
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" className="button">
                Update Profile
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default Profile;
