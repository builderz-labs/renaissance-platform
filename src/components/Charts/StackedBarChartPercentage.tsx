import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: "Royalties and Redemptions Stacked Bar Chart",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      ticks: {
        callback: (value: any) => `${value.toFixed(0)}%`, // Format ticks as percentages
      },
      max: 100, //
    },
  },
};

export function StackedBarChartPercentage({ report }: any) {
  const labels = report.metricsByDay.map((item: any) => item.date);
  const royaltiesPaid = report.metricsByDay.map(
    (item: any) => item.royaltiesPaid
  );
  const redemptions = report.metricsByDay.map((item: any) => item.redemptions);
  const outstanding = report.metricsByDay.map(
    (item: any) => item.outstandingRoyalties
  );

  // If cumulative use this:
  // let cumulativeRoyalties = 0;
  // const cumulativeRoyaltiesArr = royaltiesPaid.map((item, index) => {
  //   cumulativeRoyalties += item;
  //   return cumulativeRoyalties;
  // });

  // let cumulativeRedemptions = 0;
  // const cumulativeRedemptionsArr = redemptions.map((item, index) => {
  //   cumulativeRedemptions += item;
  //   return cumulativeRedemptions;
  // });

  // let outstandingRoyalties = 0;
  // const outstandingRoyaltiesArr = outstanding.map((item, index) => {
  //   outstandingRoyalties += item
  //   return outstandingRoyalties;
  // });

  // Percentages
  const totalArr = labels.map((_: any, index: any) => {
    return royaltiesPaid[index] + redemptions[index] + outstanding[index];
  });

  const cumulativeRoyaltiesPercentArr = royaltiesPaid.map(
    (item: any, index: any) => {
      return (item / totalArr[index]) * 100;
    }
  );

  const cumulativeRedemptionsPercentArr = redemptions.map(
    (item: any, index: any) => {
      return (item / totalArr[index]) * 100;
    }
  );

  const outstandingRoyaltiesPercentArr = outstanding.map(
    (item: any, index: any) => {
      return (item / totalArr[index]) * 100;
    }
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Cumulative Royalties",
        data: cumulativeRoyaltiesPercentArr,
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "Cumulative Redemptions",
        data: cumulativeRedemptionsPercentArr,
        backgroundColor: "rgb(75, 192, 192)",
      },
      {
        label: "Outstanding Royalties",
        data: outstandingRoyaltiesPercentArr,
        backgroundColor: "rgb(53, 162, 235)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
