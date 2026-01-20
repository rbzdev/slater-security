"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "@/lib/session";
import { useAgentsStore } from '@/lib/Stores/agents-store';


import AgentHeader from "./components/header";
import AgentsList from "./components/agents-list";
import { ListSkeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export default function AgentsPage() {
  const { agents, setAgents, loading, setLoading, error, setError } = useAgentsStore();
  const [fetchingAgents, setFetchingAgents] = useState(true);

  const fetchAgents = async () => {
    setFetchingAgents(true);
    setError(null);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const session = await getSession();
      const res = await axios.get(`${API_URL}/accounts/manager/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token}`
        },
      });
      setAgents(res.data);

      // DEBUG
      console.log("Fetched agents:", res.data);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      setError('Failed to fetch agents');
    } finally {
      setFetchingAgents(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  if (fetchingAgents) {
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
      <div className="m-6 h-120 flex flex-col items-center justify-center">
        <Icon icon="ph:empty" className="text-7xl text-red-500 dark:text-red-300 mb-4" />
        {/* <p className="text-red-600"> {error} </p> */}
        <p className="text-muted-foreground"> Une erreur est survenue lors du chargement des agents. </p>

        <Button variant="default" className="mt-4" onClick={fetchAgents}>
          <span>Actualiser les agents</span>
          <Icon icon="icon-park-outline:refresh" />
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <AgentHeader />
      <AgentsList agents={agents} />
    </div>
  );
}