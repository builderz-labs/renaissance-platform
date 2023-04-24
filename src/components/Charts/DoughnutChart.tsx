import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
};

export function DoughnutChart({ report }: any) {
  const outstandingRoyalties = report.total.totalOutstandingRoyalties;
  const royaltiesPaid =
    report.total.totalRoyaltiesPaid;
  const redemptions = report.total.totalRedemptions;

  const total = royaltiesPaid + outstandingRoyalties + redemptions;
  const royaltiesPaidPercent = ((royaltiesPaid / total) * 100).toFixed(2);
  const outstandingRoyaltiesPercent = (
    (outstandingRoyalties / total) *
    100
  ).toFixed(2);
  const redemptionsPercent = ((redemptions / total) * 100).toFixed(2);

  const data = {
    labels: [
      `${royaltiesPaidPercent}% Royalties Paid`,
      `${outstandingRoyaltiesPercent}% Royalties Outstanding`,
      `${redemptionsPercent}% Redemptions`,
    ],
    datasets: [
      {
        data: [
          royaltiesPaidPercent,
          outstandingRoyaltiesPercent,
          redemptionsPercent,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={data} />;
}
