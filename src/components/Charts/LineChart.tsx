import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "Volume last 90d",
    },
  },
};

export function LineChart({ report }: any) {
  const labels = report.metricsByDay.map((item) => item.date);
  const outstandingRoyalties = report.metricsByDay.map(
    (item) => item.outstandingRoyalties
  );
  const royaltiesPaid = report.metricsByDay.map((item) => item.royaltiesPaid);
  const sales = report.metricsByDay.map((item) => item.sales);
  const salesVolume = report.metricsByDay.map((item) => item.salesVolume);
  const percentagePaid = report.metricsByDay.map((item) => item.percentagePaid);

  const data = {
    labels,
    datasets: [
      // {
      //     label: "Sales",
      //     data: sales,
      //     borderColor: "#6D9EEB",
      //     backgroundColor: "#6D9EEB",
      // },
      {
        label: "Sales Volume",
        data: salesVolume,
        borderColor: "#E06666",
        backgroundColor: "#E06666",
      },
      // {
      //     label: "Royalties Paid",
      //     data: royaltiesPaid,
      //     borderColor: "#92C47C",
      //     backgroundColor: "#92C47C",
      // },
      // {
      //     label: "Outstanding Royalties",
      //     data: outstandingRoyalties,
      //     borderColor: "#FFD965",
      //     backgroundColor: "#FFD965",
      // },
      // {
      //     label: "% Paid",
      //     data: percentagePaid,
      //     borderColor: "#9915FB",
      //     backgroundColor: "#9915FB",
      // },
    ],
  };
  return <Line options={options} data={data} />;
}
