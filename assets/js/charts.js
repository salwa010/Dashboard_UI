// ../assets/js/charts.js

// Individual chart initialization functions

function createProgressChart(canvasId, value, color) {
  const el = document.getElementById(canvasId);
  if (!el) return; 

  let displayValue = 0; 
  let isHovered = false; 

  const centerText = {
    id: "centerText",
    afterDraw(chart) {
      const { ctx, width, height } = chart;

      ctx.save();
      ctx.font = isHovered
        ? "600 14px Montserrat, sans-serif"
        : "600 12px Montserrat, sans-serif";

      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(`+${displayValue}%`, width / 2, height / 2);

      ctx.restore();
    },
  };

  new Chart(document.getElementById(canvasId), {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: [color, "#F0F0FA"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      cutout: "90%",
      animation: {
        duration: 1000,
        easing: "easeOutCubic",
        onProgress() {
          if (displayValue < value) {
            displayValue++;
          }
        },
      },
      hover: {
        animationDuration: 400,
      },
      onHover: (event, elements, chart) => {
        isHovered = elements.length > 0;
        chart.draw(); 
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    },
    plugins: [centerText],
  });
}

function initActiveApplicationsChart() {
  console.log('Creating Applications Stats Chart');
  const el = document.getElementById("applicationsStatsChart");
  if (!el) return;
  const ctx = el.getContext("2d");
  let delayed = false;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Applications",
          data: [20, 18, 22, 19, 25, 27, 24],
          backgroundColor: "#6E00FF",
          barThickness: 5,
          borderRadius: 10,
        },
        {
          label: "Shortlisted",
          data: [25, 22, 26, 24, 23, 25, 24],
          backgroundColor: "#fadb62",
          barThickness: 5,
          borderRadius: 10,
        },
        {
          label: "Rejected",
          data: [30, 28, 24, 22, 26, 20, 22],
          backgroundColor: "#FF8A65",
          barThickness: 5,
          borderRadius: 10,
        },
        {
          label: "On Hold",
          data: [10, 8, 12, 10, 14, 13, 11],
          backgroundColor: "#E6E8F0",
          barThickness: 5,
          borderRadius: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      font: {
        family: "Montserrat, sans-serif",
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false, 
            drawTicks: false,
            drawBorder: false,
            borderColor: "transparent",
          },
          border: {
            display: false, 
          },
          ticks: {
            padding: 10, 
            color: "#b5b5b5",
            font: {
              family: "Montserrat, sans-serif",
              weight: 500,
              size: 10,
            },
          },
        },
        y: {
          stacked: true,
          grid: {
            drawTicks: false,
            drawBorder: false,
            color: "transparent",
            borderColor: "transparent",
          },
          min: 20,
          max: 100,
          ticks: {
            stepSize: 20,
            callback: (value) => value + "%",
            color: "#b5b5b5",
            font: {
              family: "Montserrat, sans-serif",
              weight: 500,
              size: 10,
            },
          },

          border: {
            display: false, 
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            padding: 20,
            font: {
              family: "Montserrat, sans-serif",
              weight: 500,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.raw}%`,
          },
        },
      },
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (
            context.type === "data" &&
            context.mode === "default" &&
            !delayed
          ) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
    },
  });
}

function initAcquisitionsChart(canvasId, value, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const remaining = 100 - value;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [''], // required but visually removed
      datasets: [
        {
          data: [value],
          backgroundColor: color,
          barThickness: 4,
          borderRadius: { topLeft: 4, bottomLeft: 4 }
        },
        {
          data: [remaining],
          backgroundColor: '#ddd',
          barThickness: 4,
          borderRadius: { topRight: 4, bottomRight: 4 }
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 0 },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: { stacked: true, max: 100, display: false },
        y: {
          stacked: true,
          display: false,
          grid: { display: false }
        }
      }
    }
  });
}

function initReceivedTimeChart() {
  const el = document.getElementById("applicationsLineChart");
  if (!el) return;
  const ctx = el.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(255, 138, 101, 0.4)");
  gradient.addColorStop(1, "rgba(255, 138, 101, 0)");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"],
      datasets: [
        {
          label: "Applications",
          data: [40, 50, 45, 85, 60, 70, 65],
          borderColor: "#FF8A65",
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          borderWidth: 0.8,
          pointRadius: 5,
          borderWidth: 1,
          pointBackgroundColor: "#FF8A65",
          pointHoverRadius: 12, 
          pointHoverBackgroundColor: "yellow", 
          animations: {
            radius: {
              duration: 400,
              easing: "linear",
              loop: (context) => context.active,
            },
          },
        },
      ],
    },
    options: {
      interaction: {
        mode: "nearest",
        intersect: false,
        axis: "x",
      },
      responsive: true,
      maintainAspectRatio: false,
      font: { family: "Montserrat, sans-serif" },
      scales: {
        x: {
          grid: { display: false },
          border: {
            display: false,
          },
          ticks: {
            padding: 10, 
            color: "#b5b5b5",
            font: {
              family: "Montserrat, sans-serif",
              weight: 500,
              size: 10,
            },
          },
        },
        y: {
          min: 25,
          max: 100,
          grid: { display: false },
          border: {
            display: false,
          },
          ticks: {
            callback: (value) => value + "%",
            stepSize: 25,
            font: {
              family: "Montserrat, sans-serif",
              weight: 500,
              size: 10,
            },
            color: "#b5b5b5",
          },
        },
      },
      animations: {
        radius: {
          duration: 400,
          easing: "linear",
          loop: (context) => context.active,
        },
        tension: {
          duration: 1500,
          easing: "easeInOutSine",
          from: 0.2,
          to: 0.5,
          loop: true,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.raw}%`,
          },
        },
      },
    },
  });
}

