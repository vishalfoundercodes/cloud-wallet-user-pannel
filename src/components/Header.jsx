import React, { useContext, useEffect, useRef, useState } from "react";
import logo from '../assets/logo.png'
import { Bell, User, Moon, Sun, ArrowDownNarrowWide, Download } from "lucide-react";
import { Link } from 'react-router-dom';
import { ThemeContext } from "../context/ThemeContext";
import axios from "axios";
import apis from "../utils/apis";

const Header = ({profile}) => {
    const user_id = localStorage.getItem("user_id");
    // console.log(profile)
    const { theme, toggleTheme } = useContext(ThemeContext);
     const [notifications, setNotifications] = useState([]);
  
     const [showDropdown, setShowDropdown] = useState(false);
const dropdownRef = useRef(null);
   const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        
        app_link: "",
      });

      
   const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${apis?.get_profile}?user_id=${user_id}`
      );

      if (response.data?.status && response.data.profile) {
        const profile = response.data.profile;
        console.log(profile)
        setUserData({
          app_link: profile?.apk_link || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

 const handleDownload = () => {
  if (userData.app_link) {
    const link = document.createElement("a");
    link.href = userData.app_link;
    link.download = "cloudwallet.apk"; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("No APK link found");
  }
};

const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apis?.user_notifications}?user_id=${user_id}`
      );
      console.log(`${apis?.user_notifications}?user_id=${user_id}`);
      if (response.data.success && Array.isArray(response.data.data)) {
        console.log(response.data.data);
        setNotifications(response.data.data);
      } else {
        console.error("Failed to load notifications.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    const newState = !showDropdown;
    setShowDropdown(newState);
    if (newState && notifications.length === 0) {
      fetchNotifications();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <>
        <div className="flex h-20 items-center justify-center border-b border-gray-200 bg-white shadow-sm dark:bg-richblack-900
           dark:text-richblack-25 dark:border-richblack-500">
            <div className="flex w-11/12 max-w-6xl items-center justify-between">
                {/* Left section */}
              

                <Link to="/profile" className="flex items-center space-x-3 cursor-pointer">
                <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                <div className="leading-tight">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-richblack-25">
                    CloudWallet
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-richblack-25">
                    Welcome back, {profile?.name || "Your Name"}
                    </p>
                </div>
                </Link>


                {/* Right section (future use like profile / logout button) */}
                <div className='flex'>
                    {/* Download Button */}
                    {userData.app_link && (
                    // <a href={userData.app_link} download target="_blank" rel="noopener noreferrer">
                    // <a href={userData.app_link} download rel="noopener noreferrer">
                    // <a href={userData.app_link} download>
                    //     <button
                    //     className="px-2 sm:px-4 py-2 text-[#525252] dark:text-richblack-25 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:text-richblack-900 transition cursor-pointer"
                    //     >
                    //     <Download size={22} />
                    //     </button>
                    // </a>

                    
                    <button
                      onClick={handleDownload}
                      className="px-2 sm:px-4 py-2 text-[#525252] dark:text-richblack-25 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:text-richblack-900 transition cursor-pointer"
                    >
                      <Download size={22} />
                      
                    </button>


                    )}

                    {/* <button
                        className="px-2 sm:px-4 py-2 text-[#525252] dark:text-richblack-25 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:text-richblack-900 transition cursor-pointer">
                        <Bell size={22} />
                    </button> */}
                    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleClick}
        className="px-2 sm:px-4 py-2 text-[#525252] dark:text-richblack-25 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:text-richblack-900 transition cursor-pointer"
      >
        <Bell size={22} />
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-60 max-h-80 overflow-auto z-50 bg-white dark:bg-richblack-800 shadow-lg border border-gray-200 dark:border-richblack-700 rounded-md">
          <div className="p-3  border-b text-sm font-semibold text-gray-700 dark:text-richblack-100">
            Notifications
          </div>

          {loading ? (
            <div className="p-3 text-sm text-gray-500 dark:text-richblack-300">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-3 text-sm text-gray-500 dark:text-richblack-300">
              No notifications found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-richblack-700">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className="relative p-3 pr-20 text-sm text-gray-700 dark:text-richblack-100 border-b last:border-b-0 border-gray-100 dark:border-richblack-700"
                > 
                {console.log(notif)}
                  {/* Date top-right */}
                  <div className="absolute top-1 right-3 text-[10px] text-gray-400 dark:text-richblack-400">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </div>

                  {/* Bold description */}
                  <div className="font-semibold text-gray-800 dark:text-richblack-50">
                    {notif.description}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
                    {/* Theme Toggle */}
                    {/* <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        {theme === "light" ? (
                        <Moon size={22} className="text-gray-700" />
                        ) : (
                        <Sun size={22} className="text-yellow-400" />
                        )}
                    </button> */}
                    {/* <Link to="/profile">
                        <button 
                            className="px-4 py-2 text-[#525252] dark:text-richblack-25 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:text-richblack-900 transition cursor-pointer">
                            <User size={22} />
                        </button>
                    </Link> */}
                    {/* <button 
                        className="px-4 py-2 text-[#525252] dark:text-richblack-25 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:text-richblack-900 transition cursor-pointer">
                       <Link to="/">
                        <ArrowDownNarrowWide size={22} />
                       </Link>
                    </button> */}
                </div>
            </div>
        </div>
    </>
  )
}

export default Header