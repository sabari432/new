import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';
const UsersEdit = () => {
  const { EMPID } = useParams();
  const [values, setValues] = useState({
    EMPID: "",
    EMPNAME: "",
    EMAIL: "",
    SYS_USER_NAME: "",
    UPDATED_BY: "" // Updated By field
  });

  const navigate = useNavigate();

  // State to store fetched designation categories
  const [designationCategories, setDesignationCategories] = useState([]);

  // Fetch designation categories on component mount
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

  // Fetch user data on component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    axios
      .get(`${API_BASE_URL1}/api/empdblogin.php?action=get_user&token=${token}`) // Use the token in the request
      .then(response => {
        if (response.data) {
          setValues(prevValues => ({
            ...prevValues,
            UPDATED_BY: response.data.EMPNAME // Set Updated By to the fetched name
          }));
        }
      })
      .catch(error => {
        console.error("There was an error fetching the user data!", error);
      });
  }, []);

  // Fetch employee data based on EMPID
  useEffect(() => {
    axios
      .get(`${API_BASE_URL1}/api/shiftsget.php?EMPID=${EMPID}`)
      .then(response => {
        if (response.data && response.data.data && response.data.data.length > 0) {
          setValues(prevValues => ({
            ...prevValues,
            ...response.data.data[0], // Only update the employee details
          }));
        }
      })
      .catch(error => {
        console.error("There was an error fetching the employee data!", error);
      });
  }, [EMPID]);

  const handleDiscard = () => {
    setValues({
      EMPID: "",
      EMPNAME: "",
      EMAIL: "",
      SYS_USER_NAME: "",
      UPDATED_BY: "" // Reset Updated By field
    });
    navigate('/users');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL1}/api/usersedit.php`, {
        ...values,
        ACTIVE_YN: values.ACTIVE_YN === "Y" ? "Y" : "N"
      })
      .then(response => {
        if (response.status === 200) {
          const { success, message } = response.data;
          if (success) {
            toast.success(message);
            setTimeout(() => {
              handleDiscard(); // Navigate after 3 seconds
            }, 3000);
          } else {
            toast.error("Error updating employee data.");
          }
        }
      })
      .catch(error => {
        console.error("There was an error updating the employee data!", error);
        toast.error("There was an error updating the employee data.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card w-75">
        <div className="card-header text-center bg-warning text-white">
          <h5 className="mb-0">Edit Employee</h5>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row mb-2 ms-2 me-2">
            <div className="col-sm-6 mt-2">
              <label htmlFor="empid" className="form-label">
                Emp_Id
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
                id="empid"
                name="EMPID"
                value={values.EMPID || ""}
                onChange={(e) => setValues({ ...values, EMPID: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="empname" className="form-label">
                Emp_Name
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
                id="empname"
                name="EMPNAME"
                value={values.EMPNAME || ""}
                onChange={(e) => setValues({ ...values, EMPNAME: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="sysUserName" className="form-label">
                System User Name
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
                name="SYS_USER_NAME"
                value={values.SYS_USER_NAME || ""}
                onChange={(e) => setValues({ ...values, SYS_USER_NAME: e.target.value })}
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
                className="form-control"
              />
            </div>







            <div className="col-sm-6 mt-2">
              <label htmlFor="updatedBy" className="form-label">
                Updated By
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
                name="UPDATED_BY"
                value={values.UPDATED_BY || ""}
                onChange={(e) => setValues({ ...values, UPDATED_BY: e.target.value })}
                className="form-control"
              />
            </div>
            
         
            <div className="col-sm-12 mt-2">
              <button className="btn btn-primary w-40">Save</button>
              <button
                type="button"
                className="btn btn-danger text-light w-40 ms-2"
                onClick={handleDiscard}
              >
                Discard
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default UsersEdit;