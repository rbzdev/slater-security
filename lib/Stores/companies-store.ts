import { create } from 'zustand';

export interface Company {
    id: string;
    name: string;
    isActive: boolean;
    industry: string;
    nb_users?: number;
    nb_fleets?: number;
    status?: string;
    created_at: Date;
    updated_at: Date;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string | null;
}

interface CompaniesStore {
    companies: Company[];
    loading: boolean;
    error: string | null;
    setCompanies: (companies: Company[]) => void;
    addCompany: (company: Company) => void;
    removeCompany: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useCompaniesStore = create<CompaniesStore>((set) => ({
    companies: [],
    loading: false,
    error: null,
    setCompanies: (companies) => set({ companies }),
    addCompany: (company) => set((state) => ({ companies: [...state.companies, company] })),
    removeCompany: (id) => set((state) => ({ companies: state.companies.filter(c => c.id !== id) })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));