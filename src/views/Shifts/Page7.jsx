// Page7.js
import React, { useState } from 'react';
import { Button } from 'antd';
import ShiftsAdd from './ShiftsAdd';

const Page7 = ({onSave}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control EmployeeDBAdd modal visibility
  const [formData, setFormData] = useState({}); // State for form data  
  const [errors, setErrors] = useState({}); // State for form errors


    // Function to handle input change in EmployeeDBAdd modal
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    // Function to reset the form data in EmployeeDBAdd modal
    const resetForm = () => {
      setFormData({});
      setErrors({});
    };

 

  const handleSave = (values) => {
    console.log('Saved from Page7:', values);
    // Handle the saved data as needed
    onSave(values); // Call the passed callback with the form values
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
     

      <button
            className="btn btn-primary w-40"
            onClick={() => setShowModal(true)}
          >
             Add Form
          </button>
     
          <ShiftsAdd
      showModal={showModal}
      setShowModal={setShowModal}
      formData={formData}
      handleInputChange={handleInputChange}
      resetForm={resetForm}
      errors={errors}
    />
    </div>
  );
};

export default Page7;
