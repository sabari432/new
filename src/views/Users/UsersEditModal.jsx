import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const UsersEditModal = () => {
  const { EMPID } = useParams(); // Get EMPID from route parameters
  const [employeeData, setEmployeeData] = useState({
    empid: '',
    empname: '',  
    email: '',
    sysUserName: '',
    role: '',
    reporting1: '',
    reporting2: '',
    department: '',
    team: '',
    project: '',
    shift: '',
    allotedBreak: '',
    activeYn: false,
    holidayCountry: '',
    region: '',
    updatedBy: ''
  }); // Initialize state for employee data
  const [showModal, setShowModal] = useState(true); // Manage modal visibility
  const navigate = useNavigate();

  // Fetch employee data on component mount
  useEffect(() => {
    if (EMPID) {
      axios
        .get(`${API_BASE_URL1}/api/fetch_data1.php?EMPID=${EMPID}`)
        .then((response) => {
          if (response.data.success && response.data.data) {
            setEmployeeData(response.data.data);
          } else {
            toast.error('Employee not found');
          }
        })
        .catch((error) => {
          console.error('Error fetching employee data', error);
          toast.error('Failed to fetch employee data');
        });
    }
  }, [EMPID]);

  // Handle form input change and update the employeeData state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const submitUser = () => {
    axios
    .post(`${API_BASE_URL1}/api/edituser.php`, employeeData)
      .then((response) => {
        if (response.data.success) {
          toast.success('Employee data updated successfully');
          setShowModal(false); // Close modal after successful submission
          navigate('/users'); // Redirect to user list
        } else {
          toast.error(`Error: ${response.data.error}`);
        }
      })
      .catch((error) => {
        console.error('Submit Error:', error);
        toast.error('An error occurred while submitting the data');
      });
  };

  // Handle form reset and modal close
  const handleDiscard = () => {
    setEmployeeData({
      empid: '',
      empname: '',
      email: '',
      sysUserName: '',
      role: '',
      reporting1: '',
      reporting2: '',
      department: '',
      team: '',
      project: '',
      shift: '',
      allotedBreak: '',
      activeYn: false,
      holidayCountry: '',
      region: '',
      updatedBy: ''
    });
    setShowModal(false); // Close modal
    navigate('/users'); // Redirect to user list
  };

  return (
    <>
      <ToastContainer />
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
  <Modal.Header closeButton className="bg-warning text-white">
    <Modal.Title>Edit Employee</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="row">
      {/* Form fields */}
      <div className="col-sm-6 mt-2">
        <label htmlFor="empId" className="form-label">
          Employee ID
        </label>
        <input
          type="text"
          id="empId"
          name="empid"
          value={employeeData.empid}
          onChange={handleInputChange}
          className="form-control"
          disabled
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="empName" className="form-label">
          Employee Name
        </label>
        <input
          type="text"
          id="empName"
          name="empname"
          value={employeeData.empname}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={employeeData.email}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="sysUserName" className="form-label">
          System User Name
        </label>
        <input
          type="text"
          id="sysUserName"
          name="sysUserName"
          value={employeeData.sysUserName}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="role" className="form-label">
          Role
        </label>
        <input
          type="text"
          id="role"
          name="role"
          value={employeeData.role}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="reporting1" className="form-label">
          Reporting 1
        </label>
        <input
          type="text"
          id="reporting1"
          name="reporting1"
          value={employeeData.reporting1}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="reporting2" className="form-label">
          Reporting 2
        </label>
        <input
          type="text"
          id="reporting2"
          name="reporting2"
          value={employeeData.reporting2}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="department" className="form-label">
          Department
        </label>
        <input
          type="text"
          id="department"
          name="department"
          value={employeeData.department}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="team" className="form-label">
          Team
        </label>
        <input
          type="text"
          id="team"
          name="team"
          value={employeeData.team}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="project" className="form-label">
          Project
        </label>
        <input
          type="text"
          id="project"
          name="project"
          value={employeeData.project}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="shift" className="form-label">
          Shift
        </label>
        <input
          type="text"
          id="shift"
          name="shift"
          value={employeeData.shift}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="allotedBreak" className="form-label">
          Alloted Break
        </label>
        <input
          type="text"
          id="allotedBreak"
          name="allotedBreak"
          value={employeeData.allotedBreak}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="activeYn" className="form-label">
          Active
        </label>
        <input
          type="checkbox"
          id="activeYn"
          name="activeYn"
          checked={employeeData.activeYn}
          onChange={(e) =>
            handleInputChange({
              target: {
                name: "activeYn",
                value: e.target.checked,
              },
            })
          }
          className="form-check-input"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="holidayCountry" className="form-label">
          Holiday Country
        </label>
        <input
          type="text"
          id="holidayCountry"
          name="holidayCountry"
          value={employeeData.holidayCountry}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>

      <div className="col-sm-6 mt-2">
        <label htmlFor="region" className="form-label">
          Region
        </label>
        <input
          type="text"
          id="region"
          name="region"
          value={employeeData.region}
          onChange={handleInputChange}
          className="form-control"
        />
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer>
    <button type="button" className="btn btn-danger" onClick={handleDiscard}>
      Discard
    </button>
    <button type="button" className="btn btn-primary" onClick={submitUser}>
      Save Changes
    </button>
  </Modal.Footer>
</Modal>
    </>
  );
};

export default UsersEditModal;
