 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  posts: [],
  comments: [],
  likes: [],
  status: "idle",
  error: null,
};
export const savePost = createAsyncThunk("posts/savePost", async (postData) => {
  try {
    const response = await axios.post("http://localhost:3001/savePost", {
      postMsg: postData.postMsg,
      email: postData.email,
    });
    const post = response.data.post;
    return post; //Return the new post to Redux
  } catch (error) {
    console.log(error);
  }
});
export const getPosts = createAsyncThunk("post/getPosts", async () => {
  try {
    const response = await axios.get("http://localhost:3001/getPosts");
     console.log(response);
      return response.data.posts;
   
  } catch (error) {
    console.log(error);
  }
});
export const likePost = createAsyncThunk("posts/likePost", async (postData) => {
  try {
    //Pass along the URL the postId
    const response = await axios.put(
      `http://localhost:3001/likePost/${postData.postId}`,
      {
        userId: postData.userId,
      },
    );
    const post = response.data.post;// Get the updated post from the response
    return post;// Return the updated post to Redux
  } catch (error) {
    console.log(error);
  }
});
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(savePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(savePost.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = "succeeded";
        state.posts.unshift(action.payload);
      })
      .addCase(savePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    
      builder.addCase(getPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the state with fetched posts
        console.log(action.payload);
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
/* --------------------------Like Post----------------------------------------------------- */
    builder
      .addCase(likePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        //Search the post id from the posts state
        const updatedPostIndex = state.posts.findIndex(
          (post) => post._id === action.payload._id // action.payload is the updated post
        );
        if (updatedPostIndex !== -1) {
          state.posts[updatedPostIndex].likes = action.payload.likes;
          // action.payload.likes is the updated likes ojbect from the server with two keys: count and users array. 
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });


  },
});
export default postSlice.reducer;
  
