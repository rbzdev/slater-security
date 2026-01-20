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
import { Company, useCompaniesStore } from "@/lib/Stores/companies-store";
import { Spinner } from "@/components/ui/loader";

interface CompanyEditProps {
    company: Company | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: (updatedCompany: Company) => void;
}

export function CompanyEdit({ company, open, onOpenChange, onSave }: CompanyEditProps) {
    const [formData, setFormData] = useState({
        name: '',
        status: '',
        address: '',
        industry: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // Populate form data when company changes
    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name,
                status: company.status || '',
                address: company.address || '',
                industry: company.industry,
            });
        }
    }, [company]);

    // Handle input changes
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle Save / Update Company
    const handleSave = async () => {
        if (!company) return;

        setIsLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${API_URL}/tenants/${company.id}/update/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                console.error('Failed to update company:', response.statusText);
                throw new Error('Failed to update company');
            }

            const updatedCompany: Company = await response.json();
            // Update company in the store
            useCompaniesStore.getState().setCompanies(
                useCompaniesStore.getState().companies.map(c =>
                    c.id === updatedCompany.id ? updatedCompany : c
                )
            );

            // Call onSave callback if provided
            if (onSave) {
                onSave(updatedCompany);
            }

            toast.success('Entreprise mise à jour avec succès');
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
                    <DialogTitle>Modifier l&apos;Entreprise</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations de l&apos;entreprise.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Nom de l'entreprise"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Statut</Label>
                            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner le statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Désactivée</SelectItem>
                                    <SelectItem value="suspended">Suspendu</SelectItem>
                                    <SelectItem value="deleted">Supprimé</SelectItem>
                                    
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="address">Adresse</Label>
                            <Input
                                id="address"
                                value={formData.address || ''}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Adresse de l'entreprise"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="industry">Industrie</Label>
                            <Input
                                id="industry"
                                value={formData.industry}
                                onChange={(e) => handleInputChange('industry', e.target.value)}
                                placeholder="Secteur d'activité"
                            />
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