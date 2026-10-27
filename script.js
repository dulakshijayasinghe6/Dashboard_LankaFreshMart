"use strict";

// Scenario data: monthly revenue is in LKR thousands.
const salesData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  revenue: [1250, 1180, 1420, 1610, 1550, 1780],
  units: [3400, 3150, 3900, 4300, 4050, 4700],
  branches: ["Colombo", "Kandy", "Galle"],
  branchQ2: [2450, 1320, 1170],
};
const formatNumber = (number) => new Intl.NumberFormat("en-LK").format(number);
const totalRevenue = salesData.revenue.reduce((sum, value) => sum + value, 0);
const totalUnits = salesData.units.reduce((sum, value) => sum + value, 0);
const bestMonthIndex = salesData.revenue.indexOf(
  Math.max(...salesData.revenue),
);
const bestBranchIndex = salesData.branchQ2.indexOf(
  Math.max(...salesData.branchQ2),
);

// Calculate and populate all four KPIs using JavaScript.
document.getElementById("totalRevenue").textContent =
  `LKR ${formatNumber(totalRevenue)}K`;
document.getElementById("totalUnits").textContent = formatNumber(totalUnits);
document.getElementById("bestMonth").textContent =
  salesData.months[bestMonthIndex];
document.getElementById("bestMonthNote").textContent =
  `LKR ${formatNumber(salesData.revenue[bestMonthIndex])}K revenue`;
document.getElementById("bestBranch").textContent =
  salesData.branches[bestBranchIndex];
document.getElementById("bestBranchNote").textContent =
  `LKR ${formatNumber(salesData.branchQ2[bestBranchIndex])}K in Q2`;
document.getElementById("insightText").textContent =
  `${salesData.months[bestMonthIndex]} generated the highest monthly revenue (LKR ${formatNumber(salesData.revenue[bestMonthIndex])}K), while ${salesData.branches[bestBranchIndex]} led Q2 branch sales. Total units sold across January–June: ${formatNumber(totalUnits)}.`;

// Mobile menu toggle and accessible expanded state.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
  menuToggle.textContent = isOpen ? "✕" : "☰";
});
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => {
      item.classList.remove("active");
      item.removeAttribute("aria-current");
    });
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.textContent = "☰";
  });
});

// Chart.js graphs with labeled axes, tooltips, and responsive resizing.
Chart.defaults.font.family = "DM Sans, sans-serif";
const axisColor = () =>
  getComputedStyle(document.body).getPropertyValue("--muted").trim();
const gridColor = () =>
  getComputedStyle(document.body).getPropertyValue("--grid").trim();
const sharedOptions = (yTitle) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => ` LKR ${formatNumber(context.parsed.y)}K`,
      },
    },
  },
  scales: {
    x: {
      title: { display: true, text: "Month / Branch", color: axisColor() },
      ticks: { color: axisColor() },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      title: { display: true, text: yTitle, color: axisColor() },
      ticks: { color: axisColor() },
      grid: { color: gridColor() },
    },
  },
});
const revenueOptions = sharedOptions("Revenue (LKR 000s)");
revenueOptions.scales.x.title.text = "Month";
const branchOptions = sharedOptions("Q2 Revenue (LKR 000s)");
branchOptions.scales.x.title.text = "Branch";
const revenueChart = new Chart(document.getElementById("revenueChart"), {
  type: "line",
  data: {
    labels: salesData.months,
    datasets: [
      {
        label: "Monthly Revenue",
        data: salesData.revenue,
        borderColor: "#4268ed",
        backgroundColor: "rgba(66,104,237,.12)",
        fill: true,
        tension: 0.38,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: "#4268ed",
        borderWidth: 3,
      },
    ],
  },
  options: revenueOptions,
});
const branchChart = new Chart(document.getElementById("branchChart"), {
  type: "bar",
  data: {
    labels: salesData.branches,
    datasets: [
      {
        label: "Q2 Revenue",
        data: salesData.branchQ2,
        backgroundColor: ["#4268ed", "#8b9ff4", "#bdcafa"],
        borderRadius: 8,
        maxBarThickness: 70,
      },
    ],
  },
  options: branchOptions,
});

// Theme toggle updates the chart axes as well as the page colors.
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark");
  themeToggle.textContent = dark ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    dark ? "Switch to light mode" : "Switch to dark mode",
  );
  [revenueChart, branchChart].forEach((chart) => {
    chart.options.scales.x.title.color = axisColor();
    chart.options.scales.y.title.color = axisColor();
    chart.options.scales.x.ticks.color = axisColor();
    chart.options.scales.y.ticks.color = axisColor();
    chart.options.scales.y.grid.color = gridColor();
    chart.update();
  });
});
