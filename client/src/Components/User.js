import userDefaultImage from "../Images/user.png";
import { useSelector } from "react-redux";
import Location from "./Location";

const User = () => {
  const email = useSelector((state) => state.users.user.email);
  const name = useSelector((state) => state.users.user.name);
  const profilePic = useSelector((state) => state.users.user.profilePic);
  const picURL = profilePic
    ? "http://localhost:3001/uploads/" + profilePic
    : userDefaultImage;
  return (
    <div>
      <img src={picURL} className="userImage" alt="User" />
      <p>
        <b>{name}</b>
        <br />
        {email}
        <Location/>
      </p>
    </div>
  );
};

export default User;
