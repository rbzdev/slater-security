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
import { Agent } from "@/lib/Stores/agents-store";
import Link from "next/link";

export function AgentDetails({ agent, open, onOpenChange }: { agent: Agent | null, open: boolean, onOpenChange: (open: boolean) => void }) {

    // // DEBUG
    // console.log("Agent Details Dialog Opened for:", agent);

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <Icon icon="lucide:user" className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div >
                            <DialogTitle className="text-2xl font-bold ">{agent?.first_name} {agent?.last_name}</DialogTitle>
                            <Badge variant="default" className="mt-1">
                                {agent?.role_name}
                            </Badge>
                        </div>
                    </div>
                    <DialogDescription>
                        Informations de l&apos;agent
                    </DialogDescription>
                </DialogHeader>

                {agent && (
                    <div className="space-y-6">
                        {/* Informations générales */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Icon icon="lucide:user" className="w-5 h-5" />
                                Informations générales
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Identité</label>
                                        <p className="text-base font-medium">{agent.first_name} {agent.last_name}</p>
                                    </div>
                                    {/* <div>
                                        <label className="text-sm font-medium text-muted-foreground">Nom</label>
                                        <p className="text-base font-medium">{agent.last_name}</p>
                                    </div> */}


                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Identifiant d&apos;agent</label>
                                        <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{agent.id}</p>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                        <label className="text-sm font-medium text-muted-foreground">Rôle</label>
                                        <Badge variant="default">
                                            {agent.role_name}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3 border-l pl-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Entreprise</label>
                                        <p className="text-base">{agent.tenant_name || 'Non assigné'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Coordonnées */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Icon icon="hugeicons:id" className="w-5 h-5" />
                                Coordonnées
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <Link
                                        href={`mailto:${agent.email}`}
                                        className="text-base flex items-center gap-2 hover:underline"
                                        target="_blank"
                                    >
                                        <Icon icon="lucide:mail" className="w-4 h-4" />
                                        {agent.email}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Dates */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Icon icon="hugeicons:transaction-history" className="w-5 h-5" />
                                Historique
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Date d&apos;ajout</label>
                                    <p className="text-base">{formatDate(agent.date_joined)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}