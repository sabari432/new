import React, { useState } from 'react';
import { Container, Navbar, Nav, Image, NavDropdown, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const DefaultLayout = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarVisible(prevState => !prevState);
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    navigate('/'); // Redirect to login page
  };

  const EMPNAME = localStorage.getItem('EMPNAME') || 'Guest';
  const EMPID = localStorage.getItem('EMPID') || '';

  const renderTooltip = (text) => (
    <Tooltip id={`tooltip-${text}`}>
      {text}
    </Tooltip>
  );

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav
        className={`sidebar d-flex flex-column p-3 position-fixed ${isSidebarVisible ? '' : 'd-none d-md-block'}`}
        style={{
          backgroundColor: '#FFFBF5',
          minHeight: '100vh',
          width: isSidebarVisible ? '250px' : '80px',
          transition: 'width 0.3s',
        }}
      >
        <div className="sidebar-brand d-flex flex-column align-items-center justify-content-center mb-4">
          <Button
            variant="outline-secondary"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <i className="bi bi-list"></i> {/* Menu Icon */}
          </Button>
          <Image
            src={require('../Images/logo.png')}
            width={isSidebarVisible ? '150' : '40'}
            alt="Logo"
            className="mb-3,me-3"
              
          />
          {isSidebarVisible && <h1 className="h5 text-center">Productivity Management</h1>}
        </div>
        <ul className="nav flex-column">
  {[
    { to: "/dashboard", icon: "bi-house-door-fill", label: "Dashboard" },
    { to: "/timeline", icon: "bi-bar-chart-fill", label: "Timeline" },
    { to: "/productive", icon: "bi-graph-up-arrow", label: "Productive" },
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
        <OverlayTrigger placement="right" overlay={renderTooltip(item.label)}>
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
        <Navbar expand="lg" sticky="top" className="shadow-sm mb-4" style={{ backgroundColor: '#FFFBF5', marginLeft: isSidebarVisible ? '250px' : '80px', transition: 'margin-left 0.3s' }}>
          <Container fluid>
            <Button
              variant="outline-secondary"
              className="d-lg-none me-2"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <i className="bi bi-list"></i> {/* Menu Icon */}
            </Button>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav" className="justify-content-end">
              <Nav>
                <Navbar.Text className="me-4">Welcome {EMPNAME}!</Navbar.Text>
                <Navbar.Text className="me-4">{EMPID}</Navbar.Text>
                <NavDropdown
                  title={
                    <Image
                      src={require('../Images/userimageicon.png')}
                      roundedCircle
                      width="40"
                    />
                  }
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Main Body Content */}
        <Container fluid className="flex-grow-1">
          {children}
        </Container>

        {/* Footer */}
        <footer className="bg-light text-center py-3">
          <Container>
            <span>Powered by PMS</span>
          </Container>
        </footer>
      </div>
    </div>
  );
};

export default DefaultLayout; 