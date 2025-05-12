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
    const navigate = useNavigate();

    const [values, setValues] = useState({
      EMPID: "",
      EMPNAME: "",
      EMAIL: "",
      SYS_USER_NAME: "",
      UPDATED_BY: "",
      SHIFTTYPE: "",
      ALLOTED_BREAK: "",
      REQUIRED_PRODUCTIVE_HRS: "",
      ACTIVE_YN: "",
      WEEKOFF: "",
      COMMENTS: "",
      SHIFT_START_TIME: "",
      SHIFT_END_TIME: "",
      SHIFTSTART_DT: null,
      SHIFTEND_DT: null,
      TIME_ZONE: "Asia/Kolkata"  // Initialize TIME_ZONE in state
    });

    // Fetch employee data based on EMPID
    useEffect(() => {
      axios
        .get(`${API_BASE_URL1}/api/ShiftsCome.php?EMPID=${EMPID}`)
        .then(response => {
          if (response.data) {
            setValues({
              ...values,
              EMPID: response.data.EMPID,
              EMPNAME: response.data.EMPNAME,
              EMAIL: response.data.EMAIL,
              SYS_USER_NAME: response.data.SYS_USER_NAME,
              UPDATED_BY: response.data.UPDATED_BY,
              SHIFTTYPE: response.data.SHIFTTYPE,
              ALLOTED_BREAK: response.data.ALLOTED_BREAK,
              REQUIRED_PRODUCTIVE_HRS: response.data.REQUIRED_PRODUCTIVE_HRS,
              ACTIVE_YN: response.data.ACTIVE_YN,
              WEEKOFF: response.data.WEEKOFF,
              COMMENTS: response.data.COMMENTS,
              SHIFT_START_TIME: response.data.SHIFT_START_TIME,
              SHIFT_END_TIME: response.data.SHIFT_END_TIME,
              SHIFTSTART_DT: response.data.SHIFTSTART_DT,
              SHIFTEND_DT: response.data.SHIFTEND_DT,
              TIME_ZONE: "Asia/Kolkata"  // Ensure TIME_ZONE is set
            });
          } else {
            toast.error('Employee data not found.');
          }
        })
        .catch(error => {
          console.error("There was an error fetching the employee data!", error);
          toast.error("An error occurred while fetching employee data.");
        });
    }, [EMPID]);

    const handleDiscard = () => {
      setValues({
        EMPID: "",
        EMPNAME: "",
        EMAIL: "",
        SYS_USER_NAME: "",
        UPDATED_BY: "",
        SHIFTTYPE: "",
        ALLOTED_BREAK: "",
        REQUIRED_PRODUCTIVE_HRS: "",
        ACTIVE_YN: "",
        WEEKOFF: "",
        COMMENTS: "",
        SHIFT_START_TIME: "",
        SHIFT_END_TIME: "",
        SHIFTSTART_DT: null,
        SHIFTEND_DT: null,
        TIME_ZONE: "Asia/Kolkata"  // Reset TIME_ZONE on discard
      });
      navigate('/shifts');
    };

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

      const handleSubmit = (e) => {
        e.preventDefault();
        axios
          .put(`${API_BASE_URL1}/api/Shifts.php`, values)
          .then(response => {
            if (response.status === 200) {
              const { status, message } = response.data;
              if (status === "success") {
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
              {/* Employee ID */}
              <div className="col-sm-6 mt-2">
                <label htmlFor="empid" className="form-label">Emp_Id
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
                  readOnly
                  className="form-control"
                />
              </div>

              {/* Employee Name */}
              <div className="col-sm-6 mt-2">
                <label htmlFor="empname" className="form-label">Emp_Name
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

              {/* System User Name */}
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
                  name="SYS_USER_NAME"
                  value={values.SYS_USER_NAME || ""}
                  onChange={(e) => setValues({ ...values, SYS_USER_NAME: e.target.value })}
                  className="form-control"
                />
              </div>

              {/* Shift Type */}
              <div className="col-sm-6 mt-2">
                <label htmlFor="SHIFTTYPE" className="form-label">Shift Type
                <span
    data-toggle="tooltip"
    title="This is your default time zone."
    className="ms-1"
  >
    <i className="bi bi-exclamation-circle"></i>
  </span>
                </label>
                <select
                  id="SHIFTTYPE"
                  name="SHIFTTYPE"
                  value={values.SHIFTTYPE || ""}
                  onChange={(e) => setValues({ ...values, SHIFTTYPE: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Shift Type</option>
                  <option value="DAY">DAY</option>
                  <option value="NIGHT">NIGHT</option>
                </select>
              </div>

              {/* Shift Start Time */}
              <div className="col-sm-6 mt-2">
                <label htmlFor="SHIFT_START_TIME" className="form-label">Shift Start Time
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
                  id="SHIFT_START_TIME"
                  name="SHIFT_START_TIME"
                  value={values.SHIFT_START_TIME || ""}
                  onChange={(e) => setValues({ ...values, SHIFT_START_TIME: e.target.value })}
                  className="form-control"
                />
              </div>

              {/* Shift End Time */}
              <div className="col-sm-6 mt-2">
                <label htmlFor="SHIFT_END_TIME" className="form-label">Shift End Time
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
                  id="SHIFT_END_TIME"
                  name="SHIFT_END_TIME"
                  value={values.SHIFT_END_TIME || ""}
                  onChange={(e) => setValues({ ...values, SHIFT_END_TIME: e.target.value })}
                  className="form-control"
                />
              </div>

              {/* Shift Start Date */}
              <div className="col-sm-6 mt-2">
                <label htmlFor="SHIFTSTART_DT" className="form-label">Shift Start Date
                <span
    data-toggle="tooltip"
    title="This is your default time zone."
    className="ms-1"
  >
    <i className="bi bi-exclamation-circle"></i>
  </span>
                </label>
                <Flatpickr
                  className="form-control"
                  value={values.SHIFTSTART_DT || ""}
                  onChange={(date) => setValues({ ...values, shiftStartDate: date })}
                  options={{ dateFormat: "d-m-Y" }}
                  placeholder="Select Start Date"
                />
              </div>

              {/* Shift End Date */}
              <div className="col-sm-6 mt-2">
                <label htmlFor="SHIFTEND_DT" className="form-label">Shift End Date
                <span
    data-toggle="tooltip"
    title="This is your default time zone."
    className="ms-1"
  >
    <i className="bi bi-exclamation-circle"></i>
  </span>
                </label>
                <Flatpickr
                  className="form-control"
                  value={values.SHIFTEND_DT || ""}
                  onChange={(date) => setValues({ ...values, shiftendDate: date })}
                  options={{ dateFormat: "d-m-Y" }}
                  placeholder="Select End Date"
                />
              </div>

              {/* Time Zone */}
              <div className="col-sm-6 mt-2">
                <label htmlFor="TIME_ZONE" className="form-label">Time Zone
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
                  id="TIME_ZONE"
                  name="TIME_ZONE"
                  value={values.TIME_ZONE}  // Update value from state
                  onChange={(e) => setValues({ ...values, TIME_ZONE: e.target.value })} // Capture changes
                  className="form-control"
                />
              </div>

              {/* Week Off */}
              <div className="col-sm-6 mt-2">
                <label htmlFor="WEEKOFF" className="form-label">Week Off
                <span
    data-toggle="tooltip"
    title="This is your default time zone."
    className="ms-1"
  >
    <i className="bi bi-exclamation-circle"></i>
  </span>
                </label>
                <select
                  id="WEEKOFF"
                  name="WEEKOFF"
                  value={values.WEEKOFF || ""}
                  onChange={(e) => setValues({ ...values, WEEKOFF: e.target.value })}
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

              {/* Comments */}
              <div className="col-sm-6 mt-2">
                <label htmlFor="COMMENTS" className="form-label">Comments
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
                  id="COMMENTS"
                  name="COMMENTS"
                  value={values.COMMENTS || ""}
                  onChange={(e) => setValues({ ...values, COMMENTS: e.target.value })}
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

              

              {/* Submit and Discard buttons */}
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
