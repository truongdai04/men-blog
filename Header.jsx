import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useNavigate } from 'react-router-dom';

export default function Header() {
  // eslint-disable-next-line no-unused-vars
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigate('/sign-in');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className="w-full mt-1 flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-purple-600 dark:text-white">
          <span className="ml-20 px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Sahand's</span>
          Blog
        </Link>
      </div>

      {/* Search Bar and Navigation Links in the middle */}
      <div className="flex-grow flex items-center justify-center space-x-8 mx-4">
        <form className="flex justify-center">
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="w-50 sm:w-40 md:w-60 bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
          />
        </form>
        {/* Navigation Links */}
        <div className="space-x-16 pr-40 hidden sm:flex">
          <Link to="/home" className="text-xl text-purple-700 hover:text-purple-500 dark:text-white dark:hover:text-gray-300">
            Home
          </Link>
          <Link to="/about" className="text-xl text-black hover:text-purple-500 dark:text-white dark:hover:text-gray-300">
            About
          </Link>
          <Link to="/project" className="text-xl text-black hover:text-purple-500 dark:text-white dark:hover:text-gray-300">
            Project
          </Link>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <Button
        className="w-12 h-10 ml-4 border-2 border-purple-500 rounded-full"
        color="gray"
        pill
        onClick={() => dispatch(toggleTheme())}
      >
        {theme === 'light' ? <FaSun /> : <FaMoon />}
      </Button>

      {/* User or Sign-in Button */}
      <div className="ml-20">
        {currentUser ? (
          // Nếu currentUser tồn tại, hiển thị Dropdown User Menu
          <Dropdown arrowIcon={false} inline label={
            <Avatar
              alt="user"
              img={currentUser.profilePicture || 'avt.png'}
              rounded
              className="cursor-pointer"
            />
          }>
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          // Nếu currentUser không tồn tại, hiển thị nút "Sign in"
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </Navbar>
  );
}
