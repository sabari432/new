import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Flatpickr from 'react-flatpickr';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'flatpickr/dist/flatpickr.min.css';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';


const ShiftsAdd = ({ showModal, setShowModal }) => {
  const [formData, setFormData] = useState({
    empId: '',
    empName: '',
    sysUserName: '',
    shift: '',
    shiftStartTime: '',
    shiftEndTime: '',
    shiftStartDate: null,
    shiftEndDate: null,
    timeZone: '',
    weekOff: '',
    comments: '',
  });

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const submitUser = () => {
    const postData = {
      empid: formData.empId,
      empname: formData.empName,
      sysUserName: formData.sysUserName,
      shift: formData.shift,
      shiftStartTime: formData.shiftStartTime,
      shiftEndTime: formData.shiftEndTime,
      shiftStartDate: formData.shiftStartDate,
      shiftEndDate: formData.shiftEndDate,
      timeZone: formData.timeZone,
      weekOff: formData.weekOff,
      comments: formData.comments,
    };

    axios.post(`${API_BASE_URL1}/api/shifts.php`, postData)
      .then((response) => {
        if (response.status === 200) {
          toast.success('Employee added successfully!');
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
      shift: '',
      shiftStartTime: '',
      shiftEndTime: '',
      shiftStartDate: null,
      shiftEndDate: null,
      timeZone: '',
      weekOff: '',
      comments: '',
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Add Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mt-2">
            <div className="col-sm-6 mt-2">
              <label htmlFor="empId" className="form-label">Employee ID</label>
              <input type="text" id="empId" name="empId" value={formData.empId} onChange={handleInputChange} className="form-control" />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="empName" className="form-label">Employee Name</label>
              <input type="text" id="empName" name="empName" value={formData.empName} onChange={handleInputChange} className="form-control" />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="sysUserName" className="form-label">System User Name</label>
              <input type="text" id="sysUserName" name="sysUserName" value={formData.sysUserName} onChange={handleInputChange} className="form-control" />
            </div>

           <div className="col-sm-6 mt-2">
              <label htmlFor="shifttype" className="form-label">Shift Type</label>
              <select id="shifttype" name="shifttype" value={formData.shifttype} onChange={handleInputChange} className="form-select">
                <option value="">Select Shift Type</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="shiftStartTime" className="form-label">Shift Start Time</label>
              <input type="time" id="shiftStartTime" name="shiftStartTime" value={formData.shiftStartTime} onChange={handleInputChange} className="form-control" />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="shiftEndTime" className="form-label">Shift End Time</label>
              <input type="time" id="shiftEndTime" name="shiftEndTime" value={formData.shiftEndTime} onChange={handleInputChange} className="form-control" />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="shiftStartDate" className="form-label">Shift Start Date</label>
              <Flatpickr
                className="form-control"
                value={formData.shiftStartDate}
                onChange={(date) => setFormData({ ...formData, shiftStartDate: date })}
                options={{ dateFormat: "Y-m-d" }}
                placeholder="Select Start Date"
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="shiftEndDate" className="form-label">Shift End Date</label>
              <Flatpickr
                className="form-control"
                value={formData.shiftEndDate}
                onChange={(date) => setFormData({ ...formData, shiftEndDate: date })}
                options={{ dateFormat: "Y-m-d" }}
                placeholder="Select End Date"
              />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="timeZone" className="form-label">Time Zone</label>
              <input type="text" id="timeZone" name="timeZone" value={formData.timeZone} onChange={handleInputChange} className="form-control" />
            </div>

            <div className="col-sm-6 mt-2">
              <label htmlFor="weekOff" className="form-label">Week Off</label>
              <select id="weekOff" name="weekOff" value={formData.weekOff} onChange={handleInputChange} className="form-select">
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
              <label htmlFor="comments" className="form-label">Comments</label>
              <input type="text" id="comments" name="comments" value={formData.comments} onChange={handleInputChange} className="form-control" />
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

export default ShiftsAdd;
