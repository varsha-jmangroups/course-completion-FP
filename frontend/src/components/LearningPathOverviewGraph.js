import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LearningPathOverviewGraph = ({ learningPaths }) => {
  const pathTitles = learningPaths.map(path => path.title);
  
  // Map each learning path to the number of courses
  const courseCounts = learningPaths.map(path => path.courses.length);

  // Map each learning path to a string of course titles
  const courseNamesForPaths = learningPaths.map(path => 
    path.courses.map(course => course.title).join(', ') || 'No Courses'
  );

  // Define a set of colors for each bar
  const backgroundColors = [
    'rgba(75, 192, 192, 0.2)',  // Light green
    'rgba(153, 102, 255, 0.2)', // Light purple
    'rgba(255, 159, 64, 0.2)',  // Light orange
    'rgba(255, 99, 132, 0.2)',  // Light red
    'rgba(54, 162, 235, 0.2)',  // Light blue
  ];

  const borderColors = [
    'rgba(75, 192, 192, 1)',    // Dark green
    'rgba(153, 102, 255, 1)',   // Dark purple
    'rgba(255, 159, 64, 1)',    // Dark orange
    'rgba(255, 99, 132, 1)',    // Dark red
    'rgba(54, 162, 235, 1)',    // Dark blue
  ];

  const data = {
    labels: pathTitles,
    datasets: [{
      label: 'Number of Courses',
      data: courseCounts,
      backgroundColor: backgroundColors.slice(0, pathTitles.length),
      borderColor: borderColors.slice(0, pathTitles.length),
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          // Custom tooltip to show course names
          label: function(tooltipItem) {
            const index = tooltipItem.dataIndex;
            const courseNames = courseNamesForPaths[index];
            return `Courses: ${courseNames}`;
          }
        }
      }
    }
  };

  return (
    <div style={{ width: '600px', margin: '40px auto' }}>
      <h2>Learning Path Overview</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default LearningPathOverviewGraph;
