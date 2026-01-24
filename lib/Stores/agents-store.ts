import { create } from 'zustand';

export interface Agent {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role_name: string;
    role_id?: number;
    password: string;
    date_joined: Date;
    tenant_name?: string;
}

interface AgentsStore {
    agents: Agent[];
    loading: boolean;
    error: string | null;
    setAgents: (agents: Agent[]) => void;
    addAgent: (agent: Agent) => void;
    removeAgent: (id: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAgentsStore = create<AgentsStore>((set) => ({
    agents: [],
    loading: false,
    error: null,
    setAgents: (agents) => set({ agents }),
    addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
    removeAgent: (id) => set((state) => ({ agents: state.agents.filter(a => a.id !== id) })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));