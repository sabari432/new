import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';


const UsersAdd = ({
  showModal,
  setShowModal,
  formData,
  handleInputChange,
  resetForm,
  errors
}) => {
  const [designationCategories, setDesignationCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL1}/api/designation_categoryfetch_data1.php`)
      .then((response) => {
        if (response.data.DESIGNATION_CATEGORY) {
          setDesignationCategories(response.data.DESIGNATION_CATEGORY);
        } else {
          toast.error('Failed to fetch designation categories');
        }
      })
      .catch((error) => {
        console.error('Error fetching designation categories:', error);
        toast.error('An error occurred while fetching designation categories.');
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`${API_BASE_URL1}/api/empdblogin.php?action=get_user&token=${token}`)
      .then(response => {
        if (response.data) {
          // Update the formData state with the fetched name
          handleInputChange({
            target: {
              name: 'updatedBy',
              value: response.data.EMPNAME // Set Updated By to the fetched name
            }
          });
        }
      })
      .catch(error => {
        console.error("There was an error fetching the user data!", error);
      });
  }, [handleInputChange]);

  const submitUser = () => {
    const postData = {
      empid: formData.empId,
      empname: formData.empName,
      email: formData.email,
      sysUserName: formData.sysUserName,
      role: formData.role,
      designationcategory: formData.designationcategory,
      requiredproductivehrs: formData.requiredproductivehrs,
      reporting1: formData.reporting1,
      reporting2: formData.reporting2,
      department: formData.department,
      team: formData.team,
      project: formData.project,
      shift: formData.shift,
      allotedBreak: formData.allotedBreak,
      activeYn: formData.activeYn ? "Y" : "N",
      holidayCountry: formData.holidayCountry,
      region: formData.region,
      updatedBy: formData.updatedBy,
    };

    axios.post(`${API_BASE_URL1}/api/usersadd.php`, postData)
      .then((response) => {
        if (response.data.success) {
          toast.success('Employee added successfully');
          resetForm();
          setShowModal(false);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else {
          toast.error(`Error: ${response.data.error}`);
        }
      })
      .catch((error) => {
        toast.error('An error occurred while submitting the data.');
        console.error('Submit Error:', error);
      });
  };

  return (
    <>
      {/* Toast notification container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mt-2">
            {/* Form fields */}
            <div className="col-sm-6 mt-2">
              <label htmlFor="empId" className="form-label">Employee ID
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="empId"
                name="empId"
                value={formData.empId || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="empName" className="form-label">Employee Name
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="empName"
                name="empName"
                value={formData.empName || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="email" className="form-label">Email
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="sysUserName" className="form-label">System User Name
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="sysUserName"
                name="sysUserName"
                value={formData.sysUserName || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="role" className="form-label">Designation
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
               {/* Designation Category Dropdown */}
               <div className="col-sm-6 mt-2">
                <label htmlFor="designationcategory" className="form-label">
                  Designation Category
                  <span
                    data-toggle="tooltip"
                    title="This is your default time zone."
                    className="ms-1"
                  >
                    <i className="bi bi-exclamation-circle"></i>
                  </span>
                </label>
                <div className="input-group">
                  <select
                    id="designationcategory"
                    name="designationcategory"
                    value={formData.designationcategory || ""}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Select Designation Category</option>
                    {designationCategories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Or enter a custom value"
                    value={formData.designationcategory || ""}
                    onChange={(e) => handleInputChange(e, true)} // Pass true to indicate custom input
                    className="form-control"
                  />
                </div>
              </div>


              <div className="col-sm-6 mt-2">
              <label htmlFor="requiredproductivehrs" className="form-label">Required_Productive_Hrs
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
              type="time"
              id="requiredproductivehrs"
              name="requiredproductivehrs"
              value={formData.requiredproductivehrs || ""}
              onChange={handleInputChange}
              className="form-control"
              />
              </div>
         
            
            <div className="col-sm-6 mt-2">
              <label htmlFor="reporting1" className="form-label">Reporting 1
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="reporting1"
                name="reporting1"
                value={formData.reporting1 || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="reporting2" className="form-label">Reporting 2
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="reporting2"
                name="reporting2"
                value={formData.reporting2 || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="department" className="form-label">Department
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="team" className="form-label">Team
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="team"
                name="team"
                value={formData.team || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="project" className="form-label">Project
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="project"
                name="project"
                value={formData.project || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="holidayCountry" className="form-label">Holiday Country
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="holidayCountry"
                name="holidayCountry"
                value={formData.holidayCountry || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="region" className="form-label">Region
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="allotedBreak" className="form-label">Allotted Break
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="time"
                id="allotedBreak"
                name="allotedBreak"
                value={formData.allotedBreak || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
       
            <div className="col-sm-6 mt-2">
              <label htmlFor="updatedBy" className="form-label">Updated By
              <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="updatedBy"
                name="updatedBy"
                value={formData.updatedBy || ""}
                onChange={handleInputChange}
                className="form-control"
                readOnly // Optional: make it read-only if you don't want to allow editing
              />
            </div>

            {/* Active checkbox */}
            <div className="col-sm-6 mt-2">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="activeYn"
                  name="activeYn"
                  checked={formData.activeYn || false}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="activeYn">Active
                <span
          data-toggle="tooltip"
          title="This is your default time zone."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
                </label>
              </div>
            </div>

            {/* Buttons for submit and discard */}
            <div className="col-sm-12 mt-2">
              <button className="btn btn-primary w-40 ms-2 mb-2" onClick={submitUser}>
                Submit
              </button>
              <button
                className="btn btn-danger text-light w-40 ms-2 mb-2"
                onClick={() => {
                  resetForm(); // Clear input fields
                  setShowModal(false); // Close modal
                }}
              >
                Discard
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UsersAdd; 