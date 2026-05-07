import { Navbar, Nav, NavItem, NavLink } from "reactstrap";
import logo from "../Images/logo-t.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Features/UserSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user); // The logged-in user's data
  const handlelogout = async () => {
    await dispatch(logout());
    navigate("/login"); //redirect to login page route.
  };

  return (
    <>
      <Navbar className="header">
        <Nav>
          <NavItem>
            <Link>
              <img src={logo} className="logo" />
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/">Home</Link>
          </NavItem>
          <NavItem>
            <Link to="/profile">Profile</Link>
          </NavItem>
          <NavItem>
            <Link onClick={handlelogout}>Logout</Link>
          </NavItem>
          <NavItem></NavItem>
        </Nav>
        <span className="user-name" float="right">
          Hello {user ? `${user.name} (${user.email})` : "Guest"}
        </span>
      </Navbar>
    </>
  );
};

export default Header;
