"use client"

import { useState } from "react";

// UI Components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

// Types
import { Drone } from "@/lib/Stores/drones-store";
import Link from "next/link";

export function DroneDetails({ drone, open, onOpenChange }: { drone: Drone | null, open: boolean, onOpenChange: (open: boolean) => void }) {

    // DEBUG
    console.log("Drone Details Dialog Opened for:", drone);

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'online':
                return 'success';
            case 'inactive':
            case 'offline':
                return 'destructive';
            case 'maintenance':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <Icon icon="lucide:drone" className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">{drone?.name}</DialogTitle>
                            <Badge variant={getStatusColor(drone?.status || '')} className="mt-1">
                                {drone?.status}
                            </Badge>
                        </div>
                    </div>
                    <DialogDescription>
                        Informations du drone
                    </DialogDescription>
                </DialogHeader>

                {drone && (
                    <div className="space-y-6">
                        {/* Informations générales */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Icon icon="lucide:drone" className="w-5 h-5" />
                                Informations générales
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Nom</label>
                                        <p className="text-base font-medium">{drone.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Numéro de série</label>
                                        <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{drone.serial_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Modèle</label>
                                        <p className="text-base">{drone.model}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-muted-foreground">Statut</label>
                                        <Badge variant={getStatusColor(drone.status)}>
                                            {drone.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3 border-l pl-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Niveau de batterie</label>
                                        <p className="text-base flex items-center gap-2">
                                            <Icon icon="lucide:battery" className="w-4 h-4" />
                                            {drone.last_battery_level ? `${drone.last_battery_level}%` : 'N/A'}
                                        </p>
                                    </div>
                                    {drone.last_position && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Dernière position</label>
                                            <Link
                                                href={`https://maps.google.com?q=${drone.last_position.latitude},${drone.last_position.longitude}`}
                                                className="text-base flex items-center gap-2 hover:underline"
                                                target="_blank"
                                            >
                                                <Icon icon="lucide:map-pin" className="w-4 h-4" />
                                                {drone.last_position.latitude.toFixed(6)}, {drone.last_position.longitude.toFixed(6)}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Historique */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Icon icon="hugeicons:transaction-history" className="w-5 h-5" />
                                Historique
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Créé le</label>
                                    <p className="text-base">{formatDate(drone.created_at)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Dernière modification</label>
                                    <p className="text-base">{formatDate(drone.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}