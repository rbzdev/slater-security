"use client";

import { useState } from "react";
import { getClientSession } from "@/lib/actions/user";
import { toast } from "sonner";
import { useCompaniesStore } from "@/lib/Stores/companies-store";

// UI Components
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Spinner } from '@/components/ui/loader';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanyDetails } from "./company-details";
import { CompanyEdit } from "./company-edit";

// TYpes
import { Company } from "@/lib/Stores/companies-store";


export default function CompaniesList({ companies = [] }: { companies: Company[] }) {
    // const { companies } = useCompaniesStore();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);


    // Delete a company via his ID
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Open View Dialog / Company Details
    const handleViewCompany = (company: Company) => {
        setSelectedCompany(company);
        setIsDialogOpen(true);
    };

    // Open Edit Dialog
    const handleEditCompany = (company: Company) => {
        setSelectedCompany(company);
        setIsEditDialogOpen(true);
    };

    // Delete Company
    const handleDelete = async (companyId: string) => {
        setDeletingId(companyId);
        // GEt user session Token ( Decrypted )
        const session = await getClientSession();
        const token = session?.token;
        // console.log(`Delete company with ID: ${companyId}`);
        try {
            const response = await fetch(`${API_URL}/tenants/${companyId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                // Successfully deleted
                console.log(`Company with ID: ${companyId} deleted successfully.`);
                toast.success('Entreprise supprimée avec succès');
                useCompaniesStore.getState().removeCompany(companyId);

                // Optionally, refresh the list or update state here
                toast.success('Entreprise supprimée avec succès');
            } else {
                console.error(`Failed to delete company with ID: ${companyId}.`);
            }
        } catch (error) {

        } finally {
            setDeletingId(null);
        }
    }

    // if (!companies || !Array.isArray(companies) || companies.length === 0) {
    //     console.log('Companies data:', companies);
    //     return (
    //         <div className="flex flex-col h-100 items-center justify-center">
    //             <Icon icon="pepicons-pencil:building-off" className="inline-block text-9xl text-muted-foreground" />
    //             Aucune entreprise trouvée ou données invalides.
    //             <Button variant="default" className="mt-4">
    //                 <span>Actualiser</span>
    //                 <Icon icon="icon-park-outline:refresh" />
    //             </Button>
    //         </div>
    //     );
    // }

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
                            <tr key={company.id} className="hover:bg-primary/10 ">
                                <td className="border border-accent px-2 py-2 text-sm font-mono"> <span className="line-clamp-1"> {company.id} </span> </td>
                                <td className="border border-accent px-4 py-2">{company.name}</td>
                                <td className="border border-accent px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-sm 
                                        ${company.status === "active" ? 'bg-green-100 text-green-800' :
                                            company.status === "suspended" ? 'bg-yellow-100 text-yellow-800' :
                                                company.status === "deleted" ? 'bg-red-500 text-white' :
                                                    company.status === "inactive" ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {company.status === "active" ? 'Active' :
                                            company.status === "suspended" ? 'Suspendu' :
                                                company.status === "deleted" ? 'Supprimé' :
                                                    company.status === "inactive" ? 'Désactivée' : '-'}
                                    </span>
                                </td>
                                <td className="border border-accent px-4 py-2">{company.industry}</td>
                                <td className="border border-accent px-4 py-2 text-center">{company.nb_users || "-"}</td>
                                <td className="border border-accent px-4 py-2">{new Date(company.created_at).toLocaleDateString() || ""}</td>
                                <td className="border border-accent px-4 py-2">{new Date(company.updated_at).toLocaleDateString() || ""}</td>

                                <td className="border border-accent px-4 py-2 flex items-center justify-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="hover:border data-[state=open]:bg-primary/50">
                                            {deletingId === company.id ? (
                                                <Button variant="ghost" className="h-8 w-8 p-0 ">
                                                    <Spinner className=" h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" className="h-8 w-8 p-0 ">
                                                    <Icon icon="ant-design:more-outlined" className="" />
                                                </Button>
                                            )}
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleViewCompany(company)}>
                                                <Icon icon="solar:eye-bold" className=" h-4 w-4" />
                                                Voir l&apos;entreprise
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                                                <Icon icon="basil:edit-outline" className=" h-4 w-4" />
                                                Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(company.id)} disabled={deletingId === company.id} >
                                                {deletingId === company.id ? (
                                                    <Spinner className=" h-4 w-4" />
                                                ) : (
                                                    <Icon icon="ant-design:delete-outlined" className=" h-4 w-4" />
                                                )}
                                                {deletingId === company.id ? 'Suppression...' : 'Supprimer'}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Company Details Dialog */}
            <CompanyDetails company={selectedCompany} open={isDialogOpen} onOpenChange={setIsDialogOpen} />

            {/* Company Edit Dialog */}
            <CompanyEdit company={selectedCompany} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
        </div>
    );
}