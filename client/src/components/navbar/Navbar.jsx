import "./navbar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
//import defaultProfilePic from "../../assets/default-profile.png"; // Add your default profile image here

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);

  // Logout function that clears the user session
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); // Dispatch the LOGOUT action
    localStorage.removeItem("user"); // Remove the user from localStorage
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo">BookMyStay</span>
        </Link>
        {user ? (
          <div className="navItems">
            {/* Profile Section */}
            <div className="profile">
              <Link to="/">
                <img
                  className="profileImage"
                  src={user.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} // Use profile picture if available
                  alt="Profile"
                />
              </Link>
              <span className="navUsername">{user.username}</span>
            </div>
            <button className="navButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navItems">
            <button className="navButton">Register</button>
            <Link to="/login">
              <button className="navButton">Login</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
