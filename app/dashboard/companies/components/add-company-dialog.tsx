"use client";

import { useState } from 'react';
import { getClientSession } from '@/lib/actions/user';
import { toast } from 'sonner';
import { useCompaniesStore } from '@/lib/Stores/companies-store';

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
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Spinner } from '@/components/ui/loader';

interface AddCompanyDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function AddCompanyDialog({ open, onOpenChange }: AddCompanyDialogProps) {
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [nb_users, setNbUsers] = useState(0);
    const [adress, setAdress] = useState('123, Avenue des Poids Lourds, Lubumbashi');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('email@example.com');

    const [loading, setLoading] = useState(false);

    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : internalOpen;
    const currentOnOpenChange = isControlled ? onOpenChange || (() => {}) : setInternalOpen;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;


    // const token = clientSession.;

    // DEBUG
    // console.log('Token in AddCompanyDialog:', clientSession);

    const handleCheck = () => {
        if (name === '') {
            toast.info("Le nom de l'entreprise est requis");
            return false;
        }
        if (industry === '') {
            toast.info('Le domaine d\'activité est requis');
            return false;
        }
        // if (nb_users <= 0) {
        //     toast.error("Le nombre d'utilisateurs doit être supérieur à 0");
        //     return false;
        // }
        if (adress === '') {
            toast.info('Adresse est requise');
            return false;
        }
        if (phone === '') {
            toast.info('Téléphone est requis');
            return false;
        }
        if (email === '') {
            toast.info('Email est requis');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!handleCheck()) return;
        const session = await getClientSession();
        const token = session?.token;
        // if (!token) {
        //     alert('Session invalide');
        //     return;
        // }

        setLoading(true);

        const data = { name, industry, nb_users, phone, email, address: adress };

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticCompany = {
            id: tempId,
            name,
            industry,
            nb_users,
            address: adress,
            phone,
            email,
            status: 'active',
            isActive: true,
            created_at: new Date(),
            updated_at: new Date(),
        };
        useCompaniesStore.getState().addCompany(optimisticCompany);

        try {
            const response = await fetch(`${API_URL}/tenants/creation/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Entreprise ajoutée avec succès');

                currentOnOpenChange(false);
                // reset form
                setName('');
                setIndustry('');
                setNbUsers(0);
                setPhone('');
                setEmail('');
            } else {
                toast.error('Échec de l\'ajout de l\'entreprise');
                useCompaniesStore.getState().removeCompany(tempId);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur');
            useCompaniesStore.getState().removeCompany(tempId);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={currentOpen} onOpenChange={currentOnOpenChange}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button className=" bg-primary hover:bg-primary/90 text-white">
                        <Icon icon="mdi:plus" className="" />
                        Nouvelle entreprise
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <Icon icon="f7:building-2" className="text-5xl mb-2 mx-auto" />
                    <DialogTitle>Ajouter une entreprise</DialogTitle>
                    <DialogDescription>Remplissez ces champs pour ajouter une entreprise.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className='space-y-1'>
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" placeholder='Ex: Divin Security' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor="adress">Adresse </Label>
                        <Input id="adress" placeholder="Ex: 123, Avenue du Poids Lourds, Lubumbashi" value={adress} onChange={(e) => setAdress(e.target.value)} />
                    </div>

                    <div className='space-y-1'>
                        <Label htmlFor="industry">Domaine d'activité</Label>
                        <Input id="industry" placeholder="Ex: Mine" value={industry} onChange={(e) => setIndustry(e.target.value)} />
                    </div>



                    <div className='space-y-1'>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" placeholder="Ex: +243 123 456 789" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>

                    <div className='space-y-1'>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Ex: contact@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className='flex items-center gap-2 justify-between'>
                        <div>
                            <Label htmlFor="logo">Statut</Label>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Choisir le statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Statut</SelectLabel>
                                        <SelectItem value="apple">Active </SelectItem>
                                        <SelectItem value="banana"> Désactivé </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                            <div className='flex-1'>
                                <Label htmlFor="nb_users">Nombre d'agents</Label>
                                <Input id="nb_users" type="number" value={nb_users} onChange={(e) => setNbUsers(Number(e.target.value))} />
                            </div>

                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? <Spinner />  : <Icon icon="lucide:plus" className="text-xl" />}
                        {loading ? "Ajout en cours..." : "Ajouter l'entreprise"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}