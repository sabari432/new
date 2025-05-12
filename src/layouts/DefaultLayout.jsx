import React, { useState } from 'react';
import { Container, Navbar, Nav, Image, NavDropdown, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const DefaultLayout = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarVisible(prevState => !prevState);
  };

  const handleLogout = () => {
    localStorage.clear(); // This clears all local storage items at once
    {/*localStorage.removeItem('token');
    localStorage.removeItem('EMPNAME');
    localStorage.removeItem('EMPID');
    localStorage.removeItem('empid');
    localStorage.removeItem('empname');
    localStorage.removeItem('department');
    localStorage.removeItem('shift');
    localStorage.removeItem('role');
    localStorage.removeItem('team');
    localStorage.removeItem('project');
    localStorage.removeItem('designationcategory');
    localStorage.removeItem('PASSWORD');
            localStorage.removeItem('ACCESS_ROLE');
            localStorage.removeItem('REGION');
            localStorage.removeItem('PROJECT');
            localStorage.removeItem('TEAM');
            localStorage.removeItem('DEPARTMENT');
            localStorage.removeItem('DESIGNATION_CATEGORY');
            localStorage.removeItem('ROLE');
            localStorage.removeItem('SYS_USER_NAME');
            localStorage.removeItem('EMAIL');
            */}
    navigate('/'); // Redirect to login page
  };

  const EMPNAME = localStorage.getItem('EMPNAME') || 'Guest';
  const EMPID = localStorage.getItem('EMPID') || '';
  const ACCESS_ROLE = localStorage.getItem('ACCESS_ROLE');


  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {/* Sidebar */}
      <nav
        className={`sidebar d-flex flex-column p-3 ${isSidebarVisible ? '' : 'd-none d-md-block'}`}
        style={{
          backgroundColor: '#FFFBF5',
          height: '100vh', // Full height of the viewport
          width: isSidebarVisible ? '250px' : '80px',
          transition: 'width 0.3s',
          overflowY: 'hidden', // Prevent sidebar scrolling
        }}
      >
        <div className="sidebar-brand d-flex flex-column align-items-center justify-content-center mb-4">
          <Image
            src={require('../Images/logo.png')}
            width={isSidebarVisible ? '150' : '70'}
            alt="Logo"
            className="mb-3"
          />
          {isSidebarVisible && <h1 className="h5 text-center"></h1>}
        </div>
        <ul className="nav flex-column">
        {[
            { to: "/dashboard", icon: "bi-house-door-fill", label: "Dashboard" },
            // Conditionally render these items based on ACCESS_ROLE
            ...(ACCESS_ROLE !== "EXECUTIVE" ? [
              { to: "/timeline", icon: "bi-bar-chart-fill", label: "Timeline" },
              { to: "/productive", icon: "bi-graph-up-arrow", label: "Productive" },
            ] : []),
            { to: "/users", icon: "bi-people-fill", label: "Users" },
            { to: "/shifts", icon: "bi-journal-text", label: "Shifts" },
          ].map((item, index) => (
            <li className="nav-item mb-2" key={index}>
              {isSidebarVisible ? (
                <Link className="nav-link text-dark" to={item.to}>
                  <i className={`bi ${item.icon} me-2`}></i>
                  {item.label}
                </Link>
              ) : (
                <OverlayTrigger placement="right" overlay={<Tooltip>{item.label}</Tooltip>}>
                  <Link className="nav-link text-dark" to={item.to}>
                    <i className={`bi ${item.icon} me-2`}></i>
                  </Link>
                </OverlayTrigger>
              )}
            </li>
          ))}
          <li className="nav-item mb-2">
            <Button variant="link" className="nav-link text-dark" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i> {isSidebarVisible && 'Logout'}
            </Button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Header */}
        <Navbar expand="lg" sticky="top" className="shadow-sm mb-4" style={{ backgroundColor: '#FFFBF5' }}>
          <Container fluid>
            <Button
              variant="outline-secondary"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <i className="bi bi-list"></i> {/* Menu Icon */}
            </Button>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav" className="justify-content-end">
              <Nav>
              <div className= "col">      
                <div className="col-sm-12 mt-2">

                <Navbar.Text className="mt-2">Welcome {EMPNAME}!</Navbar.Text> 
                   </div>
                <div className="col-sm-2 ms-4"> 
                <Navbar.Text className="mt-2" >{ACCESS_ROLE}</Navbar.Text>
                  
                </div>

         </div>
                

                <NavDropdown
                  title={
                    <Image
                      src={require('../Images/userimageicon.png')}
                      roundedCircle
                      width="40"
                    />
                  }
                  id="basic-nav-dropdown"
                  align="end" // Aligns dropdown to the right of the icon
                    className="dropdown-menu-end" // Ensures the dropdown aligns correctly
                >
                  <NavDropdown.Item as={Link} to="/Profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Main Body Content */}
        <Container fluid className="flex-grow-1 overflow-auto" style={{ overflowY: 'auto' }}>
          {children}
        </Container>

        {/* Footer */}
        <footer className="bg-light text-center py-3">
          <Container>
            <span>
            {' '}
              <a href="" target="_blank" rel="noreferrer"></a>
            </span>
          </Container>
        </footer>
      </div>
    </div>
  );
};

export default DefaultLayout;
