"use client"

import { useState, useEffect, useCallback } from "react";
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
import { Agent, useAgentsStore } from "@/lib/Stores/agents-store";
import { Spinner } from "@/components/ui/loader";
import { getClientSession } from "@/lib/actions/user";
import { Role } from "@/lib/types/role";

interface AgentEditProps {
    agent: Agent | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: (updatedAgent: Agent) => void;
}

export function AgentEdit({ agent, open, onOpenChange, onSave }: AgentEditProps) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role_id: '',
    });

    // STATES
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);


    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Fetch roles function
    const fetchRoles = useCallback(async () => {
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

                // // DEBUG
                // console.log("Fetched roles:", data);
                setRoles(data);
            } else {
                toast.error('Échec de récupération des rôles');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de la récupération des rôles');
        }
    }, [API_URL]);

    // Fetch roles when select opens and roles are not yet loaded
    useEffect(() => {
        if (isSelectOpen && roles.length === 0) {
            fetchRoles();
        }
    }, [isSelectOpen, roles.length, fetchRoles]);

    // Populate form data when agent changes
    useEffect(() => {
        if (agent) {
            setFormData({
                first_name: agent.first_name,
                last_name: agent.last_name,
                email: agent.email,
                role_id: '', // Will be set when roles are loaded
            });
        }
    }, [agent]);

    // Set role_id when roles are loaded and agent is set
    useEffect(() => {
        if (agent && roles.length > 0) {
            const role = roles.find(r => r.name === agent.role_name);
            if (role) {
                setFormData(prev => ({ ...prev, role_id: role.id.toString() }));
            }
        }
    }, [agent, roles]);

    // Handle input changes
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle Save / Update Agent
    const handleSave = async () => {
        if (!agent) return;

        setIsLoading(true);

        // Get session for auth token
        const session = await getClientSession();
        const token = session?.token;

        try {
            const dataToSend = {
                ...formData,
                role_id: parseInt(formData.role_id),
            };

            const response = await fetch(`${API_URL}/accounts/manager/${agent.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                console.error('Failed to update agent:', response.statusText);
                throw new Error('Failed to update agent');
            }

            const updatedAgent: Agent = await response.json();
            // Update agent in the store
            useAgentsStore.getState().setAgents(
                useAgentsStore.getState().agents.map(a =>
                    a.id === updatedAgent.id ? updatedAgent : a
                )
            );

            // Call onSave callback if provided
            if (onSave) {
                onSave(updatedAgent);
            }

            toast.success('Agent mis à jour avec succès');
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
                    <DialogTitle>Modifier l&apos;Agent</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de l&apos;agent.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">Prénom</Label>
                            <Input
                                id="first_name"
                                value={formData.first_name}
                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                                placeholder="Prénom de l'agent"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="last_name">Nom</Label>
                            <Input
                                id="last_name"
                                value={formData.last_name}
                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                                placeholder="Nom de l'agent"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Email de l'agent"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="role_id">Rôle</Label>
                            <Select
                                value={formData.role_id}
                                onValueChange={(value) => handleInputChange('role_id', value)}
                                onOpenChange={setIsSelectOpen}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner le rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role, index) => (
                                        <SelectItem key={index} value={role.id.toString()}>{role.name}</SelectItem>
                                    ))}

                                    {/* <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="operator">Opérateur</SelectItem>
                                    <SelectItem value="viewer">Observateur</SelectItem> */}
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