"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";

// Components for dialogs

import AddCompanyDialog from '../companies/components/add-company-dialog';
import AddDrone from '../drones/components/add-drone';

interface QuickActionsProps {
    className?: string;
}

export default function QuickActions({ className }: QuickActionsProps) {
    // State for dialog visibility
    const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
    const [droneDialogOpen, setDroneDialogOpen] = useState(false);
    return (
        <>
            <div className={`p-4 h-full space-y-2 w-f flex flex-col justify-center text-2xl bg-white dark:bg-neutral-800/50 rounded-xl ${className}`}>

                <h6>Actions Rapides</h6>

                <div className="flex flex-col items-start gap-2 w-full">
                    <div
                        onClick={() => setDroneDialogOpen(true)}
                        className=" border p-1 rounded-lg hover:bg-primary-dark flex items-center gap-1 w-fit active:scale-[0.98] transition-all cursor-pointer hover:bg-primary/5"
                    >
                        <Icon icon="ph:drone-light" className="inline-block text-4xl p-1 border rounded-sm text-yellow-600 bg-yellow-300/20 border-yellow-300/30  " />
                        <span className="text-sm">Ajouter un Drone</span>
                    </div>

                    <div
                        onClick={() => setCompanyDialogOpen(true)}
                        className=" border p-1 rounded-lg hover:bg-primary-dark flex items-center gap-1 w-fit active:scale-[0.98] transition-all cursor-pointer hover:bg-primary/5"
                    >
                        <Icon icon="mage:dashboard-plus" className="inline-block text-4xl p-1 border rounded-sm text-green-600 bg-green-300/20 border-green-300/30  " />
                        <span className="text-sm">Ajouter une entreprise</span>
                    </div>
                </div>
            </div>

            <AddCompanyDialog open={companyDialogOpen} onOpenChange={setCompanyDialogOpen} />
            <AddDrone open={droneDialogOpen} onOpenChange={setDroneDialogOpen} />
        </>
    );
}