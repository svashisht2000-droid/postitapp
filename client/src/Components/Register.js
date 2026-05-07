// Importing components from 'reactstrap' library to create a styled form and layout
import {Link} from "react-router-dom";
import {
  
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

// Importing 'useState' hook from React to manage form input values
import { useState } from "react";

// Importing the validation schema for the form (defines rules for valid input)
import { userSchemaValidation } from "../Validations/UserValidations";

// Importing 'yup' library, which helps define the validation rules
import * as yup from "yup";

// Importing 'useForm' from 'react-hook-form' to simplify form handling and validation
import { useForm } from "react-hook-form";

// Importing 'yupResolver' to connect 'yup' validation with 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";

// Importing Redux hooks to interact with the Redux store
import { useSelector, useDispatch } from "react-redux";



// Importing action to register a new user
import { registerUser } from "../Features/UserSlice";

// Importing 'useNavigate' from 'react-router-dom' to redirect users after form submission
import { useNavigate } from "react-router-dom";

// Defining the Register component
const Register = () => {
  // useSelector retrieves the current list of users from the Redux store
  // 'state.users.value' refers to the 'value' property in the 'users' slice of the Redux store
  const userList = useSelector((state) => state.users.value);

  // useState hooks to manage form input values locally
  // Each input field (name, email, password, confirmPassword) has its own state
  const [name, setname] = useState(""); // Stores the name input value
  const [email, setemail] = useState(""); // Stores the email input value
  const [password, setpassword] = useState(""); // Stores the password input value
  const [confirmPassword, setconfirmPassword] = useState(""); // Stores the confirm password input value

  // useForm hook from 'react-hook-form' to handle form validation and submission
  const {
    register, // Registers input fields to track their values and validate them
    handleSubmit, // Function to handle form submission when the form is valid
    formState: { errors }, // Object containing validation error messages for each field
  } = useForm({
    // Connects the Yup validation schema to react-hook-form
    resolver: yupResolver(userSchemaValidation),
  });

  // useDispatch hook to dispatch Redux actions (like adding or updating users)
  const dispatch = useDispatch();

  // useNavigate hook to redirect the user to another page (e.g., login page)
  const navigate = useNavigate();

  // Function to handle form submission when the form is valid
  const onSubmit = (data) => {
    try {
      // 'data' contains the validated form values (name, email, password, confirmPassword)
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      // Log the form data to the console for debugging
      console.log("Form Data", data);

      // Show a success message
      alert("Validation all good.");

      // Dispatch the 'registerUser' action to add the new user to the Redux store
      dispatch(registerUser(userData));

      // Redirect the user to the login page after successful registration
      navigate("/login");
    } catch (error) {
      // Log any errors that occur during submission
      console.log("Error.");
    }
  };

  

  // JSX (React's HTML-like syntax) to render the form and layout
  return (
    // Container from reactstrap to create a responsive layout
    <Container fluid>
      {/* Row to organize the form in a grid layout */}
      <Row className="formrow">
        {/* Column for the form, takes up 6 out of 12 grid spaces on large screens */}
        <Col className="columndiv1" lg="6">
          {/* Form element with onSubmit event tied to handleSubmit (from react-hook-form) */}
          <form className="div-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="appTitle"></div> {/* Placeholder for a title (currently empty) */}
            <section className="form">
              {/* Form input for the user's name */}
              <div className="form-group">
                <input
                  type="text"
                  className="form-control" // Bootstrap styling for inputs
                  id="name"
                  placeholder="Enter your name..."
                  {...register("name", {
                    // Update the 'name' state whenever the input changes
                    onChange: (e) => setname(e.target.value),
                  })}
                />
                {/* Display validation error message for the name field, if any */}
                <p className="error">{errors.name?.message}</p>
              </div>

              {/* Form input for the user's email */}
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email..."
                  {...register("email", {
                    // Update the 'email' state whenever the input changes
                    onChange: (e) => setemail(e.target.value),
                  })}
                />
                {/* Display validation error message for the email field, if any */}
                <p className="error">{errors.email?.message}</p>
              </div>

              {/* Form input for the user's password */}
              <div className="form-group">
                <input
                  type="password" // Hides the input text for security
                  className="form-control"
                  id="password"
                  placeholder="Enter your password..."
                  {...register("password", {
                    // Update the 'password' state whenever the input changes
                    onChange: (e) => setpassword(e.target.value),
                  })}
                />
                {/* Display validation error message for the password field, if any */}
                <p className="error">{errors.password?.message}</p>
              </div>

              {/* Form input to confirm the password */}
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm your password..."
                  {...register("confirmPassword", {
                    // Update the 'confirmPassword' state whenever the input changes
                    onChange: (e) => setconfirmPassword(e.target.value),
                  })}
                />
                {/* Display validation error message for the confirmPassword field, if any */}
                <p className="error">{errors.confirmPassword?.message}</p>
              </div>

              {/* Submit button to register the user */}
              <Button color="primary" className="button">
                Register
              </Button>
            </section>
            <p className="smalltext">
          Already Registered? <Link to="/login">Login </Link>
        </p>
          </form>
        </Col>
        {/* Empty column to balance the layout (takes up the other 6 grid spaces) */}
        <Col className="columndiv2" lg="6"></Col>
      </Row>

      {/* Commented-out section that would display a list of users */}
     {/*  <Row>
        <Col md={6}>
          <table>
            <tbody>
              {userList.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>
                    <Button onClick={() => handleDelete(user.email)}>
                      Delete User
                    </Button>
                    <Button onClick={() => handleUpdate(user.email)}>
                      Update User
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>  */}
    </Container>
  );
};

// Export the Register component so it can be used in other parts of the app
export default Register;