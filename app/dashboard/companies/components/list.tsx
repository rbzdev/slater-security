"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Company {
    id: string;
    name: string;
    isActive: boolean;
    industry: string;
    nb_users?: number;
    nb_fleets?: number;
    status?: string;
    created_at: Date;
    updated_at: Date;
}

interface CompaniesListProps {
    companies: Company[];
}



export default function CompaniesList({ companies }: CompaniesListProps) {
    if (!companies || !Array.isArray(companies) || companies.length === 0) {
        console.log('Companies data:', companies);
        return (
            <div className="flex flex-col h-100 items-center justify-center">
                <Icon icon="icon-park-twotone:company" className="inline-block text-7xl dark:text-9xl text-red-400" />
                Aucune entreprise trouvée ou données invalides.
                <Button variant="default" className="mt-4">
                    <span>Actualiser</span>
                    <Icon icon="icon-park-outline:refresh" />
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-4">
            {/* <h2 className="text-xl font-semibold mb-4">Liste des Entreprises</h2> */}
            <div className="overflow-x-hidden border rounded-t-xl!">
                <table className="w-full border-collapse    ">
                    <thead className="">
                        <tr className="bg-gray-100 dark:bg-gray-100/10">
                            <th className="border border-accent px-4 py-2 text-left ">UUID</th>
                            <th className="border border-accent px-4 py-2 text-left">Nom</th>
                            <th className="border border-accent px-4 py-2 text-left">Statut</th>
                            <th className="border border-accent px-4 py-2 text-left">Industrie</th>
                            <th className="border border-accent px-4 py-2 text-left">Agents</th>
                            <th className="border border-accent px-4 py-2 text-left">Créé le</th>
                            <th className="border border-accent px-4 py-2 text-left">Modifié le</th>
                            <th className="border border-accent px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr key={company.id} className="hover:bg-primary/30 ">
                                <td className="border border-accent px-4 py-2 text-sm font-mono">{company.id}</td>
                                <td className="border border-accent px-4 py-2">{company.name}</td>
                                <td className="border border-accent px-4 py-2">
                                    <span className={`px-2 rounded-full text-sm ${
                                        company.status === "active" ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {company.status === "active" ? 'Active' : 'Désactivées'}
                                    </span>
                                </td>
                                <td className="border border-accent px-4 py-2">{company.industry}</td>
                                <td className="border border-accent px-4 py-2 text-center">{company.nb_users}</td>
                                <td className="border border-accent px-4 py-2">{new Date(company.created_at).toLocaleDateString() || ""}</td>
                                <td className="border border-accent px-4 py-2">{new Date(company.updated_at).toLocaleDateString() || ""}</td>
                                
                                <td className="border border-accent px-4 py-2 flex items-center justify-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="hover:border data-[state=open]:bg-primary/50">
                                            <Button variant="ghost" className="h-8 w-8 p-0 ">
                                                <Icon icon="ant-design:more-outlined" className="" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Icon icon="basil:edit-outline" className="mr-2 h-4 w-4" />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
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
        </div>
    );
}