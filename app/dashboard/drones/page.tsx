import axios from "axios";
import DronesList from "./components/list";

export const dynamic = 'force-dynamic';

export default async function DronesPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    let drones = [];
    try {
        const res = await axios.get(`${API_URL}/drones/`, {
            headers: {
                'Content-Type': 'application/json',
            },
            // cache: 'no-store', // Uncomment to disable caching
        });
        drones = res.data;
    } catch (error) {
        console.error('Failed to fetch drones:', error);
        // Handle error, perhaps show empty list or error message
    }

    // DEBUG
    console.log('Drones fetch response:', drones);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Drones Management</h1>
      <p>Gestion des drones</p>
      <DronesList drones={drones} />
    </div>
  );
}