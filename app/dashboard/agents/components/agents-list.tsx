"use client";

import { useState } from "react";
import { getClientSession } from "@/lib/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAgentsStore } from '@/lib/Stores/agents-store';

// UI Components
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AgentDetails } from "./agent-details";
import { AgentEdit } from "./agent-edit";

interface Agent {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role_name: string;
    password: string;
    date_joined: Date;
    tenant_name?:string;
}

interface AgentsListProps {
    agents: Agent[];
}

export default function AgentsList({ agents }: AgentsListProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [shownPasswords, setShownPasswords] = useState<{ [key: number]: boolean }>({});
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const router = useRouter();

    // // DEBUG
    // console.log('Agents received in AgentsList:', agents);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const togglePasswordVisibility = (agentId: number) => {
        setShownPasswords(prev => ({ ...prev, [agentId]: !prev[agentId] }));
    };

    const handleViewAgent = (agent: Agent) => {
        setSelectedAgent(agent);
        setIsDetailsDialogOpen(true);
    };

    const handleEditAgent = (agent: Agent) => {
        setSelectedAgent(agent);
        setIsEditDialogOpen(true);
    };

    const handleDelete = async (agentId: number) => {
        setDeletingId(agentId);
        const session = await getClientSession();
        const token = session?.token;
        try {
            const response = await fetch(`${API_URL}/accounts/manager/${agentId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                toast.success('Agent supprimé avec succès');
                useAgentsStore.getState().removeAgent(agentId);
            } else {
                toast.error('Échec de la suppression de l\'agent');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de la suppression');
        } finally {
            setDeletingId(null);
        }
    };

    if (!agents || agents.length === 0) {
        return (
            <div className="flex flex-col h-100 items-center justify-center">
                <Icon icon="fa7-solid:user-slash" className="inline-block text-7xl dark:text-9xl text-accent" />
                Aucun agent trouvé.
                <Button variant="default" className="mt-4" onClick={() => router.refresh()}>
                    <span>Actualiser</span>
                    <Icon icon="icon-park-outline:refresh" />
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Liste des Agents</h2>
            <div className="overflow-x-hidden border rounded-t-xl!">
                <table className="w-full border-collapse">
                    <thead className="">
                        <tr className="bg-gray-100 dark:bg-gray-100/10">
                            <th className="border border-accent px-4 py-2 text-left">ID</th>
                            <th className="border border-accent px-4 py-2 text-left">Email</th>
                            <th className="border border-accent px-4 py-2 text-left">Prénom</th>
                            <th className="border border-accent px-4 py-2 text-left">Nom</th>
                            <th className="border border-accent px-4 py-2 text-left">Mot de passe</th>
                            <th className="border border-accent px-4 py-2 text-left">Rôle</th>
                            <th className="border border-accent px-4 py-2 text-left">Entreprise</th>
                            <th className="border border-accent px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map((agent) => (
                            <tr key={agent.id} className="hover:bg-primary/10 ">
                                <td className="border border-accent px-4 py-2 text-sm font-mono">{agent.id}</td>
                                <td className="border border-accent px-4 py-2">{agent.email}</td>
                                <td className="border border-accent px-4 py-2">{agent.first_name}</td>
                                <td className="border border-accent px-4 py-2">{agent.last_name}</td>
                                <td className="border border-accent px-4 py-2 pr-2 relative">
                                    
                                   <span className="line-clamp-1  "> {shownPasswords[agent.id] ? agent.password : '••••••'} </span>

                                    {/* <Button 
                                    variant="outline" 
                                    size="sm" 
                                    > */}
                                        <Icon icon={shownPasswords[agent.id] ? "mdi:eye-off" : "mdi:eye"} 
                                    onClick={() => togglePasswordVisibility(agent.id)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-2xl backdrop-blur cursor-pointer active:scale-95 transition-all h-full" />
                                    {/* </Button> */}
                                </td>

                                <td className="border border-accent px-4 py-2">{agent.role_name}</td>
                                <td className="border border-accent px-4 py-2">{agent.tenant_name || 'N/A'}</td>
                                <td className="border border-accent px-4 py-2 flex justify-center ">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="hover:border data-[state=open]:bg-primary/50">
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <Icon icon="ant-design:more-outlined" className="" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">

                                            <DropdownMenuItem onClick={() => handleViewAgent(agent)}>
                                                <Icon icon="solar:eye-bold" className="mr-2 h-4 w-4" />
                                                Voir l&apos;agent
                                            </DropdownMenuItem>

                                            <DropdownMenuItem>
                                                <Icon icon="f7:building-2" className="mr-2 h-4 w-4" />
                                                Assigner
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => handleEditAgent(agent)}>
                                                <Icon icon="basil:edit-outline" className="mr-2 h-4 w-4" />
                                                Modifier Agent
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => handleDelete(agent.id)} disabled={deletingId === agent.id}>
                                                <Icon icon="ant-design:delete-outlined" className="mr-2 h-4 w-4" />
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>

                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Agent Details Dialog */}
            <AgentDetails agent={selectedAgent} open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen} />

            {/* Agent Edit Dialog */}
            <AgentEdit agent={selectedAgent} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
        </div>
    );
}