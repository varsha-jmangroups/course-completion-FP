import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EmployeePerformanceMetricsGraph = ({ employees = [], enrollments = [] }) => {
  console.log("Employees:", employees);
  console.log("Enrollments:", enrollments);

  // Map through employee IDs and calculate the correct completion percentage
  const completionPercentages = employees.map(employee => {
    // Filter enrollments for this employee using the employee's ID
    const employeeEnrollments = enrollments.filter(enrollment => enrollment.userId === employee.id);

    // Count the number of courses completed by the employee
    const completedCourses = employeeEnrollments.filter(enrollment => enrollment.completionPercentage === 100).length;

    // Calculate the total number of courses the employee is enrolled in
    const totalCourses = employeeEnrollments.length;

    // If there are no enrollments, return 0
    if (totalCourses === 0) return 0;

    // Return the percentage of completed courses (out of total enrolled courses)
    return (completedCourses / totalCourses) * 100;
  });

  console.log("Completion Percentages:", completionPercentages);

  const data = {
    labels: employees.map(employee => employee.name || 'Unknown'),
    datasets: [{
      label: 'Completion Percentage',
      data: completionPercentages,
      backgroundColor: 'rgba(75, 192, 192, 0.4)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 3,
      pointBackgroundColor: 'rgba(255, 255, 255, 1)',
      pointBorderColor: 'rgba(75, 192, 192, 1)',
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '80%', height: '400px', margin: '40px auto' }}>
      <h2>Employee Performance Metrics</h2>
      <Radar data={data} options={options} />
    </div>
  );
};

export default EmployeePerformanceMetricsGraph;
