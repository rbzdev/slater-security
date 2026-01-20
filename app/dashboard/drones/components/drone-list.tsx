"use client";


import { useDronesStore } from "@/lib/Stores/drones-store";
import { useState } from "react";
import { getClientSession } from "@/lib/actions/user";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DroneDetails } from "./drone-details";
import { DroneEdit } from "./drone-edit";


export default function DronesList() {
    const { drones } = useDronesStore();
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedDrone, setSelectedDrone] = useState<any>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDroneForDetails, setSelectedDroneForDetails] = useState<any>(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Delete a drone via his ID
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleDelete = async (droneId: number) => {
        setDeletingId(droneId);
        // Get user session Token ( Decrypted )
        const session = await getClientSession();
        const token = session?.token;
        // console.log(`Delete drone with ID: ${droneId}`);
        try {
            const response = await fetch(`${API_URL}/drones/${droneId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                // Successfully deleted
                console.log(`Drone with ID: ${droneId} deleted successfully.`);
                toast.success('Drone supprimé avec succès');

                // Refresh the list or update state here
                useDronesStore.getState().removeDrone(droneId);

                toast.success('Drone supprimé avec succès');
            } else {
                console.error(`Failed to delete drone with ID: ${droneId}.`);
                toast.error('Échec de la suppression du drone');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de la suppression');
        } finally {
            setDeletingId(null);
        }
    }

    const handleViewDrone = (drone: any) => {
        setSelectedDroneForDetails(drone);
        setIsDetailsDialogOpen(true);
    };

    const handleEditDrone = (drone: any) => {
        setSelectedDroneForDetails(drone);
        setIsEditDialogOpen(true);
    };

    // DEBUG 
    // drones ? console.log('Drones data:', drones) : console.log('No drones data provided');

    if (!drones || !Array.isArray(drones) || drones.length === 0) {
        return (
            <div className="flex flex-col h-100 items-center justify-center">
                <Icon icon="icon-park-twotone:drone" className="inline-block text-7xl dark:text-9xl text-red-400" />
                Aucun drone trouvé ou données invalides.
                <Button variant="default" className="mt-4">
                    <span>Actualiser</span>
                    <Icon icon="icon-park-outline:refresh" />
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Flotte de Drones de Surveillance</h2>
            <div className="overflow-x-hidden border rounded-t-xl!">

                <table className="w-full border-collapse    ">
                    <thead className="">
                        <tr className="bg-gray-100 dark:bg-gray-100/10">
                            {/* <th className="border border-accent px-4 py-2 text-left ">ID</th> */}
                            <th className="border border-accent px-4 py-2 text-left">Nom</th>
                            <th className="border border-accent px-4 py-2 text-left"> batterie (Dernière fois) </th>
                            <th className="border border-accent px-4 py-2 text-left">Dernière posittion </th>
                            <th className="border border-accent px-4 py-2 text-left">Statut</th>
                            {/* <th className="border border-accent px-4 py-2 text-left">Créé le</th> */}
                            <th className="border border-accent px-4 py-2 text-left">Modifié</th>
                            <th className="border border-accent px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drones.map((drone) => (
                            <tr key={drone.id} className="hover:bg-primary/10 ">
                                {/* <td className="border border-accent px-4 py-2 text-sm font-mono">{drone.id}</td> */}
                                <td className="border border-accent px-4 py-2">{drone.name}</td>
                                <td className="border border-accent px-4 py-2 text-center">{drone.last_battery_level || "-"}</td>
                                {/* Last position */}
                                <td className="border border-accent px-4 py-2">
                                    <Button 
                                    variant="ghost" 
                                    onClick={() => { setSelectedDrone(drone); setDialogOpen(true); }}
                                    size={"sm"}
                                    className="text-primary hover:bg-primary hover:text-white dark:hover:bg-primary "
                                    >
                                        <Icon icon="gis:map-route" className=" h-4 w-4" />
                                        Voir sur la carte
                                    </Button>
                                </td>
                                <td className="border border-accent px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${
                                        drone.status === "actif" ? 'bg-green-100 text-green-800' :
                                        drone.status === "idle" ? 'bg-yellow-100 text-yellow-800' :
                                        drone.status === "maintenance" ? 'bg-red-100 text-orange-800' :
                                        drone.status === "on_mission" ? 'bg-green-500/20 text-emerald-500 border border-emerald-300'  :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {drone.status === "actif" ? (
                                            <>
                                                <Icon icon="mdi:check-circle" className="h-4 w-4" />
                                                Actif
                                            </>
                                        ) : drone.status === "idle" ? (
                                            <>
                                                <Icon icon="mdi:circle-outline" className="h-4 w-4" />
                                                Inactif
                                            </>
                                        ) : drone.status === "maintenance" ? (
                                            <>
                                                <Icon icon="ix:maintenance-triangle" className="h-4 w-4" />
                                                Maintenance
                                            </>
                                        ) : drone.status === "on_mission" ? (
                                            <>
                                                <Icon icon="ph:flag-duotone" className="h-4 w-4" />
                                                En mission
                                            </>
                                        ) : (
                                            drone.status
                                        )}
                                    </span>
                                </td>
                                {/* <td className="border border-accent px-4 py-2 text-center">{drone.created_at ? new Date(drone.created_at).toLocaleDateString() : "-"}</td> */}
                                <td className="border border-accent px-4 py-2 text-center">{drone.updated_at ? new Date(drone.updated_at).toLocaleDateString() : "-"}</td>

                                <td className="border border-accent px-4 py-2 flex items-center justify-center">

                                        <div className="flex">
                                            <Button variant={"ghost"} onClick={() => handleViewDrone(drone)}>
                                                <Icon icon="solar:eye-bold" className="mr-2 h-4 w-4" />
                                            </Button>
                                            <Button variant={"ghost"} onClick={() => handleEditDrone(drone)}>
                                                <Icon icon="basil:edit-outline" className="mr-2 h-4 w-4" />
                                            </Button>
                                            <Button variant={"ghost"} onClick={() => handleDelete(drone.id)} disabled={deletingId === drone.id}>
                                                <Icon icon="ant-design:delete-outlined" className="mr-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                
                                    {/* <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="hover:border data-[state=open]:bg-primary/50">
                                            <Button variant="ghost" className="h-8 w-8 p-0 ">
                                                <Icon icon="ant-design:more-outlined" className="" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Icon icon="basil:edit-outline" className="mr-2 h-4 w-4" />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(drone.id)} disabled={deletingId === drone.id}>
                                                <Icon icon="ant-design:delete-outlined" className="mr-2 h-4 w-4" />
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <DialogHeader>
                            <DialogTitle>Position du Drone</DialogTitle>
                        </DialogHeader>
                        {selectedDrone && (
                            <div>
                                Dernière position: {selectedDrone.last_position
                                    ? typeof selectedDrone.last_position === 'string'
                                        ? selectedDrone.last_position
                                        : `${selectedDrone.last_position.latitude}, ${selectedDrone.last_position.longitude}`
                                    : "Non disponible"}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Drone Details Dialog */}
                <DroneDetails drone={selectedDroneForDetails} open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} />

                {/* Drone Edit Dialog */}
                <DroneEdit drone={selectedDroneForDetails} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
            </div>
        </div>
    );
}