// src/components/EnrollmentStatisticsGraph.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const EnrollmentStatisticsGraph = ({ courses, enrollments }) => {
  const courseLabels = courses.map(course => course.title);
  const enrollmentCounts = courses.map(course => 
    enrollments.filter(enrollment => enrollment.courseId === course.id).length
  );

  const data = {
    labels: courseLabels,
    datasets: [{
      data: enrollmentCounts,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12, // Smaller font for the legend
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 12, // Smaller font for tooltips
        },
      },
    },
  };

  return (
    <div style={{ width: '400px', margin: '20px auto' }}>
      <h2 style={{ fontSize: '16px', textAlign: 'center' }}>Enrollment Statistics</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default EnrollmentStatisticsGraph;
