import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./components/sidebar"
import TopBar from "@/app/dashboard/components/topBar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <TopBar />
        <SidebarTrigger />
        <div className="mt-12">

        {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}