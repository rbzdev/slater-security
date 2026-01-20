"use client";

import { Icon } from "@iconify/react";
import { progress } from "framer-motion";


const mockData = [
    {
        id: 1,
        title: "Missions",
        value: 789,
        icon: "heroicons-outline:flag",
        progress: 70,
        rangeTime: "weekly"
    },
    {
        id: 2,
        title: "Agents",
        value: 34,
        icon: "heroicons-outline:user-group",
        progress: -13,
        rangeTime: "monthly"
    },
    {
        id: 3,
        title: "Entreprises",
        value: 260,
        icon: "heroicons-outline:office-building",
        progress: 23,
        rangeTime: "yearly"
    },
    {
        id: 4,
        title: "Drones",
        value: 1234,
        icon: "lucide:drone",
        progress: 43,
        rangeTime: "weekly"
    },
]

export default function OverView() {
    return (
        <div className="p-4 bg-white dark:bg-neutral-800/50 rounded-xl  grid grid-cols-4 gap-2">
            {mockData.map((item) => (
                <div key={item.id} className=" last:mb-0 border-r last:border-0 p-4">
                    <div className="flex flex-col items-start justify-start space-y-3">

                        <div className="flex items-center gap-1 text-foreground ">
                            <Icon icon={item.icon} className="text-sm" />
                            <h3 className="text-sm">{item.title}</h3>
                        </div>
                        <p className="text-xl font-semibold">{item.value}</p>

                        {/* Stats */}
                        <div className="flex items-center justify-between w-full gap-2 mt-2 ">
                            <div className="flex items-center gap-1">
                                <span className={`text-sm ${item.progress > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {item.progress > 0 ? `+${item.progress}%` : `${item.progress}%`}
                                </span>
                                <span className="text-sm text-gray-500">
                                    vs {item.rangeTime === "monthly" ? "le mois passé" : item.rangeTime === "weekly" ? "la semaine passée" : item.rangeTime === "yearly" ? "L'année dernière" : ""}

                                </span>
                            </div>

                            <Icon icon={item.progress > 0 ? "iconamoon:trend-up-light" : "iconamoon:trend-down-light"} className={`text-xl ${item.progress > 0 ? 'text-green-500' : 'text-red-500'}`} />
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}