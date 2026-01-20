"use client";

import { useState, useEffect } from 'react';
import { getClientSession } from '@/lib/actions/user';
import { toast } from 'sonner';
import { useCompaniesStore } from '@/lib/Stores/companies-store';
import { useAgentsStore } from '@/lib/Stores/agents-store';

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

interface Role {
    id: number;
    alias: string;
    name: string;
    description: string;
}

interface AddCompanyDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function AddAgent({ open, onOpenChange }: AddCompanyDialogProps) {
    const [email, setEmail] = useState('johndoe@int.com');
    const [prenom, setPrenom] = useState('John');
    const [nom, setNom] = useState('Doe');
    const [password, setPassword] = useState('1234');
    const [tenantName, setTenantName] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [role, setRole] = useState('');

    const [roles, setRoles] = useState<Role[]>([]);

    const [companiesLoading, setCompaniesLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    // Password Toggle
    const [showPassword, setShowPassword] = useState(false);

    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const currentOpen = isControlled ? open : internalOpen;
    const currentOnOpenChange = isControlled ? onOpenChange || (() => { }) : setInternalOpen;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Get companies from store
    const companies = useCompaniesStore((state) => state.companies);

    const handleFetchCompanies = async () => {
        setCompaniesLoading(true);
        const session = await getClientSession();
        const token = session?.token;

        try {
            const response = await fetch(`${API_URL}/tenants/list/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();

                // DEBUG
                // console.log('Fetched companies in AddAgent:', data);
                useCompaniesStore.getState().setCompanies(data);

            } else {
                toast.error('Échec de récupération des entreprises');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de la récupération des entreprises');
        } finally {
            setCompaniesLoading(false);
        }
    };


    // // DEBUG
    // console.log('Companies in AddAgent:', companies);


    // Fetch roles on mount
    useEffect(() => {
        const fetchRoles = async () => {
            const session = await getClientSession();
            const token = session?.token;

            try {
                const response = await fetch(`${API_URL}/roles/roles_list/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setRoles(data);
                } else {
                    toast.error('Échec de récupération des rôles');
                }
            } catch (error) {
                console.error(error);
                toast.error('Erreur lors de la récupération des rôles');
            }
        };
        fetchRoles();
    }, [API_URL]);

    // Validation
       const handleCheck = () => {
        if (email === '') {
            toast.info('Email est requis');
            return false;
        }
        if (prenom === '') {
            toast.info('Prénom est requis');
            return false;
        }
        if (nom === '') {
            toast.info('Nom est requis');
            return false;
        }
        if (password === '') {
            toast.info('Mot de passe est requis');
            return false;
        }
        // if (company === '') {
        //     toast.info('Entreprise est requise');
        //     return false;
        // }
        if (role === '') {
            toast.info('Rôle est requis');
            return false;
        }
        return true;
    }


    // Submit handler to add agent
    const handleSubmit = async () => {
        
        // Verify fields
        if (!handleCheck()) return;

        const session = await getClientSession();
        const token = session?.token;

        // DEBUG
        // console.log('Fetching companies with token:', token);

        setLoading(true);

        const data = { email, first_name: prenom, last_name: nom, password, tenant_id: tenantId, role_id: parseInt(role) };

        // DEBUG
        // console.log('Agent data to submit:', data);

        // Optimistic update
        const agents = useAgentsStore.getState().agents;
        const maxId = agents.length > 0 ? Math.max(...agents.map(a => a.id)) : 0;
        const tempId = maxId + 1;
        
        const optimisticAgent = {
            id: tempId,
            email,
            first_name: prenom,
            last_name: nom,
            role_name: roles.find(r => r.id === parseInt(role))?.name || 'Unknown',
            password,
            date_joined: new Date(),
            tenant_name: companies.find(c => c.id.toString() === tenantId)?.name || 'Unknown',
        };
        useAgentsStore.getState().addAgent(optimisticAgent);

        try {
            const response = await fetch(`${API_URL}/accounts/manager/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Agent ajouté avec succès');

                currentOnOpenChange(false);
                // reset form
                setEmail('');
                setPrenom('');
                setNom('');
                setPassword('');
                setTenantName('');
                setRole('');
            } else {
                toast.error('Échec de l\'ajout de l\'agent');
                useAgentsStore.getState().removeAgent(tempId);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur');
            useAgentsStore.getState().removeAgent(tempId);
        } finally {
            setLoading(false);
        }
    };

    const setTenant = (value: string) => {
        const company = companies.find(c => c.id.toString() === value);

        // DEBUG
        // console.log('Selected company for tenant:', company);
        
        if (company) {
            setTenantId(company.id.toString());
            setTenantName(company.name);
        }
    }

    return (
        <Dialog open={currentOpen} onOpenChange={currentOnOpenChange}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button className=" bg-primary hover:bg-primary/90 text-white">
                        <Icon icon="wpf:administrator" className="" />
                        Ajouter un agent
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <Icon icon="wpf:administrator" className="text-5xl mb-2 mx-auto" />
                    <DialogTitle>Ajouter un agent</DialogTitle>
                    <DialogDescription>Remplissez ces champs pour ajouter un agent.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className='space-y-1'>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Ex: agent@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className='space-y-1 flex-1'>
                            <Label htmlFor="prenom">Prénom</Label>
                            <Input id="prenom" placeholder="Ex: Jean" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                        </div>
                        <div className='space-y-1 flex-1'>
                            <Label htmlFor="nom">Nom</Label>
                            <Input id="nom" placeholder="Ex: Dupont" value={nom} onChange={(e) => setNom(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className='space-y-1 flex-1 '>
                            <Label htmlFor="password">Mot de passe</Label>

                            <div className="relative">
                                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Icon
                                    icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        <div className='space-y-1 flex-1 '>
                            <Label htmlFor="company">Entreprise</Label>
                            <Select value={tenantId} onValueChange={setTenant} onOpenChange={(open) => { if (open && companies.length === 0) handleFetchCompanies(); }}>
                                <SelectTrigger className='flex-1!'>
                                    <SelectValue placeholder="Choisir une entreprise" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Entreprises</SelectLabel>
                                        {companiesLoading ? (
                                            <div className="p-2">Chargement...</div>
                                        ) : (
                                            companies.map((comp) => (
                                                <SelectItem key={comp.id} value={comp.id.toString()}>
                                                    {comp.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>


                    <div className='space-y-1 w-1/2'>
                        <Label htmlFor="role">Rôle</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Rôles</SelectLabel>
                                    {roles.map((roleItem) => (
                                        <SelectItem key={roleItem.id} value={roleItem.id.toString()}>
                                            {roleItem.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? <Spinner /> : <Icon icon="lucide:plus" className="text-xl" />}
                        {loading ? "Ajout en cours..." : "Ajouter l'agent"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}