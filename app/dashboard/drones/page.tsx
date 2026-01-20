"use client";

import { useEffect } from "react";
import DronesList from "./components/drone-list";
import DroneHeader from "./components/drone-header";
import { useDronesStore } from '@/lib/Stores/drones-store';
import axios from "axios";
import { getSession } from "@/lib/session";
import { ListSkeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export default function DronesPage() {
  const { drones, setDrones, loading, setLoading, error, setError } = useDronesStore();

  const fetchDrones = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const session = await getSession();
      const res = await axios.get(`${API_URL}/drones/list/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}`
        },
      });
      setDrones(res.data);
    } catch (err) {
      console.error('Failed to fetch drones:', err);
      setError('Failed to fetch drones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrones();
  }, []);


  if (loading) {
    return (
      <div className="p-6 relative">
        <div className="flex items-center justify-between w-full h-22 animate-pulse">
          <div className="w-1/3 h-1/2 bg-accent rounded-full " />
          <div className="w-30 h-1/2 bg-primary/10 rounded-full" />
        </div>

        <ListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <DroneHeader />
        <div className="flex flex-col h-100 items-center justify-center space-y-4">
          <Icon icon="streamline-pixel:technology-drone-camera" className="inline-block text-9xl dark:text-9xl text-red-400" />

          <h3 className="text-xl font-semibold">Erreur de chargement </h3>

          <p>Une erreur est survenue lors du chargement des drones. </p>
          <Button variant="default" className="mt-4" onClick={fetchDrones}>
            <span>Actualiser</span>
            <Icon icon="icon-park-outline:refresh" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <DroneHeader />
      <DronesList />
    </div>
  );
}