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
import { Agent, useAgentsStore } from "@/lib/Stores/agents-store";
import { Spinner } from "@/components/ui/loader";

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
        role_name: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // Populate form data when agent changes
    useEffect(() => {
        if (agent) {
            setFormData({
                first_name: agent.first_name,
                last_name: agent.last_name,
                email: agent.email,
                role_name: agent.role_name,
            });
        }
    }, [agent]);

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
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/users/${agent.id}/update/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
                            <Label htmlFor="role_name">Rôle</Label>
                            <Select value={formData.role_name} onValueChange={(value) => handleInputChange('role_name', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner le rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Administrateur</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="operator">Opérateur</SelectItem>
                                    <SelectItem value="viewer">Observateur</SelectItem>
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