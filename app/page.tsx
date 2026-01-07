import { Button } from "@/components/ui/button";
import Link from "next/link";

import SceneClient from '@/components/3d/SceneClient'

export default function Home() {
  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <h1 className="text-5xl font-semibold"> Welcome to Slater-Security portal</h1>

     {/* Conteneur pour la 3D - Il doit avoir une hauteur définie ! */}
      <div className="w-full h-150 ">
        <SceneClient />
      </div>
      
     <Link type="button"  href={"/login"}>
        <Button variant={"default"}> Continue to dashboard <span className="text-xl animate-pulse "> → </span> </Button>
     </Link>
    </div>
  );
}
