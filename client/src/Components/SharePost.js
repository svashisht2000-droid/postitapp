import { useSelector, useDispatch } from "react-redux";

import { useState } from "react";
import { savePost } from "../Features/PostSlice";
import { Button, Col, Container, Row, Input } from "reactstrap";
const SharePosts = () => {
  const [postMsg, setpostMsg] = useState("");
  const dispatch = useDispatch();
  const email = useSelector((state) => state.users.user.email);
  const handlePost = async () => {
    // Validate that postMsg is not empty
    if (!postMsg.trim()) {
      alert("Post message is required."); 
      return; 
    }
    const postData = {
      postMsg: postMsg,
      email: email,
    };
    dispatch(savePost(postData)); // Dispatch the savePost thunk from the Posts Slice.
    setpostMsg(""); // Clear the input field after posting
  };
  return (
    <Container>
      <Row>
        <Col>
          <Input
            id="share"
            name="share"
            placeholder="Share your thoughts..."
            type="textarea"
            value={postMsg}
            onChange={(e) => setpostMsg(e.target.value)}
          />
          <br /> <Button onClick={() => handlePost()}> PostIT</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SharePosts;
