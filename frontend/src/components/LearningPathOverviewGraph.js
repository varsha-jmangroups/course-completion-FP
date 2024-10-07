// src/components/LearningPathOverviewGraph.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LearningPathOverviewGraph = ({ learningPaths }) => {
  const pathTitles = learningPaths.map(path => path.title);
  const courseCounts = learningPaths.map(path => path.courses.length);

  const data = {
    labels: pathTitles,
    datasets: [{
      label: 'Number of Courses',
      data: courseCounts,
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div style={{ width: '600px', margin: '40px auto' }}>
      <h2>Learning Path Overview</h2>
      <Bar data={data} />
    </div>
  );
};

export default LearningPathOverviewGraph;
