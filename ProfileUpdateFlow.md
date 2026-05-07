# Profile Update Flow — Detailed Steps

## Overview

This document explains the full process of updating a user profile in the PostIT MERN stack application, from the React frontend through Redux, the Express server, and finally MongoDB.

---

## Section 1: Profile.js — Component Initialization

When the user navigates to the `/profile` page:

1. **`useSelector`** reads `state.users.user` from the Redux store — this is the currently logged-in user object.
2. **`useState` variables** are initialized with the user's existing data:
   - `userName` = `user.name`
   - `pwd` = `user.password`
   - `confirmPassword` = `user.password`
3. **`useEffect`** checks if `user.email` exists. If not, the user is redirected to `/login`.
4. The form renders **pre-filled** with the user's current name and password. The email field is disabled (cannot be changed).

---

## Section 2: Profile.js — Form Submission

When the user edits the form and clicks **Update Profile**:

1. The `handleUpdate` function is called.
2. `event.preventDefault()` stops the default browser page reload.
3. A **password match check** is performed:
   - If `pwd !== confirmPassword` → Alert: _"Passwords do not match"_ and stop.
4. A `userData` object is built:
   ```js
   { email: user.email, name: userName, password: pwd }
   ```
5. `dispatch(updateUserProfile(userData))` is called — this triggers the async thunk in `UserSlice.js`.

---

## Section 3: UserSlice.js — Async Thunk

1. **`updateUserProfile.pending`** fires immediately → `state.isLoading = true`.
2. **`axios.put`** sends an HTTP PUT request to:
   ```
   http://localhost:3001/updateUserProfile/:email
   ```

   - Email is in the **URL** (`req.params`)
   - Name and password are in the **request body** (`req.body`)
3. If the server is unreachable → **`updateUserProfile.rejected`** fires → `state.isError = true`.
4. If successful → awaits the server response.

---

## Section 4: server/index.js — Express Route Handler

The Express server handles the PUT request at `/updateUserProfile/:email`:

1. **Extracts data:**
   - `email` from `req.params.email` (URL parameter)
   - `name` from `req.body.name`
   - `password` from `req.body.password`

2. **Queries MongoDB:**

   ```js
   const userToUpdate = await UserModel.findOne({ email: email });
   ```

3. **If user not found** → responds with `404: User not found`.

4. **If user found:**
   - Updates the name: `userToUpdate.name = name`
   - Checks if the password has changed:
     - **If changed** → `bcrypt.hash(password, 10)` generates a new hash with 10 salt rounds → `userToUpdate.password = hashedPassword`
     - **If unchanged** → keeps the existing hashed password

5. **Saves to MongoDB:**

   ```js
   await userToUpdate.save();
   ```

6. **Sends response:**
   ```js
   res.send({ user: userToUpdate, msg: "Updated." });
   ```

---

## Section 5: MongoDB — Database Update

In the **`userInfos`** database, the **`userinfomodels`** collection document is updated:

| Field      | Value                        |
| ---------- | ---------------------------- |
| `_id`      | Unchanged (MongoDB ObjectId) |
| `email`    | Unchanged                    |
| `name`     | Updated to new name          |
| `password` | Updated to new bcrypt hash   |

---

## Section 6: UserSlice.js — Handle Fulfilled Response

1. `axios` receives the response from the server.
2. `response.data.user` is extracted and **returned as `action.payload`**.
3. **`updateUserProfile.fulfilled`** fires:
   ```js
   state.user = action.payload; // Redux store updated
   state.isLoading = false;
   state.isSuccess = true;
   state.isError = false;
   ```

---

## Section 7: Profile.js — UI Update

1. The Redux store's `state.users.user` is now updated with the new data.
2. `useSelector` detects the change and **triggers a re-render** of `Profile.js`.
3. The form reflects the updated values.
4. **Alert:** _"Profile Updated."_ is shown to the user.
5. `navigate("/profile")` keeps the user on the profile page.

---

## Summary Table

| Step | File              | Action                                 |
| ---- | ----------------- | -------------------------------------- |
| 1    | `Profile.js`      | Fetch user from Redux store, fill form |
| 2    | `Profile.js`      | Validate passwords, dispatch thunk     |
| 3    | `UserSlice.js`    | Send PUT request via axios             |
| 4    | `server/index.js` | Find user, hash password, save         |
| 5    | MongoDB           | Document updated in collection         |
| 6    | `UserSlice.js`    | Update Redux store with response       |
| 7    | `Profile.js`      | Re-render with new data, show alert    |
