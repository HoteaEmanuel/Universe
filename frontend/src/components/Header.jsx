
import Logo from "./Logo";
import Nav from "./Nav";
const Header = () => {
  return (
    <div className="header w-full h-full shadow-md  bg-linear-to-r flex items-center px-2 justify-between">
      <Logo />
      <Nav/>
    </div>
  );
};

export default Header;
