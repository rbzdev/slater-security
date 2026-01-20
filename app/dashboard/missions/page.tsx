import { Icon } from "@iconify/react";

export default function MissionsPage() {
    return (
        <div className="p-6 h-100 w-full flex flex-col items-center justify-center text-2xl space-y-4">
            <Icon icon="heroicons-outline:flag" className="inline-block text-9xl mr-4 dark:text-9xl text-primary/50" />
            
            <h2>Missions et Gestion</h2>
            <p> Gestion des missions et audits - Missions en cours, terminées, et planifiées</p>

        </div>
    );

}