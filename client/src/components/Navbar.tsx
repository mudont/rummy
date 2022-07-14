import {
  Navbar,
  Dropdown,
  Avatar,
  Flowbite,
  DarkThemeToggle,
} from "flowbite-react";
//import * as cards from "./cards";
const component = () => (
  <Navbar className="hidden" fluid={true} rounded={true}>
    <Navbar.Brand href="/">
      <img src="/favicon.ico" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
      {/* <div
        className="mr-0 h-6 sm:h-9"
        style={{ transform: "scale(0.12)", transformOrigin: "top left" }}
      >
        <cards.DK />
      </div> */}

      {/* img
        src="https://flowbite.com/docs/images/logo.svg"
        className="mr-3 h-6 sm:h-9"
        alt="Flowbite Logo"
      /> */}
      {/* <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        Rummy
      </span> */}
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
      <Navbar.Link href="https://ex1.cmhackers.com/api/auth/login">
        Login
      </Navbar.Link>
      <Navbar.Link href="/users">Users</Navbar.Link>
      {/* Reacct-router Link seems to be equivalent to Navbar.Link 
          should prefer Navbar for 
      <Link to="/users">Users</Link>
      */}
    </Navbar.Collapse>
  </Navbar>
);
export default component;
