// ChartVisualizer.js

// A utility class to create and render pie charts using Chart.js
class ChartVisualizer {

  // Creates a pie chart on a given canvas using provided data and title
  static createPieChart(canvasId, data, title) {
    // Get 2D drawing context from the canvas element by ID
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Return a new Chart.js pie chart instance
    return new Chart(ctx, {
      type: 'pie', // Chart type
      data: {
        labels: data.map(item => item.label),  // Labels for pie segments
        datasets: [{
          data: data.map(item => item.value),  // Values for each segment
          backgroundColor: [                   // Color palette
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#8AC24A', '#EA5F89', '#00ACC1', '#FF7043'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true, // Scales chart to fit container
        plugins: {
          legend: {
            position: 'bottom', // Show legend below the chart
          },
          title: {
            display: true,
            text: title,        // Display the provided chart title
            font: {
              size: 16
            }
          }
        }
      }
    });
  }
}
