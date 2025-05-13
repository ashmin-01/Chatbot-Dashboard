<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend, BarController, CategoryScale, LinearScale, BarElement } from 'chart.js'

Chart.register(PieController, ArcElement, Tooltip, Legend, BarController, CategoryScale, LinearScale, BarElement)

// Chart.register(PieController, ArcElement, Tooltip, Legend)
const barChartRef = ref<HTMLCanvasElement | null>(null)
let barChart: Chart | null = null
const chartRef = ref<HTMLCanvasElement | null>(null)
let myChart: Chart | null = null


onMounted(() => {
  if (chartRef.value) {
    myChart = new Chart(chartRef.value, {
      type: 'pie',
      data: {
        labels: ['Order Status', 'Missing/Wrong Items', 'New Orders', 'Promos & Discounts', 'Payment Issues', 'Receipts & History'],
        datasets: [{
          data: [35, 25, 15, 10, 10, 5],
          backgroundColor: [
            '#FF9F40',
            '#4BC0C0',
            '#FF6384',
            '#9966FF',
            '#FFCD56',
            '#36A2EB'
          ],
          borderWidth: 0,
          hoverOffset: 15
        }]
      },
      options: {
        cutout: '50%', // Makes it a donut (adjust % for thickness)
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // hide built-in legend
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    })

    // Inject custom legend in two columns
    const legendContainer = document.getElementById('chart-legend')
    if (legendContainer && myChart) {
      const labels = myChart.data.labels as string[]
      const bgColors = myChart.data.datasets[0].backgroundColor as string[]

      legendContainer.innerHTML = labels.map((label, i) => `
  <div class="flex items-center gap-2 text-[--color-text]">
    <span class="w-3 h-3 rounded-full inline-block" style="background-color: ${bgColors[i]}"></span>
    <span class="text-sm">${label}</span>
  </div>
`).join('')

    }
  }
  // here
  if (barChartRef.value) {
  barChart = new Chart(barChartRef.value, {
    type: 'bar',
    data: {
      labels: [
        '01/05', '02/05', '03/05', '04/05', '05/05', '06/05', '07/05',
        '08/05', '09/05', '10/05', '11/05', '12/05', '13/05', '14/05',
        '15/05', '16/05', '17/05', '18/05', '19/05', '20/05', '21/05',
        '22/05', '23/05', '24/05', '25/05', '26/05', '27/05', '28/05',
        '29/05', '30/05', '31/05'
      ],
      datasets: [
        {
          label: 'Auto Resolved',
          data: [35, 32, 30, 40, 42, 39, 38, 33, 31, 44, 45, 43, 41, 36, 39, 40, 44, 46, 42, 38, 39, 40, 37, 34, 36, 41, 39, 43, 45, 42, 38],
          backgroundColor: '#FFA726',

        },
        {
          label: 'Agent Escalated',
          data: [15, 14, 12, 10, 9, 10, 13, 14, 16, 12, 11, 12, 10, 9, 8, 9, 11, 12, 13, 14, 12, 11, 10, 13, 11, 10, 14, 13, 12, 13, 11],
          backgroundColor: '#81C784',

        },
        {
          label: 'User Abandoned',
          data: [5, 6, 4, 5, 6, 4, 5, 6, 5, 4, 6, 5, 4, 6, 5, 4, 6, 5, 6, 5, 4, 6, 5, 4, 5, 4, 6, 5, 4, 5, 6],
          backgroundColor: '#E57373',
        },


      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            title: (context) => `User Queries: ${
              context[0].dataset.data[context[0].dataIndex] +
              context[1].dataset.data[context[1].dataIndex] +
              context[2].dataset.data[context[2].dataIndex] +
              context[3].dataset.data[context[3].dataIndex]
            }`,
            label: (context) => {
              const label = context.dataset.label || ''
              const value = context.raw as number
              return `${label}: ${value}`
            }
          }
        },
        legend: {
  display: true,
  position: 'top',
  labels: {
    boxWidth: 12,
    padding: 10,
    font: {
      size: 12
    }
  }
}

      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            maxRotation: 60,
            minRotation: 45
          },
          grid: {
            display: true
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: 'User Queries'
          }
        }
      }
    }
  })
}


})
</script>



<template>
<main class="p-6 text-[#222]">
  <div class="grid gap-y-8">    <!-- Header -->
    <div class="mb-4">
      <h1 class="text-4xl font-bold">Dashboard</h1>
      <p class="mt-1 text-lg">🐝 Back in the hive, Jane! Let’s make this chatbot bee-yond awesome</p>
    </div>

