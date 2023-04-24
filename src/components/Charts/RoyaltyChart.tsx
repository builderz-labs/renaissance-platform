import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

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
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'LILY Royalties last 90d',
        },
    },
};

const labels = ['1/8/2023', '1/22/2023', '2/5/2023', '2/19/2023', '3/23/2023', '3/5/2023', '3/19/2023'];



export function RoyaltyChart({ report }: any) {

    const labels = report.metricsByDay.map((item) => item.date);
    const outstandingRoyalties = report.metricsByDay.map((item) => item.outstandingRoyalties);
    const royaltiesPaid = report.metricsByDay.map((item) => item.royaltiesPaid);
    const sales = report.metricsByDay.map((item) => item.sales);
    const salesVolume = report.metricsByDay.map((item) => item.salesVolume);
    const percentagePaid = report.metricsByDay.map((item) => item.percentagePaid);

    const data = {
        labels,
        datasets: [
            {
                label: 'Sales',
                data: sales,
                borderColor: '#6D9EEB',
                backgroundColor: '#6D9EEB',
            },
            {
                label: 'Royalties Paid',
                data: royaltiesPaid,
                borderColor: '#92C47C',
                backgroundColor: '#92C47C',
            },
            {
                label: 'Outstanding Royalties',
                data: outstandingRoyalties,
                borderColor: '#FFD965',
                backgroundColor: '#FFD965',
            },
        ],
    };

    return <Line options={options} data={data} />;
}