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
    const [designationCategories, setDesignationCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');


    const [values, setValues] = useState({
      EMPID: "",
      EMPNAME: "",
      EMAIL: "",
      SYS_USER_NAME: "",
      ROLE: "",
      DESIGNATION_CATEGORY: "",
      REPORTING_1: "",
      REPORTING_2: "",
      DEPARTMENT: "",
      TEAM: "",
      PROJECT: "",
      SHIFT: "",
      ALLOTED_BREAK: "",
      REQUIRED_PRODUCTIVE_HRS: "",
      ACTIVE_YN: "N",
      HOLIDAY_COUNTRY: "",
      REGION: "",
      UPDATED_BY: "" // Updated By field
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
              DESIGNATION_CATEGORY: "",
      REPORTING_1: response.data.REPORTING_1,
      REPORTING_2: response.data.REPORTING_2,
      DEPARTMENT: response.data.DEPARTMENT,
      TEAM: response.data.TEAM,
      PROJECT: response.data.PROJECT,
      SHIFT: response.data.SHIFT,
      ALLOTED_BREAK: response.data.ALLOTED_BREAK,
      REQUIRED_PRODUCTIVE_HRS: response.data.REQUIRED_PRODUCTIVE_HRS,
      ACTIVE_YN: response.data.ACTIVE_YN,
      HOLIDAY_COUNTRY: response.data.HOLIDAY_COUNTRY,
      REGION: response.data.REGION,
      UPDATED_BY: response.data.UPDATED_BY
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
      ROLE: "",
      DESIGNATION_CATEGORY: "",
      REPORTING_1: "",
      REPORTING_2: "",
      DEPARTMENT: "",
      TEAM: "",
      PROJECT: "",
      SHIFT: "",
      ALLOTED_BREAK: "",
      REQUIRED_PRODUCTIVE_HRS: "",
      ACTIVE_YN: "N",
      HOLIDAY_COUNTRY: "",
      REGION: "",
      UPDATED_BY: "" // Updated By fiel
      });
      navigate('/users');
    };

    // Fetch user data on component mount
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

      const handleSubmit = (e) => {
        e.preventDefault();
        axios
          .put(`${API_BASE_URL1}/api/useredit.php`, values)
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
              <label htmlFor="email" className="form-label">
                Email
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
                name="EMAIL"
                value={values.EMAIL || ""}
                onChange={(e) => setValues({ ...values, EMAIL: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="sysUserName" className="form-label">
                System Department Name
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
              <label htmlFor="role" className="form-label">
              Designation
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
                name="ROLE"
                value={values.ROLE || ""}
                onChange={(e) => setValues({ ...values, ROLE: e.target.value })}
                className="form-control"
              />
            </div>            
            <div className="col-sm-6 mt-2">
              <label htmlFor="designationcategory" className="form-label">
                Designation_Category
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
                  value={values.DESIGNATION_CATEGORY || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValues({ ...values, DESIGNATION_CATEGORY: value });
                  }}
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
                  value={values.DESIGNATION_CATEGORY || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setValues({ ...values, DESIGNATION_CATEGORY: value });
                  }}
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
                  value={values.REQUIRED_PRODUCTIVE_HRS || ""}
                  onChange={(e) => setValues({ ...values, REQUIRED_PRODUCTIVE_HRS: e.target.value })}   
                  className="form-control"
                />
              </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="reporting1" className="form-label">
                Reporting 1
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
                name="REPORTING_1"
                value={values.REPORTING_1 || ""}
                onChange={(e) => setValues({ ...values, REPORTING_1: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="reporting2" className="form-label">
                Reporting 2
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
                name="REPORTING_2"
                value={values.REPORTING_2 || ""}
                onChange={(e) => setValues({ ...values, REPORTING_2: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="department" className="form-label">
                Department
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
                name="DEPARTMENT"
                value={values.DEPARTMENT || ""}
                onChange={(e) => setValues({ ...values, DEPARTMENT: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="team" className="form-label">
                Team
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
                name="TEAM"
                value={values.TEAM || ""}
                onChange={(e) => setValues({ ...values, TEAM: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="project" className="form-label">
                Project
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
                name="PROJECT"
                value={values.PROJECT || ""}
                onChange={(e) => setValues({ ...values, PROJECT: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="shift" className="form-label">
                Shift
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
                id="shift"
                name="SHIFT"
                value={values.SHIFT || ""}
                onChange={(e) => setValues({ ...values, SHIFT: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="holidayCountry" className="form-label">
                Holiday Country
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
                name="HOLIDAY_COUNTRY"
                value={values.HOLIDAY_COUNTRY || ""}
                onChange={(e) => setValues({ ...values, HOLIDAY_COUNTRY: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="region" className="form-label">
                Region
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
                name="REGION"
                value={values.REGION || ""}
                onChange={(e) => setValues({ ...values, REGION: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="col-sm-6 mt-2">
              <label htmlFor="allotedBreak" className="form-label">
                Allotted Break
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
                name="ALLOTED_BREAK"
                value={values.ALLOTED_BREAK || ""}
                onChange={(e) => setValues({ ...values, ALLOTED_BREAK: e.target.value })}
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
            
            <div className="col-sm-6 mt-2">
              <label htmlFor="activeyn" className="form-label">
                Active Y_N 
                <span
  data-toggle="tooltip"
  title="This is your default time zone."
  className="ms-1"
>
  <i className="bi bi-exclamation-circle"></i>
</span>

              </label>
              <input
                type="checkbox"
                id="activeyn"
                name="ACTIVE_YN"
                checked={values.ACTIVE_YN === "Y"}
                onChange={(e) => setValues({ ...values, ACTIVE_YN: e.target.checked ? "Y" : "N" })}
                className="form-check-input"
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



