// Importing the Yup library, which helps us validate form inputs (like making sure an email is valid or a password is long enough)
// The '*' means we're importing all the tools Yup provides, and we'll access them using the 'yup' name
import * as yup from "yup";

// Creating a validation schema (a set of rules) for a user form and exporting it so other parts of our app can use it
// Think of this as a blueprint that checks if the user's input is correct
export const userSchemaValidation = yup.object().shape({
    // Defining a rule for the 'name' field in the form
    // yup.string() means this field must be text (not a number or something else)
    // .required("Name is required") means the user must fill this field, or they'll see the error message "Name is required"
    name: yup.string().required("Name is required"),

    // Defining a rule for the 'email' field
    // yup.string() ensures it's text
    // .email("Not valid email format") checks if the input looks like an email (e.g., "user@example.com")
    // .required("Email is required") means the user must provide an email
    email: yup
      .string()
      .email("Not valid email format")
      .required("Email is required"),

    // Defining a rule for the 'password' field
    // yup.string() ensures it's text
    // .min(4) means the password must be at least 4 characters long
    // .max(20) means the password can't be longer than 20 characters
    // .required("Password is required") means the user must enter a password
    password: yup.string().min(4).max(20).required("Password is required"),

    // Defining a rule for the 'confirmPassword' field (where the user retypes their password)
    // yup.string() ensures it's text
    // .oneOf([yup.ref("password"), null], "Passwords Don't Match") checks if this field matches the 'password' field
    // yup.ref("password") refers to the value of the 'password' field above
    // If they don't match, the user sees "Passwords Don't Match"
    // .required() means the user must fill this field (no error message specified here, so it might use a default one)
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords Don't Match")
      .required(),
});