<!-- Timestamp and Refresh + Statistics + AI Insights -->
<div class="grid grid-cols-3 gap-4 mb-6">
  <!-- Statistics -->
  <div class="col-span-2 rounded-xl overflow-hidden shadow border border-[#f5d3ba]">
    <div class="bg-[#FFE4D1] px-4 py-2 border-b border-[#f5d3ba] flex justify-between items-center">
      <h2 class="text-lg font-semibold text-[#222]">Statistics</h2>
      <span class="text-sm italic text-gray-500">
        This report was generated on 15/04/2025 at 1:50:09 PM –
        <a href="#" class="text-green-600 hover:underline">Refresh</a>
      </span>
    </div>
    <div class="bg-white px-4 py-4 grid grid-cols-4 gap-4">
      <!-- ...cards... -->
      <div class="flex items-center gap-4 p-4 border border-[#f5d3ba] rounded-lg">
        <i class="ri-discuss-line text-orange-500 text-3xl"></i>
        <div>
          <p class="text-sm">Chat Sessions</p>
          <p class="text-xl font-bold">5,905</p>
        </div>
      </div>
      <div class="flex items-center gap-4 p-4 border border-[#f5d3ba] rounded-lg">
        <i class="ri-quill-pen-ai-line text-orange-500 text-3xl"></i>
        <div>
          <p class="text-sm">Bot Accuracy</p>
          <p class="text-xl font-bold">%95</p>
        </div>
      </div>
      <div class="flex items-center gap-4 p-4 border border-[#f5d3ba] rounded-lg">
        <i class="ri-time-line text-orange-500 text-3xl"></i>
        <div>
          <p class="text-sm">Avg. Response Time</p>
          <p class="text-xl font-bold">2.4s</p>
        </div>
      </div>
      <div class="flex items-center gap-4 p-4 border border-[#f5d3ba] rounded-lg">
        <i class="ri-line-chart-line text-orange-500 text-3xl"></i>
        <div>
          <p class="text-sm">Escalation Rate</p>
          <p class="text-xl font-bold">%17</p>
        </div>
      </div>
    </div>
  </div>

  <!-- AI Insights -->
  <div class="rounded-xl overflow-hidden shadow border border-[#f5d3ba]">
    <div class="bg-[#FFE4D1] px-4 py-2 border-b border-[#f5d3ba]">
      <h2 class="text-base font-semibold text-[#222]">AI Insights</h2>
    </div>
    <div class="bg-white px-4 py-3 space-y-50">
      <div class="bg-[#EBF8FF] text-sm p-3 rounded-lg">
        Knowledge base article ‘Delivery Delays’ was accessed 82 times.
      </div>
      <div class="bg-[#EBF8FF] text-sm p-3 rounded-lg">
        Response time was fastest at 3PM – maybe optimize for peak hours?
      </div>
    </div>
  </div>
</div>

<!-- User Queries + Most Common Topics -->
<div class="grid grid-cols-3 gap-4 mb-6">
  <!-- User Queries -->
  <div class="col-span-2 rounded-xl overflow-hidden shadow border border-[#f5d3ba]">
    <div class="bg-[#FFE4D1] px-4 py-2 border-b border-[#f5d3ba]">
      <h2 class="text-xl font-semibold">User Queries</h2>
      <p class="text-sm text-gray-600">how user queries were handled</p>
    </div>
    <div class="bg-white h-64 p-4">
  <canvas ref="barChartRef"></canvas>
</div>
  </div>

  <!-- Most Common Chat Topics -->
  <div class="rounded-xl overflow-hidden shadow border border-[#f5d3ba]">
    <div class="bg-[#FFE4D1] px-4 py-2 border-b border-[#f5d3ba] flex justify-between items-center">
      <h2 class="text-base font-semibold text-[#222]">Most Common Chat Topics</h2>
      <a href="#" class="text-green-600 text-sm hover:underline">See Full Report</a>
    </div>
    <div class="bg-white px-4 py-3 h-50 relative">
      <canvas ref="chartRef" class="mb-4"></canvas>
      <div id="chart-legend" class="grid grid-cols-2 gap-y-2 gap-x-2 text-sm text-[--color-text]"></div>

</div>
  </div>
</div>

  </div>
  </main>
</template>
