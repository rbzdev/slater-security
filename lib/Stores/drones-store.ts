import { create } from 'zustand';

export interface Drone {
    id: number;
    name: string;
    serial_number: string;
    model: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    last_battery_level?: number;
    last_position?: {
        latitude: number;
        longitude: number;
    };
}

interface DronesStore {
    drones: Drone[];
    loading: boolean;
    error: string | null;
    setDrones: (drones: Drone[]) => void;
    addDrone: (drone: Drone) => void;
    removeDrone: (id: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useDronesStore = create<DronesStore>((set) => ({
    drones: [],
    loading: false,
    error: null,
    setDrones: (drones) => set({ drones }),
    addDrone: (drone) => set((state) => ({ drones: [...state.drones, drone] })),
    removeDrone: (id: number) => set((state) => ({ drones: state.drones.filter(d => d.id !== id) })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));