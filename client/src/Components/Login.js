// Importing components from the 'reactstrap' library, which is a Bootstrap-based UI library for React.
// These components help create a nice-looking form with less custom CSS.
import {
  Form,          // A wrapper for form elements
  Input,         // A field for user input (like email or password)
  FormGroup,     // Groups a label and input together
  Label,         // A label for an input field
  Container,     // A wrapper to center and constrain content
  Button,        // A clickable button
  Col,           // A column for grid layout
  Row,           // A row for grid layout
} from "reactstrap";

// Importing an image file (logo) to display on the page.
import logo from "../Images/logo-t.png";

// Importing 'Link' from 'react-router-dom' to create navigation links without reloading the page.
import { Link } from "react-router-dom";

// Importing 'useState' from React to manage form input data (email and password) in this component.
import { useState } from "react";

// Importing 'useDispatch' from Redux to send actions (like logging in) to the Redux store.
import { useDispatch } from "react-redux";

// Importing the 'login' action from the UserSlice file, which handles the login logic in Redux.
import { login } from "../Features/UserSlice";

// Importing 'useSelector' to access parts of the Redux store (like user data or login status).
import { useSelector } from "react-redux";

// Importing 'useEffect' to run code when certain values (like login success or failure) change.
import { useEffect } from "react";

// Importing 'useNavigate' to programmatically redirect the user to different pages (e.g., home page after login).
import { useNavigate } from "react-router-dom";

// Defining the Login component, which is a functional React component.
const Login = () => {
  // Using 'useState' to create two pieces of state: 'email' and 'password'.
  // These will store what the user types in the input fields.
  // 'setemail' and 'setpassword' are functions to update these values.
  const [email, setemail] = useState("saif@yahoo.com"); // Initial email
  const [password, setpassword] = useState("Muscat123?"); // Initial password

  // 'useDispatch' gives us a function to send actions to the Redux store.
  const dispatch = useDispatch();

  // 'useNavigate' gives us a function to redirect the user to other routes.
  const navigate = useNavigate();

  // Using 'useSelector' to get data from the Redux store.
  // Here, we're accessing the 'user' object, 'isSuccess', and 'isError' from the 'users' slice.
  // These tell us if the user is logged in, if the login was successful, or if there was an error.
  const user = useSelector((state) => state.users.user); // The logged-in user's data
  const isSuccess = useSelector((state) => state.users.isSuccess); // True if login worked
  const isError = useSelector((state) => state.users.isError); // True if login failed
  const isLoading = useSelector((state) => state.users.isLoading); // True if login is in progress  
  // A function to handle the login process when the user clicks the "Login" button.
  const handleLogin = () => {
    // Create an object with the email and password the user entered.
    const userData = {
      email: email,
      password: password,
    };
    // Send the 'login' action to Redux with the userData.
    // This will trigger the login logic (likely an API call) defined in the UserSlice.
    dispatch(login(userData));
  };

  // 'useEffect' runs code when certain values change (listed in the dependency array).
  // Here, it checks if the login failed or succeeded and redirects the user accordingly.
  useEffect(() => {
    // If there was an error (e.g., wrong email/password), redirect to the login page.
    if (isError) {
      navigate("/login");
    }
    // If the login was successful, redirect to the home page ("/").
    if (isSuccess) {
      navigate("/home");
    }
  }, [user, isError, isSuccess]); // This code runs when 'user', 'isError', or 'isSuccess' changes.

  // The JSX (HTML-like code) that defines what the user sees on the page.
  return (
    <div>
      {/* Container centers the content and adds padding/margins */}
      <Container>
        
        {/* Form is a reactstrap component that wraps input fields */}
        {isError && (
          <p className="error">Login Failed. Please try again.</p>
        )}{" "}
        {/* Show error message if login failed */}
        {isSuccess && (
          <p className="success">Login Successful! Redirecting...</p>
        )}{" "}
        {/* Show success message if login succeeded */}
        {isLoading && <p className="loading">Logging in...</p>}{" "}
        {/* Show loading message while login is in progress */}
        <Form>
          {/* Row creates a horizontal row for the grid layout */}
          <Row>
            {/* Col defines a column that takes up 3 out of 12 grid units (for medium screens) */}
            <Col md={3}>
              {/* Display the logo image imported earlier */}
              <img src={logo} alt="Logo" />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              {/* FormGroup groups the email label and input together */}
              <FormGroup>
                <Label for="email">Email</Label>{" "}
                {/* Label for the email input */}
                <Input
                  id="email" // Matches the 'for' attribute of the label
                  name="email" // Name of the input field
                  value={email} // Binds the input value to the email state
                  type="email" // Ensures the input is treated as an email
                  // When the user types, update the 'email' state with their input
                  onChange={(e) => setemail(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <FormGroup>
                <Label for="password">Password</Label>{" "}
                {/* Label for the password input */}
                <Input
                  id="password"
                  name="password"
                  value={password}
                  type="password" // Hides the text for security
                  // When the user types, update the 'password' state
                  onChange={(e) => setpassword(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              {/* Button triggers the handleLogin function when clicked */}
              <Button onClick={() => handleLogin()}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </Col>
          </Row>
        </Form>
        {/* A paragraph with a link to the registration page */}
        <p className="smalltext">
          No Account? <Link to="/register">Sign Up now.</Link>
        </p>
      </Container>
    </div>
  );
};

// Export the Login component so it can be used in other parts of the app.
export default Login;
/*
Key Concepts Explained for Beginners
React Components: This code defines a React component called Login. Components are reusable pieces of UI. This one creates a login form.
Reactstrap: Reactstrap is a library that provides pre-styled components (like Form, Input, Button) based on Bootstrap. It saves you from writing a lot of CSS to make the form look good.
State with useState: The useState hook lets you store and update data in a component. Here, email and password store what the user types in the input fields.
Redux with useDispatch and useSelector: Redux is a way to manage app-wide data (like whether a user is logged in).
useDispatch lets you send actions (like login) to update the Redux store.
useSelector lets you read data from the store (like user, isSuccess, or isError).
Routing with useNavigate and Link:
useNavigate lets you redirect users to other pages (e.g., home page after login).
Link creates clickable links to other routes (like the signup page) without reloading the browser.
Event Handling: The onChange event on inputs updates the state when the user types. The onClick event on the button triggers the handleLogin function.
Side Effects with useEffect: The useEffect hook runs code when certain values change. Here, it checks if the login succeeded or failed and redirects the user.
JSX: The return section contains JSX, which looks like HTML but is actually JavaScript. It describes the UI (form, inputs, button, etc.).
This code is a great example of how React, Redux, and React Router work together in a MERN app to create a login page.
*/