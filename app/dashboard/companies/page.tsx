import axios from "axios";
import CompaniesList from "./components/list";
import Header from "./components/header";
import { getSession } from "@/lib/session";

export const dynamic = 'force-dynamic';

export default async function CompaniesPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // Get Session Token
    const session = await getSession();

    // session ? console.log("Session valid", session) : console.log("No valid session found");

    let companies = [];
    try {
        const res = await axios.get(`${API_URL}/tenants/list/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.token}`
            },
            // cache: 'no-store', // Uncomment to disable caching
        });
        companies = res.data;
    } catch (error) {
        console.error('Failed to fetch companies:', error);
        // Handle error, perhaps show empty list or error message
    }

    // // DEBUG
    // console.log('Companies fetch response:', companies);

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Companies Management</h1>
      <p>Gestion des entreprises</p> */}
        <Header companies={companies} />    
      {/* <CompaniesList companies={companies} /> */}
      <CompaniesList companies={companies}  />
    </div> 
  );
}