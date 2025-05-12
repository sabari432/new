import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Flatpickr from 'react-flatpickr';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'flatpickr/dist/flatpickr.min.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';

const FormModal = ({ showModal, setShowModal }) => {
  const [formData, setFormData] = useState({
    empId: '',
    empName: '',
    sysUserName: '',
    shiftType: '',
    shiftStartTime: '',
    shiftEndTime: '',
    shiftStartDate: null,
    shiftEndDate: null,
    timeZone: 'Asia/Kolkata',
    weekOff: '',
    comments: '',
    updatedBy: '',
  });

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Fetch employee details if EMPID changes
    if (name === 'empId') {
      fetchEmployeeDetails(value);
    }
  };

  // Function to fetch employee details
  const fetchEmployeeDetails = async (empId) => {
    if (empId) {
      try {
        const response = await axios.get(`${API_BASE_URL1}/api/ShiftsComeGet.php?EMPID=${empId}`);
        if (response.data) {
          setFormData((prevData) => ({
            ...prevData,
            empName: response.data.EMPNAME || '',
            sysUserName: response.data.SYS_USER_NAME || '',
          }));
        }
      } catch (error) {
        toast.error('Failed to fetch employee details.');
        console.error('Fetch Error:', error);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        empName: '',
        sysUserName: '',
      }));
    }
  };

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

  // Function to handle form submission
  const submitUser = () => {
    const postData = {
      EMPID: formData.empId,
      EMPNAME: formData.empName,
      SYS_USER_NAME: formData.sysUserName,
      SHIFTTYPE: formData.shiftType,
      SHIFT_START_TIME: formData.shiftStartTime,
      SHIFT_END_TIME: formData.shiftEndTime,
      SHIFTSTART_DT: formData.shiftStartDate ? formData.shiftStartDate[0].toISOString().split('T')[0] : '',
      SHIFTEND_DT: formData.shiftEndDate ? formData.shiftEndDate[0].toISOString().split('T')[0] : '',
      TIME_ZONE: formData.timeZone,
      WEEKOFF: formData.weekOff,
      COMMENTS: formData.comments,
      UPDATED_BY: formData.updatedBy,
    };

    axios.put(`${API_BASE_URL1}/Shifts.php`, postData)
      .then((response) => {
        if (response.data.status === 'success') {
          toast.success('Data updated successfully!');
          clearForm(); // Clear input fields
          setShowModal(false); // Close modal
        } else {
          toast.error(`Error: ${response.data.error}`);
        }
      })
      .catch((error) => {
        toast.error('An error occurred while submitting the data.');
        console.error('Submit Error:', error);
      });
  };

  // Function to clear the form
  const clearForm = () => {
    setFormData({
      empId: '',
      empName: '',
      sysUserName: '',
      shiftType: '',
      shiftStartTime: '',
      shiftEndTime: '',
      shiftStartDate: null,
      shiftEndDate: null,
      timeZone: 'Asia/Kolkata',
      weekOff: '',
      comments: '',
      updatedBy: '',
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Add Employee Shift</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mt-2">
            <div className="col-sm-6 mt-2">
              <label htmlFor="empId" className="form-label">
                Employee ID
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
                id="empId"
                name="empId"
                value={formData.empId}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="empName" className="form-label">
                Employee Name
                <span
                  data-toggle="tooltip"
                  title="Enter your full name."
                  className="ms-1"
                >
                  <i className="bi bi-exclamation-circle"></i>
                </span>
              </label>
              <input
                type="text"
                id="empName"
                name="empName"
                value={formData.empName}
                onChange={handleInputChange}
                className="form-control"
                required
                readOnly // Optional: make it read-only if you don't want to allow editing
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="sysUserName" className="form-label">
                System User Name
                <span
                  data-toggle="tooltip"
                  title="Enter the system username assigned to you."
                  className="ms-1"
                >
                  <i className="bi bi-exclamation-circle"></i>
                </span>
              </label>
              <input
                type="text"
                id="sysUserName"
                name="sysUserName"
                value={formData.sysUserName}
                onChange={handleInputChange}
                className="form-control"
                required
                readOnly // Optional: make it read-only if you don't want to allow editing
              />
            </div>

            {/* Remaining form fields... */}

            <div className="col-sm-6 mt-2">
      <label htmlFor="shiftType" className="form-label">
        Shift Type
        <span
          data-toggle="tooltip"
          title="Select either 'Day' or 'Night' shift."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
      </label>
      <select
        id="shiftType"
        name="shiftType"
        value={formData.shiftType}
        onChange={handleInputChange}
        className="form-select"
        required
      >
        <option value="">Select Shift Type</option>
        <option value="Day">DAY</option>
        <option value="Night">NIGHT</option>
      </select>
    </div>

    <div className="col-sm-6 mt-2">
      <label htmlFor="shiftStartTime" className="form-label">
        Shift Start Time
        <span
          data-toggle="tooltip"
          title="Enter the start time for your shift."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
      </label>
      <input
        type="time"
        id="shiftStartTime"
        name="shiftStartTime"
        value={formData.shiftStartTime}
        onChange={handleInputChange}
        className="form-control"
        required
      />
    </div>

    <div className="col-sm-6 mt-2">
      <label htmlFor="shiftEndTime" className="form-label">
        Shift End Time
        <span
          data-toggle="tooltip"
          title="Enter the end time for your shift."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
      </label>
      <input
        type="time"
        id="shiftEndTime"
        name="shiftEndTime"
        value={formData.shiftEndTime}
        onChange={handleInputChange}
        className="form-control"
        required
      />
    </div>

    <div className="col-sm-6 mt-2">
      <label htmlFor="shiftStartDate" className="form-label">
        Shift Start Date
        <span
          data-toggle="tooltip"
          title="Select the date your shift starts."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
      </label>
      <Flatpickr
        className="form-control"
        value={formData.shiftStartDate}
        onChange={(date) => setFormData({ ...formData, shiftStartDate: date })}
        options={{ dateFormat: "Y-m-d" }}
        placeholder="Select Start Date"
      />
    </div>

    <div className="col-sm-6 mt-2">
      <label htmlFor="shiftEndDate" className="form-label">
        Shift End Date
        <span
          data-toggle="tooltip"
          title="Select the date your shift ends."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
      </label>
      <Flatpickr
        className="form-control"
        value={formData.shiftEndDate}
        onChange={(date) => setFormData({ ...formData, shiftEndDate: date })}
        options={{ dateFormat: "Y-m-d" }}
        placeholder="Select End Date"
      />
    </div>

    <div className="col-sm-6 mt-2">
      <label htmlFor="timeZone" className="form-label">
        Time Zone
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
        id="timeZone"
        name="timeZone"
        value={formData.timeZone}
        readOnly
        className="form-control"
      />
    </div>

    <div className="col-sm-6 mt-2">
      <label htmlFor="weekOff" className="form-label">
        Week Off
        <span
          data-toggle="tooltip"
          title="Select your preferred day off in the week."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
      </label>
      <select
        id="weekOff"
        name="weekOff"
        value={formData.weekOff}
        onChange={handleInputChange}
        className="form-select"
        required
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
      <label htmlFor="comments" className="form-label">
        Comments
        <span
          data-toggle="tooltip"
          title="Add any additional notes or comments."
          className="ms-1"
        >
          <i className="bi bi-exclamation-circle"></i>
        </span>
      </label>
      <input
        type="text"
        id="comments"
        name="comments"
        value={formData.comments}
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


            <div className="col-sm-12 mt-2">
              <button className="btn btn-primary w-40 ms-2 mb-2" onClick={submitUser}>
                Submit
              </button>
              <button
                className="btn btn-danger text-light w-40 ms-2 mb-2"
                onClick={() => {
                  clearForm(); // Clear input fields
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

export default FormModal;
