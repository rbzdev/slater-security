"use eclient";

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import AddAgent from "./add-agent";

interface Company {
    id: string;
    name: string;
    isActive: boolean;
    industry: string;
    nb_users?: number;
    created_at: Date;
    updated_at: Date;
}

interface CompaniesListProps {
    companies?: Company[];
}

export default function AgentsHeader({ companies = [] }: CompaniesListProps) {

    return(
        <div className="flex items-start justify-between " >
            <div className="flex">
                <Input
                    type="text"
                    placeholder="Rechercher un agent..."
                    className="mb-4 mr-4"
                />
                
                {/* Tri */}
                <div className="flex">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="mb-4">
                                <Icon icon="mdi:filter-variant" className="mr-2" />
                                Trier par
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Date de création</DropdownMenuItem>
                            <DropdownMenuItem>Nom</DropdownMenuItem>
                            <DropdownMenuItem>Statut</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
                <Button variant="outline" className="">
                    <Icon icon="clarity:pop-out-line" className="" />
                    Exporter
                </Button>
                <AddAgent />
            </div>

        </div>
    )
}