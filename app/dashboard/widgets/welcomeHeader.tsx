"use client";

import { useState } from 'react';
import { useUser } from "@/components/UserProvider";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react";
import AddCompanyDialog from '../companies/components/add-company-dialog';
import AddDrone from '../drones/components/add-drone';

export default function WelcomeHeader() {
    const { user } = useUser();
    const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
    const [droneDialogOpen, setDroneDialogOpen] = useState(false);
    return (
        <>
        <div className="flex items-end justify-between w-full ">
            <div>
                <h1 className="text-3xl "> Bienvenue, <span className="font-semibold"> {user?.first_name} ! </span> </h1>
                <p> Il y'a 18 Missions en cours </p>
            </div>


            {/* DropDown Create */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="gap-4"><span> Ajouter </span> <Separator orientation="vertical" className="bg-white/20" /> <Icon icon="lucide:chevron-down" /> </Button>
                </DropdownMenuTrigger>


                <DropdownMenuContent className="mr-12 scale-125 ">
                    <DropdownMenuItem onClick={() => setCompanyDialogOpen(true)}>
                        <Icon icon="lucide:building" />
                        <span> Créer une entreprise </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDroneDialogOpen(true)}>
                        <Icon icon="lucide:drone" />
                        <span> Ajouter un drone </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Icon icon="wpf:administrator" />
                        <span> Ajouter un agent </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


        </div>
        <AddCompanyDialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen} />
        <AddDrone open={droneDialogOpen} onOpenChange={setDroneDialogOpen} />
        </>
    );
}