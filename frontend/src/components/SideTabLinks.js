import HomePage from "../Pages/HomePage";
import { FaHome } from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { RiLogoutBoxFill } from "react-icons/ri";
import { IoAddCircleSharp } from "react-icons/io5";
import { MdExplore } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";

export const SideLinks = [
  {
    link: "/home",
    text: "Home",
    element: FaHome,
  },
  { link: "/explore", text: "Explore", element: MdExplore },
  {
    link: "/chat",
    text: "Chat",
    element: IoChatboxEllipses,
  },
  {
    link: "/profile",
    text: "Profile",
  },
  {
    link: "/create-post",
    text: "Create post",
    element: IoAddCircleSharp,
  },
  {
    link: "/notifications",
    text: "Notifications",
    element: IoIosNotifications,
    newNotification:true
  },
  {
    link: "/settings",
    text: "Settings",
    element: IoMdSettings,
  },
];
