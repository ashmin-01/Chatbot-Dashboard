// import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

// Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

// export function renderStackedBarChart(canvas: HTMLCanvasElement) {
//   return new Chart(canvas, {
//     type: 'bar',
//     data: {
//       labels: ['01/05', '02/05', '03/05', '04/05', '05/05', '06/05', '07/05'],
//       datasets: [
//         {
//           label: 'Auto Resolved',
//           data: [45, 50, 40, 42, 48, 46, 47],
//           backgroundColor: '#FF9F40'
//         },
//         {
//           label: 'Agent Escalated',
//           data: [17, 16, 19, 15, 18, 17, 16],
//           backgroundColor: '#4BC0C0'
//         },
//         {
//           label: 'User Abandoned',
//           data: [6, 5, 4, 6, 5, 4, 5],
//           backgroundColor: '#FF6384'
//         },
//         {
//           label: 'Unresolved',
//           data: [2, 3, 1, 2, 3, 2, 1],
//           backgroundColor: '#9966FF'
//         }
//       ]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       scales: {
//         x: { stacked: true },
//         y: { stacked: true, beginAtZero: true }
//       },
//       plugins: {
//         legend: { position: 'top' },
//         tooltip: {
//           callbacks: {
//             label: (context) => `${context.dataset.label}: ${context.raw}`
//           }
//         }
//       },
//       animation: {
//         animateScale: true,
//         animateRotate: true
//       }
//     }
//   })
// }
