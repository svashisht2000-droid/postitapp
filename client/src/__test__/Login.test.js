import React from "react";
// Load the Redux Toolkit helper that builds a real Redux store for the component.
import { configureStore } from "@reduxjs/toolkit";

// Load testing helpers that let us render the component and inspect the UI.
import { render, screen, fireEvent } from "@testing-library/react";

// Load the Redux Provider so the Login component can read from the Redux store.
import { Provider } from "react-redux";

// Load MemoryRouter so React Router hooks and links work in the test environment.
import { MemoryRouter } from "react-router-dom";

// Add DOM-specific Jest matchers such as toBeInTheDocument().
import "@testing-library/jest-dom";

// Load the Login component that this test file is verifying.
import Login from "../Components/Login";

// Load the users reducer so the test store uses the same slice logic as the app.
import userReducer from "../Features/UserSlice";

// Build a Redux store with the users slice and an optional state override.
const createStore = (usersState = {}) =>
  configureStore({
    // Register the users reducer under the users key.
    reducer: {
      users: userReducer,
    },
    // Provide a starting state so the component can render without a backend.
    preloadedState: {
      users: {
        // Use an empty user object to represent a logged-out user.
        user: {},
        // The component should not show a loading state at the start.
        isLoading: false,
        // The component should not show a success state at the start.
        isSuccess: false,
        // The component should not show an error state at the start.
        isError: false,
        // Allow individual tests to override any users state value.
        ...usersState,
      },
    },
  });

// Render the Login component with Redux and Router wrappers already set up.
const renderLogin = (usersState) => {
  // Create the store for this specific test case.
  const store = createStore(usersState);

  // Render the provider, router, and Login component together.
  render(
    React.createElement(
      Provider,
      { store },
      React.createElement(MemoryRouter, null, React.createElement(Login)),
    ),
  );

  // Return the store in case a test wants to inspect it later.
  return store;
};

// Group all Login-related tests together.
describe("Login", () => {
  // Check that the login page shows the expected form fields and button.
  test("renders the login form", () => {
    // Render the component before checking the screen.
    renderLogin();

    // Verify that the email field exists and can be found by its label.
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    // Verify that the password field exists and can be found by its label.
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    // Verify that the login button exists and is reachable by its accessible name.
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  // Check that typing into the inputs updates their values.
  test("updates email and password inputs", () => {
    // Render the component so the test can interact with the form.
    renderLogin();

    // Find the email input by its accessible label.
    const emailInput = screen.getByLabelText(/email/i);
    // Find the password input by its accessible label.
    const passwordInput = screen.getByLabelText(/password/i);

    // Simulate the user typing an email address into the email field.
    fireEvent.change(emailInput, {
      target: { value: "valid.email@example.com" },
    });
    // Simulate the user typing a password into the password field.
    fireEvent.change(passwordInput, {
      target: { value: "Abc@123" },
    });

    // Confirm the email field now holds the typed value.
    expect(emailInput.value).toBe("valid.email@example.com");
    // Confirm the password field now holds the typed value.
    expect(passwordInput.value).toBe("Abc@123");
  });

  // Check that the reducer starts with the correct default state.
  test("returns the initial users state", () => {
    // Call the reducer with undefined so it returns its built-in initial state.
    expect(
      userReducer(undefined, {
        // The action type is not important here because we only want the default state.
        type: undefined,
      }),
    ).toEqual({
      // The user object should start empty.
      user: {},
      // Loading should start turned off.
      isLoading: false,
      // Success should start turned off.
      isSuccess: false,
      // Error should start turned off.
      isError: false,
    });
  });
});
