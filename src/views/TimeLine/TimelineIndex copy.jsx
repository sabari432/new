import React, { useEffect, useState } from 'react';
import { Card, Select, message, Button, DatePicker, Spin } from 'antd';
import { UserDeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useFilterContext } from './FilterContext'; // Ensure the path is correct
import ApexChart from './Timeline';
import Timelineapp from './Timelineapp.jsx';
import { API_BASE_URL1, API_BASE_URL2, API_BASE_URL_LOCAL_HOST } from '../../config';


const { Option } = Select;

const TimelineIndex = () => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({});
  const [employeeid, setEmployeeid] = useState([]);
  const [tempSelectedEmployees, setTempSelectedEmployees] = useState([]);
  const [showTimelineApp, setShowTimelineApp] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const {
    selectedValues,
    setSelectedValues,
    selectedDate,
    setSelectedDate,
    selectedEmployees,
    setSelectedEmployees,
    data,
    setData,
    resetFilters
  } = useFilterContext();

  // Fetch initial unique filter options on mount
  useEffect(() => {
    fetch(`${API_BASE_URL1}/api/uniquefilters.php`)
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          const allOptions = Object.entries(data.data).reduce((acc, [key, values]) => {
            acc[key] = values.map(value => ({ value, label: value }));
            return acc;
          }, {});
          setOptions(allOptions);
        } else {
          message.error('Failed to fetch data');
        }
        setLoading(false);
      })
      .catch(() => {
        message.error('An error occurred while fetching data');
        setLoading(false);
      });
  }, []);

  // Fetch filtered data when shouldFetchData changes
  useEffect(() => {
    if (shouldFetchData) {
      setDataLoading(true);
      const filterParams = Object.entries(selectedValues)
        .map(([key, values]) => `${encodeURIComponent(key)}=${encodeURIComponent(values.join(','))}`)
        .concat(selectedDate ? [`date=${encodeURIComponent(selectedDate)}`] : [])
        .join('&');

      fetch(`${API_BASE_URL2}/timeline.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: filterParams
      })
        .then(response => response.json())
        .then(data => {
          setData(data);
          const employeeid = Array.from(new Set(data.map(item => item.EMPID)));
          setEmployeeid(employeeid);
          message.success('Data fetched successfully');
        })
        .catch(() => {
          message.error('An error occurred while fetching data');
        })
        .finally(() => {
          setShouldFetchData(false);
          setDataLoading(false);
        });
    }
  }, [shouldFetchData, selectedValues, selectedDate]);

  const handleChange = (value, key) => {
    setSelectedValues(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = date => {
    setSelectedDate(date ? date.format('YYYY-MM-DD') : null);
  };

  const handleReset = () => {
    resetFilters();
    setShowTimelineApp(false);
    setData([]);
  };

  const handleApplyFilters = () => {
    setShouldFetchData(true);
  };

  const handleSubmit = () => {
    if (tempSelectedEmployees.length > 0) {
      setSelectedEmployees(tempSelectedEmployees);
      setShowTimelineApp(true);
    } else {
      message.error('Please select at least one employee');
    }
  };

  const handleEmployeeChange = value => {
    setTempSelectedEmployees(value);
  };

  const handleResetEmployees = () => {
    setTempSelectedEmployees([]);
    setSelectedEmployees([]);
  };

  const getFilteredOptions = columnName => {
    const selected = selectedValues;
    return options[columnName]?.filter(option => {
      return !Object.keys(selected).some(key => 
        key !== columnName && selected[key].includes(option.value)
      );
    }) || [];
  };

  const filtersToExclude = ['SHIFT'];

  return (
    <div className="container ">
      <div className="card">
        <div className="card-header">
          <h5>Activity Timeline:</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-12">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
             
              <Flatpickr
                value={selectedDate ? moment(selectedDate, "YYYY-MM-DD") : null}
                onChange={handleDateChange}
                options={{ dateFormat: "Y-m-d" }}
                placeholder={
                  selectedDate
                    ? moment(selectedDate).format("YYYY-MM-DD")
                    : "Select date"
                }
              />
                {Object.keys(options)
                  .filter((key) => !filtersToExclude.includes(key))
                  .map((key) => (
                    <div key={key} style={{ flex: "1", marginRight: "10px" }}>
                      <Select
                        mode="multiple"
                        size="small"
                        className="pyt"
                        dropdownClassName="custom-dropdown1"
                        style={{ width: "100%" }}
                        placeholder={`${key}`}
                        value={selectedValues[key] || []}
                        onChange={(value) => handleChange(value, key)}
                      >
                        {getFilteredOptions(key).map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  ))}
              </div>
            </div>
            <div className="col-sm-3 mt-2">
              <button
                className="btn btn-sm btn-primary py-1 w-40"
                onClick={handleApplyFilters}
              >
                Filter
              </button>
              <button
                className="btn btn-sm btn-danger text-light py-1 ms-2 w-40"
                onClick={handleReset}
              >
                Reset
              </button>
              <button className="btn btn-sm btn-secondary text-light py-1 ms-2 w-40">
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <Spin spinning={dataLoading}>
        {data.length > 0 && <ApexChart data={data} />}
      </Spin>

      {data.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h5>Application Usage Timeline:</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-12">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Select
                    size="large"
                    placeholder="Select Employees"
                    style={{ width: "20%" }}
                    value={tempSelectedEmployees}
                    onChange={handleEmployeeChange}
                  >
                    {employeeid.map((name) => (
                      <Option key={name} value={name}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="col-sm-3 mt-2">
                <button
                  className="btn btn-sm btn-primary py-1 w-40"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
                <button
                  className="btn btn-sm  btn-danger text-light py-1 ms-2 w-40"
                  onClick={handleResetEmployees}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Spin spinning={dataLoading}>
        {showTimelineApp && (
          <Timelineapp
            selectedDate={selectedDate}
            selectedEmployees={selectedEmployees}
          />
        )}
      </Spin>
    </div>
  );
};

export default TimelineIndex;
