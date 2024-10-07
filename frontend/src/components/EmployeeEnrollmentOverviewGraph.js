// src/components/EmployeeEnrollmentOverviewGraph.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeEnrollmentOverviewGraph = ({ employees, enrollments }) => {
  const employeeNames = employees.map(employee => employee.name);
  const enrollmentCounts = employeeNames.map(name => 
    enrollments.filter(enrollment => enrollment.user.name === name).length
  );

  const data = {
    labels: employeeNames,
    datasets: [{
      label: 'Number of Courses Enrolled',
      data: enrollmentCounts,
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div style={{ width: '600px', margin: '40px auto' }}>
      <h2>Employee Enrollment Overview</h2>
      <Bar data={data} />
    </div>
  );
};

export default EmployeeEnrollmentOverviewGraph;
