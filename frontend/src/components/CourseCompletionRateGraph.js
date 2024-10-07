// src/components/CourseCompletionRateGraph.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CourseCompletionRateGraph = ({ courses, enrollments }) => {
  const courseLabels = courses.map(course => course.title);
  const completionRates = courses.map(course => {
    const courseEnrollments = enrollments.filter(enrollment => enrollment.courseId === course.id);
    const completedCount = courseEnrollments.filter(enrollment => enrollment.completionPercentage === 100).length;
    return (completedCount / courseEnrollments.length) * 100 || 0; // avoid division by zero
  });

  const data = {
    labels: courseLabels,
    datasets: [{
      label: 'Completion Rate (%)',
      data: completionRates,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div style={{ width: '600px', margin: '40px auto' }}>
      <h2>Course Completion Rate</h2>
      <Bar data={data} />
    </div>
  );
};

export default CourseCompletionRateGraph;
