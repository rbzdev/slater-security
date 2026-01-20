"use client"

import { useState, useEffect } from "react";
import { toast } from "sonner";

// UI Components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types
import { Drone, useDronesStore } from "@/lib/Stores/drones-store";
import { Spinner } from "@/components/ui/loader";

interface DroneEditProps {
    drone: Drone | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: (updatedDrone: Drone) => void;
}

export function DroneEdit({ drone, open, onOpenChange, onSave }: DroneEditProps) {
    const [formData, setFormData] = useState({
        name: '',
        serial_number: '',
        model: '',
        status: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // Populate form data when drone changes
    useEffect(() => {
        if (drone) {
            setFormData({
                name: drone.name,
                serial_number: drone.serial_number,
                model: drone.model,
                status: drone.status,
            });
        }
    }, [drone]);

    // Handle input changes
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle Save / Update Drone
    const handleSave = async () => {
        if (!drone) return;

        setIsLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/drones/${drone.id}/update/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                console.error('Failed to update drone:', response.statusText);
                throw new Error('Failed to update drone');
            }

            const updatedDrone: Drone = await response.json();
            // Update drone in the store
            useDronesStore.getState().setDrones(
                useDronesStore.getState().drones.map(d =>
                    d.id === updatedDrone.id ? updatedDrone : d
                )
            );

            // Call onSave callback if provided
            if (onSave) {
                onSave(updatedDrone);
            }

            toast.success('Drone mis à jour avec succès');
            onOpenChange(false);
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Modifier le Drone</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations du drone.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Nom du drone"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="serial_number">Numéro de série</Label>
                            <Input
                                id="serial_number"
                                value={formData.serial_number}
                                onChange={(e) => handleInputChange('serial_number', e.target.value)}
                                placeholder="Numéro de série"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="model">Modèle</Label>
                            <Input
                                id="model"
                                value={formData.model}
                                onChange={(e) => handleInputChange('model', e.target.value)}
                                placeholder="Modèle du drone"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="status">Statut</Label>
                            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner le statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Actif</SelectItem>
                                    <SelectItem value="inactive">Inactif</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="offline">Hors ligne</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Annuler
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? <> <Spinner /> Enregistrement... </> : 'Enregistrer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}