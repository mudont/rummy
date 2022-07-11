import {
  Navbar,
  Dropdown,
  Avatar,
  Flowbite,
  DarkThemeToggle,
} from "flowbite-react";
import { Link } from "react-router-dom";
const component = () => (
  <Navbar fluid={true} rounded={true}>
    <Navbar.Brand href="https://flowbite.com/">
      <img
        src="https://flowbite.com/docs/images/logo.svg"
        className="mr-3 h-6 sm:h-9"
        alt="Flowbite Logo"
      />
      <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        Flowbite
      </span>
    </Navbar.Brand>
    <div className="flex md:order-2">
      <Flowbite>
        <DarkThemeToggle />
      </Flowbite>
      <Dropdown
        arrowIcon={false}
        inline={true}
        label={
          <Avatar
            alt="User settings"
            img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            rounded={true}
          />
        }
      >
        <Dropdown.Header>
          <span className="block text-sm">Bonnie Green</span>
          <span className="block truncate text-sm font-medium">
            name@flowbite.com
          </span>
        </Dropdown.Header>
        <Dropdown.Item>Dashboard</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Item>Earnings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Sign out</Dropdown.Item>
      </Dropdown>
      <Navbar.Toggle />
    </div>
    <Navbar.Collapse>
      <Navbar.Link href="/" active={true}>
        Home
      </Navbar.Link>
      <Navbar.Link href="/navbars">About</Navbar.Link>
      <Navbar.Link href="https://ex1.cmhackers.com/api/auth/login">
        Login
      </Navbar.Link>
      <Navbar.Link href="/users">UsersNav</Navbar.Link>
      {/* Reacct-router Link seems to be equivalent to Navbar.Link 
          should prefer Navbar for 
      */}
      <Link to="/users">Users</Link>
    </Navbar.Collapse>
  </Navbar>
);
export default component;