function initGenderChart() {
  const el = document.getElementById("genderChart");
  if (!el) return;
  const ctx = el.getContext("2d");

  const maleGradient = ctx.createLinearGradient(0, 0, 200, 0);
  maleGradient.addColorStop(0, "#7C3AED");
  maleGradient.addColorStop(1, "#A855F7");

  const femaleGradient = ctx.createLinearGradient(0, 0, 200, 0);
  femaleGradient.addColorStop(0, "#FB923C");
  femaleGradient.addColorStop(1, "#F97316");

const centerIconPlugin = {
  id: "centerIcon",

  beforeInit(chart) {
    chart._pulse = {
      start: performance.now(),
      raf: null,
    };
  },

  afterDraw(chart) {
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;
    const { x, y } = meta.data[0];
    const ctx = chart.ctx;
    const now = performance.now();
    const elapsed = (now - chart._pulse.start) / 1000;
    const scale = 1 + Math.sin(elapsed * Math.PI) * 0.05;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.font = "28px Arial";
    ctx.fillStyle = "#7C3AED";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("⚥", 0, 0);

    ctx.restore();

    if (chart.tooltip && chart.tooltip.opacity > 0) return;

    if (!chart._pulse.raf) {
      chart._pulse.raf = requestAnimationFrame(() => {
        chart._pulse.raf = null;
        chart.update("none");
      });
    }
  },
};


  const innerCirclePlugin = {
    id: "innerCircle",
    beforeDraw(chart) {
      const { ctx, chartArea } = chart;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      const radius =
        Math.min(
          chartArea.right - chartArea.left,
          chartArea.bottom - chartArea.top
        ) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.78, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 6;
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.72, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();
    },
  };

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Male", "Female"],
      datasets: [
        {
          data: [60, 40],
          backgroundColor: [maleGradient, femaleGradient],
          borderWidth: 0,
          hoverOffset: 0,
        },
      ],
    },
    options: {
      cutout: "90%",
      rotation: -90,
      circumference: 360,
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200,
        easing: "easeOutQuart",
        animateRotate: true,
        animateScale: true,
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 8,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: "#ffffff",
          titleColor: "#111827",
          bodyColor: "#374151",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: (tooltipItems) => {
              return tooltipItems[0].label;
            },
            label: (tooltipItem) => {
              const value = tooltipItem.raw;
              return `${value}%`;
            },
          },
        },
      },
    },
    plugins: [innerCirclePlugin, centerIconPlugin],
  });
}

createProgressChart("chartOrange", 46, "#ecbcbf");
createProgressChart("chartYellow", 60, "#fadb62");
createProgressChart("chartBlue", 74, "#6E00FF");

 initAcquisitionsChart('applicationChart', 70, '#6E00FF');
  initAcquisitionsChart('shortListChart', 50, '#fadb62');
  initAcquisitionsChart('rejectedChart', 35, '#ecbcbf');
  initAcquisitionsChart('onHoldChart', 20, '#d4b7ea',);
  initAcquisitionsChart('finalisedChart', 20, '#a5dfcb',);
// Master function that calls all individual charts
function initAllCharts() {
    createProgressChart();
    initActiveApplicationsChart();
    initAcquisitionsChart();
    initReceivedTimeChart();
    initGenderChart();
    console.log('All charts initialized successfully!');
}

// Expose only the master function (or all if you want individual control)
window.initCharts = initAllCharts;
