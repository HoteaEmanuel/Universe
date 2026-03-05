import { RiLogoutBoxFill } from "react-icons/ri";
import { useAuthStore } from "../store/authStore";
import { NavLink } from "react-router-dom";
import { SideLinks } from "./SideTabLinks";
import { RiAdminFill } from "react-icons/ri";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo_1.png";
import { useGetUnreadNotifications } from "../queryAndMutation/queries/notifications-queries";
import { useGlobalStore } from "../store/globalStore";
const SideSection = () => {
  const pathname = useLocation();
  const { notificationsOn } = useGlobalStore();
  const { user, logOut } = useAuthStore();
  console.log("USER IN SIDE SECTION", user);
  useEffect(() => {
    if (user.role === "admin") {
      SideLinks.splice(4, 0, {
        link: "/admin",
        text: "Admin",
        element: RiAdminFill,
      });
    }
  }, [user.role]);
  const { data: notifications, isPending } = useGetUnreadNotifications(
    user._id,
  );
  if (isPending) return <h1>Loading...</h1>;

  console.log("NOTIFICATION IN SIDESECTION: ", notifications);

  return (
    <aside className="sideTab flex flex-col items-center justify-center w-1/4 h-screen hidden md:block shadow overflow-hidden">
      <div className="w-full flex items-center justify-center px-2 mb-20">
        <img src={logo} alt="logo" className="w-20 h-20" />
        <h1 className="text-3xl px-5 rotate-x-0 gradient-text-light md:text-2xl">
          Universe
        </h1>
      </div>
      {/* <ProfileCard user={user} /> */}
      <ul className="w-full flex flex-col justify-center items-center gap-2 mt-5 mb-5 h-2/3">
        {SideLinks.map((item) => {
          const isActive = pathname.pathname === item.link;
          return (
            <li key={item.link} className="w-full flex group">
              <NavLink
                to={item.link}
                className={`w-full flex flex-col items-center justify-center p-4 cursor-pointer ${
                  !isActive && "onHoverMenu"
                } ${isActive ? " active " : undefined}`}
              >
                <div className="icon-text-sm flex items-center w-1/2 text-sm md:text-md md:font-semibold cursor-pointer group violet">
                  {item.text !== "Profile" ? (
                    <div className="relative flex">
                      <item.element
                        className={`size-8 mr-4 violet ${isActive && "active"}`}
                      />
                      {notificationsOn &&
                        item.newNotification &&
                        notifications?.length > 0 && (
                          <div className="absolute top-2 right-2 size-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                            {notifications.length}
                          </div>
                        )}
                    </div>
                  ) : user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      className="main-dark size-10 rounded-full mr-4"
                    />
                  ) : (
                    <FaUserCircle className="main-dark size-10 mr-4  violet" />
                  )}
                  <span className={`${isActive && "active"}`}>{item.text}</span>
                </div>
              </NavLink>
            </li>
          );
        })}
        <li className="w-1/5 translate-y-5">
          <button onClick={() => logOut()} className="hover:scale-110">
            <RiLogoutBoxFill className="violet size-8" />
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default SideSection;
