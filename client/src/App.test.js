const React = require("react");
const { configureStore } = require("@reduxjs/toolkit");
const { render, screen } = require("@testing-library/react");
const { Provider } = require("react-redux");

require("@testing-library/jest-dom");

jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: { posts: [] } })),
  post: jest.fn(),
  put: jest.fn(),
}));

const App = require("./App").default;
const userReducer = require("./Features/UserSlice").default;
const postReducer = require("./Features/PostSlice").default;

const createTestStore = () =>
  configureStore({
    reducer: {
      users: userReducer,
      posts: postReducer,
    },
    preloadedState: {
      users: {
        user: {},
        isLoading: false,
        isSuccess: false,
        isError: false,
      },
    },
  });

test("renders the login page when no user is present", () => {
  const store = createTestStore();

  render(React.createElement(Provider, { store }, React.createElement(App)));

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
});
