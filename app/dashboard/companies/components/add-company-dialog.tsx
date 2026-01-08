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
import { getClientSession } from '@/lib/actions/user';
import { toast } from 'sonner';

export default function AddCompanyDialog() {
    const [name, setName] = useState('Kamoa Cooper');
    const [industry, setIndustry] = useState('Mining Company');
    const [nb_users, setNbUsers] = useState(0);
    const [adress, setAdress] = useState('123, Avenue des Poids Lourds, Lubumbashi');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('email@example.com');
    const [open, setOpen] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // const token = clientSession.;

    // DEBUG
    // console.log('Token in AddCompanyDialog:', clientSession);

    const handleSubmit = async () => {
        const session = await getClientSession();
        const token = session?.token;
        // if (!token) {
        //     alert('Session invalide');
        //     return;
        // }

        const data = { name, industry, nb_users, phone, email, address: adress };
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

                setOpen(false);
                // reset form
                setName('');
                setIndustry('');
                setNbUsers(0);
                setPhone('');
                setEmail('');
            } else {
                toast.error('Échec de l\'ajout de l\'entreprise');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className=" bg-primary hover:bg-primary/90 text-white">
                    <Icon icon="mdi:plus" className="" />
                    Nouvelle entreprise
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
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
                    <Button onClick={handleSubmit}>Ajouter</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}