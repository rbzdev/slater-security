"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

// UI Components
import { Tab } from '@/components/ui/tab';

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MonitoringProps {
    className?: string;
}

type FilterType = 'Jour' | 'Semaine' | 'Mois';

const mockData = {
    day: {
        categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        missions: [40, 15, 25, 20, 40, 30, 32],
        drones: [10, 32, 20, 45, 10, 20, 14],
    },
    week: {
        categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        missions: [20, 80, 32, 50, 39, 100, 70],
        drones: [45, 70, 40, 40, 35, 60, 90],
    },
    month: {
        categories: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        missions: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 20),
        drones: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 5),
    },
};

export default function Monitoring({ className }: MonitoringProps) {
    const [filter, setFilter] = useState<FilterType>('Jour');

    const filterMap: Record<FilterType, keyof typeof mockData> = {
        'Jour': 'day',
        'Semaine': 'week',
        'Mois': 'month',
    };

    const data = mockData[filterMap[filter]];

    const options = {
        chart: {
            type: 'line' as const,
            height: 350,
            zoom: {
                enabled: true,
            },
            toolbar: {
                show: true,
            },
        },
        xaxis: {
            categories: data.categories,
        },
        yaxis: {
            title: {
                text: 'Nombre',
            },
        },
        stroke: {
            curve: 'smooth' as const,
        },
        markers: {
            size: 0,
        },
        tooltip: {
            shared: true,
            intersect: false,
        },
    };

    const series = [
        {
            name: 'Missions',
            data: data.missions,
        },
        {
            name: 'Drones',
            data: data.drones,
        },
    ];

    return (
        <div className={`p-6 h-full w-full flex flex-col space-y-4 bg-white dark:bg-neutral-800/50 rounded-xl ${className}`}>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold"> Surveillance </h2>

            <div className="flex space-x- border rounded-xl w-fit gap-2 p-1">
                <Tab text="Jour" selected={filter === 'Jour'} setSelected={(text) => setFilter(text as FilterType)} />
                <Tab text="Semaine" selected={filter === 'Semaine'} setSelected={(text) => setFilter(text as FilterType)} />
                <Tab text="Mois" selected={filter === 'Mois'} setSelected={(text) => setFilter(text as FilterType)} />
            </div>
            </div>

            <div className="flex-1">
                <ApexChart
                    options={options}
                    series={series}
                    type="area"
                    height={350}
                />
            </div>
        </div>
    );
}