import React, { useState } from 'react';
import { Input, Button, message, List } from 'antd';
import axios from 'axios';

function Profile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const EMPNAME = localStorage.getItem('EMPNAME');
  const EMPID = localStorage.getItem('EMPID');
  const PASSWORD = localStorage.getItem('PASSWORD');
  const ACCESS_ROLE = localStorage.getItem('ACCESS_ROLE');
  const REGION = localStorage.getItem('REGION');
  const PROJECT = localStorage.getItem('PROJECT');
  const TEAM = localStorage.getItem('TEAM');
  const DEPARTMENT = localStorage.getItem('DEPARTMENT');
  const DESIGNATION_CATEGORY = localStorage.getItem('DESIGNATION_CATEGORY');
  const ROLE = localStorage.getItem('ROLE');
  const SYS_USER_NAME = localStorage.getItem('SYS_USER_NAME');
  const EMAIL = localStorage.getItem('EMAIL');

  const handleUpdate = async () => {
    if (currentPassword !== PASSWORD) {
      message.error('Current password is incorrect.');
      return;
    }

    try {
      const response = await axios.post('http://98.83.30.44/password_upadte.php', {
        empId: EMPID,
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        message.success('Password updated successfully.');
        // Optionally, update localStorage or clear input fields here
      } else {
        message.error('Failed to update password.');
      }
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
        <div style={{display:'flex'}}>
      <h2>Profile :</h2>
      <div style={{paddingLeft:'1%'}}>
      <List
        
        style={{  width:'170%',fontSize: '16px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow effect
            borderRadius: '4px' ,paddingLeft:'4%'}} 
        dataSource={[
          { title: 'Employee Name:', value: EMPNAME },
          { title: 'Employee ID:', value: EMPID },
          { title: 'Email:', value: EMAIL },
          { title: 'Access Role:', value: ACCESS_ROLE },
          { title: 'Region:', value: REGION },
          { title: 'Project:', value: PROJECT },
          { title: 'Team:', value: TEAM },
          { title: 'Department:', value: DEPARTMENT },
          { title: 'Designation Category:', value: DESIGNATION_CATEGORY },
          { title: 'Role:', value: ROLE },
          { title: 'System User Name:', value: SYS_USER_NAME },
        ]}
        renderItem={item => (
          <List.Item style={{ fontSize: '18px',padding:'2%' }}>
            <strong>{item.title}</strong> {item.value}
          </List.Item>
        )}
      />
      </div>
      </div>

      <h4>Update Password :</h4>
      <Input.Password
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => {
            const value = e.target.value;
            // Check if the value contains a single quote
            if (!value.includes("'")) {
              setCurrentPassword(value);
            }
          }}
        style={{ marginRight: '10px', width: "20%" }}
      />
      <Input.Password
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => {
            const value = e.target.value;
            // Check if the value contains a single quote
            if (!value.includes("'")) {
              setNewPassword(value);
            }
          }}
        style={{ marginRight: '10px', width: "20%" }}
      />
      <Button type="primary" onClick={handleUpdate}>
        Update
      </Button>
    </div>
  );
}

export default Profile;
