// ChartVisualizer.js
class ChartVisualizer {
  static createPieChart(canvasId, data, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.label),
        datasets: [{
          data: data.map(item => item.value),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#8AC24A', '#EA5F89', '#00ACC1', '#FF7043'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: title,
            font: {
              size: 16
            }
          }
        }
      }
    });
  }
}