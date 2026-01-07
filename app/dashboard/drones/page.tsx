import axios from "axios";
import DronesList from "./components/list";

export default async function DronesPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const res = await axios.get(`${API_URL}/drones/`, {
        headers: {
            'Content-Type': 'application/json',
        },
        // cache: 'no-store', // Uncomment to disable caching
    });

    const drones =  res.data

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