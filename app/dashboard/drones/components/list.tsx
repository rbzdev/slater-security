"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

interface Drone {
    id: number;
    name: string;
    status: string;
    // Add other properties as needed
}

interface DronesListProps {
    drones: Drone[];
}

export default function DronesList({ drones }: DronesListProps) {
    if (!drones || !Array.isArray(drones) || drones.length === 0) {
        console.log('Drones data:', drones);
        return (
            <div className="flex flex-col h-100 items-center justify-center ">

                <Icon icon="icon-park-twotone:drone" className="inline-block text-7xl dark:text-9xl text-red-400" />
                Aucun drone trouvé ou données invalides.

                <Button variant="default" className="mt-4" >
                    <span>Actualiser</span>
                    <Icon icon="icon-park-outline:refresh" />
                </Button>

            </div>
        )
            ;
    }

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Liste des Drones</h2>
            <ul className="space-y-2">
                {drones.map((drone) => (
                    <li key={drone.id} className="border p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium">{drone.name}</h3>
                                <p className="text-sm text-gray-600">ID: {drone.id}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-sm ${drone.status === 'active' ? 'bg-green-100 text-green-800' :
                                    drone.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {drone.status}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}