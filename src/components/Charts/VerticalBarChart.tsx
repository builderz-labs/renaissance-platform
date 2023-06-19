import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Sales",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "#6D9EEB",
      backgroundColor: "#6D9EEB",
    },
    {
      label: "Sales Volume",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "#E06666",
      backgroundColor: "#E06666",
    },
    {
      label: "Royalties Paid",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "#92C47C",
      backgroundColor: "#92C47C",
    },
    {
      label: "Outstanding Royalties",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "#FFD965",
      backgroundColor: "#FFD965",
    },
    {
      label: "% Paid",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "#9915FB",
      backgroundColor: "#9915FB",
    },
  ],
};

export function VerticalBarChart() {
  return <Bar options={options} data={data} />;
}
