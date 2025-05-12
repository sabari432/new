import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const ShiftsEdit = ({ showModal, setShowModal, resetForm }) => {
  const { EMPID } = useParams(); // Extract EMPID from the route parameter
  const [values, setValues] = useState({
    EMPID: "",
    EMPNAME: "",
    SYS_USER_NAME: "",
    SHIFTTYPE: "",
    SHIFT_START_TIME: "",
    SHIFT_END_TIME: "",
    SHIFTSTART_DT: "",
    SHIFTEND_DT: "",
    TIME_ZONE: "",
    WEEKOFF: "",
    COMMENTS: ""
  }); // State to hold the employee data
  const navigate = useNavigate();

  // Function to handle changes in the input fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Update the form data state with the new input value
    setValues((prevData) => ({
      ...prevData,
      [name]: value, // Update the corresponding field in formData
    }));
  };

  // Fetch employee data based on EMPID
  useEffect(() => {
    axios
      .get(`${API_BASE_URL1}/api/shiftsget.php?EMPID=${EMPID}`)
      .then((response) => {
        if (response.data) {
          setValues(response.data); // Set employee's data
        }
      })
      .catch((error) => {
        console.error("Error fetching the employee data!", error);
      });
  }, [EMPID]);

  // Handle form submission: POST data and navigate to /users on success
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL1}/api/shifts.php/`, values)
      .then((response) => {
        if (response.status === 200) {
          toast.success('Employee data updated successfully!');
          resetForm();
          navigate('/users'); // Redirect to the user-index page
        }
      })
      .catch((error) => {
        toast.error('Error updating employee data!');
        console.error('Error updating the employee data!', error);
      });
  };

  const handleDiscard = () => {
    resetForm(); // Clear input fields
    navigate('/shifts'); // Redirect to the user-index page
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card w-75">
        <div className="card-header text-center bg-warning text-white">
          <h5 className="mb-0">Edit Employee</h5>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row mt-2">
            <div className="col-sm-6 mt-2">
              <label htmlFor="EMPID" className="form-label">Employee ID
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="EMPID"
                name="EMPID"
                value={values.EMPID || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="EMPNAME" className="form-label">Employee Name
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="EMPNAME"
                name="EMPNAME"
                value={values.EMPNAME || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="SYS_USER_NAME" className="form-label">System User Name
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="SYS_USER_NAME"
                name="SYS_USER_NAME"
                value={values.SYS_USER_NAME || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            
            <div className="col-sm-6 mt-2">
              <label htmlFor="shifttype" className="form-label">Shift Type
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <select   type="text"
                id="SHIFTTYPE"
                name="SHIFTTYPE"
                value={values.SHIFTTYPE || ""}
                onChange={handleInputChange}
                className="form-control">
                <option value="">Select Shift Type</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="SHIFT_START_TIME" className="form-label">Shift Start Time
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="time"
                id="SHIFT_START_TIME"
                name="SHIFT_START_TIME"
                value={values.SHIFT_START_TIME || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="SHIFT_END_TIME" className="form-label">Shift End Time
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="time"
                id="SHIFT_END_TIME"
                name="SHIFT_END_TIME"
                value={values.SHIFT_END_TIME || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="SHIFTSTART_DT" className="form-label">Shift Start Date
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <Flatpickr
                className="form-control"
                value={values.SHIFTSTART_DT || ""}
                onChange={(date) => setValues({ ...values, SHIFTSTART_DT: date })}
                options={{ dateFormat: "d-m-Y" }}
                placeholder="Select Start Date"
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="SHIFTEND_DT" className="form-label">Shift End Date
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <Flatpickr
                className="form-control"
                value={values.SHIFTEND_DT || ""}
                onChange={(date) => setValues({ ...values, SHIFTEND_DT: date })}
                options={{ dateFormat: "d-m-Y" }}
                placeholder="Select End Date"
              />
            </div>

           

            <div className="col-sm-6 mt-2">
              <label htmlFor="timeZone" className="form-label">Time Zone
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
              type="text"
              id="TIME_ZONE"
              name="TIME_ZONE"
              value="Asia/Kolkata"  // Set initial value
              readOnly  // Make the input read-only
              className="form-control"
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="WEEKOFF" className="form-label">Week Off
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <select
                id="WEEKOFF"
                name="WEEKOFF"
                value={values.WEEKOFF || ""}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Week Off</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="COMMENTS" className="form-label">Comments
              <span
          data-toggle="tooltip"
          title="Enter your Employee ID as provided by your organization."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
              </label>
              <input
                type="text"
                id="COMMENTS"
                name="COMMENTS"
                value={values.COMMENTS || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="col-sm-12 mt-2">
              <button type="submit" className="btn btn-primary w-40 ms-2 mb-2">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-danger text-light w-40 ms-2 mb-2"
                onClick={handleDiscard}
              >
                Discard
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ShiftsEdit;
