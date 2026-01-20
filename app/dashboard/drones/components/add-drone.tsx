"use client";

import { useState } from 'react';

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { getClientSession } from '@/lib/actions/user';
import { toast } from 'sonner';
import { useDronesStore } from '@/lib/Stores/drones-store';
import { Spinner } from '@/components/ui/loader';

interface AddDroneProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function AddDrone({ open, onOpenChange }: AddDroneProps) {
    const [name, setName] = useState('');
    const [serial_number, setSerialNumber] = useState('');
    const [model, setModel] = useState('');

    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : internalOpen;
    const currentOnOpenChange = isControlled ? onOpenChange || (() => {}) : setInternalOpen;

    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // const token = clientSession.;

    // DEBUG
    // console.log('Token in AddCompanyDialog:', clientSession);

    // Security check
    const handleCheck = () => {
        if (name === '') {
            toast.info('Le nom du drone est requis');
            return false;
        }
        if (serial_number === '') {
            toast.info('Le numéro de série est obligatoire');
            return false;
        }
        if (model === '') {
            toast.info('Veuillez spécifier le modèle du drone');
            return false;
        }
        return true;
    }

    const handleSubmit = async () => {

        // Verify fields
        if (!handleCheck()) return;

        // load state
        setLoading(true);

        const data = { name, serial_number, model };

        // Get max ID for optimistic update
        const drones = useDronesStore.getState().drones;
        const maxId = drones.length > 0 ? Math.max(...drones.map(d => d.id)) : 0;
        const tempId = maxId + 1;

        // Optimistic update
        const optimisticDrone = {
            id: tempId,
            name,
            serial_number,
            model,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date(),
        };
        useDronesStore.getState().addDrone(optimisticDrone);

        const session = await getClientSession();
        const token = session?.token;
        // if (!token) {
        //     alert('Session invalide');
        //     return;
        // }

        try {

            const response = await fetch(`${API_URL}/drones/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Drone ajouté avec succès');

                currentOnOpenChange(false);
                // reset form
                setName('');
                setSerialNumber('');
                setModel('');
            } else {
                toast.error('Échec de l\'ajout du drone');
                useDronesStore.getState().removeDrone(tempId);
            }
        } catch (error) {
            console.error(error);
            toast.error('Une erreur est survenue, veuillez réessayer');
            useDronesStore.getState().removeDrone(tempId);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={currentOpen} onOpenChange={currentOnOpenChange}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button className=" bg-primary hover:bg-primary/90 text-white">
                        <Icon icon="material-symbols-light:drone-2-sharp" className="text-3xl" />
                        Ajouter un drone
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <Icon icon="material-symbols-light:drone-2-sharp" className="text-5xl mb-2 mx-auto " />
                    <DialogTitle>Ajouter un drone</DialogTitle>
                    <DialogDescription>Remplissez ces champs pour ajouter un nouveau drone.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className='space-y-1'>
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" placeholder='Ex: Drone Alpha' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor="serial_number">Numéro de série</Label>
                        <Input id="serial_number" placeholder="Ex: SN123456" value={serial_number} onChange={(e) => setSerialNumber(e.target.value)} />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor="model">Modèle</Label>
                        <Input id="model" placeholder="Ex: DJI Mavic 3" value={model} onChange={(e) => setModel(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>

                    <Button onClick={handleSubmit} className='flex-1 gap-1' disabled={loading}>
                        {loading ? <Spinner /> : <Icon icon="lucide:plus" className="text-3xl" />}
                        <span>{loading ? 'En cours...' : 'Ajouter'}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}