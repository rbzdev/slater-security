"use client"

// import { useState } from "react";

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
import { Company } from "@/lib/Stores/companies-store";
import Link from "next/link";

export function CompanyDetails({ company, open, onOpenChange }: { company: Company | null, open: boolean, onOpenChange: (open: boolean) => void }) {

    // DEBUG
    console.log("Company Details Dialog Opened for:", company);

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
                        {company?.logo ? (
                            <img
                                src={company.logo}
                                alt={`${company.name} logo`}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <Icon icon="lucide:building-2" className="w-6 h-6 text-muted-foreground" />
                            </div>
                        )}
                        <div>
                            <DialogTitle className="text-2xl font-bold">{company?.name}</DialogTitle>
                            <Badge variant={company?.status === "active" ? "success" : "destructive"} className="mt-1">
                                {company?.status === "active" ? 'Active' : 'Désactivée'}
                            </Badge>
                        </div>
                    </div>
                    <DialogDescription>
                        Informations de l&apos;entreprise
                    </DialogDescription>
                </DialogHeader>

                {company && (
                    <div className="space-y-6">
                        {/* Informations générales */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Icon icon="lucide:building-2" className="w-5 h-5" />
                                Informations générales
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="">
                                        <label className="text-sm font-medium text-muted-foreground">Nom</label>
                                        <p className="text-base font-medium">{company.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Identifiant unique</label>
                                        <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{company.id}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-muted-foreground">Statut</label>
                                        <Badge variant={company.status === "active" ? "success" : "destructive"}>
                                            {company.status === "active" ? 'Active' : 'Désactivée'}
                                        </Badge>
                                    </div>
                                </div>

                                {/* <Separator orientation="vertical" /> */}


                                <div className="space-y-3 border-l pl-2 text-center">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Nombre d&apos;agents</label>
                                        <p className="text-base ">{company.nb_users || 0}</p>
                                    </div>

                                    <div className="border-t pt-2">
                                        <label className="text-sm font-medium text-muted-foreground">Nombre de flottes</label>
                                        <p className="text-base">{company.nb_fleets || 0}</p>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {company.email && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <Link
                                            href={`mailto:${company.email}`}
                                            className="text-base flex items-center gap-2 hover:underline"
                                            target="_blank"
                                        >
                                            <Icon icon="lucide:mail" className="w-4 h-4" />
                                            {company.email}
                                        </Link>
                                    </div>
                                )}
                                {company.phone && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                                        <Link
                                            href={`https://wa.me/${company.phone}`}
                                            className="text-base flex items-center gap-2 hover:underline"
                                            target="_blank"
                                        >
                                            <Icon icon="lucide:phone" className="w-4 h-4" />
                                            {company.phone}
                                        </Link>
                                    </div>
                                )}
                                {company.address && (
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                                        <Link
                                            href={`https://maps.google.com?s=${company.address}`}
                                            className="text-base flex items-center gap-2 hover:underline"
                                            target="_blank"
                                        >
                                            <Icon icon="lucide:map-pin" className="w-4 h-4" />
                                            {company.address}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Dates */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Icon icon="hugeicons:transaction-history" className="w-5 h-5" />
                                Historique
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Créé le</label>
                                    <p className="text-base">{formatDate(company.created_at)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Dernière modification </label>
                                    <p className="text-base">{formatDate(company.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}