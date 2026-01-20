"use client"
import { useUser } from "@/components/UserProvider"

// Icons
import { Icon } from "@iconify/react"

// UI Components
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { clearClientSession } from "@/lib/actions/user"
import { toast } from "sonner"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { log } from "console"
import { Spinner } from "@/components/ui/loader"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: "heroicons-outline:view-grid",
        
    },
    {
        title: "Entreprises",
        url: "/dashboard/companies",
        icon: "heroicons-outline:office-building",
    },
    {
        title: "Departements",
        url: "/dashboard/departments",
        icon: "hugeicons:google-sheet",
    },
    {
        title: "Mission",
        url: "/dashboard/missions",
        icon: "heroicons-outline:flag",
    },
    {
        title: "Drones",
        url: "/dashboard/drones",
        icon: "tabler:drone",
    },

    {
        title: "Agents",
        url: "/dashboard/agents",
        icon: "heroicons-outline:user-group",
    },
]

export function DashboardSidebar() {
    // Component states
    const [loggingOut, setLoggingOut] = useState(false);

    const { user } = useUser();
    
    const router = useRouter();
    const pathname = usePathname();

    // // DEBUG
    // user ? console.log('Sidebar User Context:', user) : console.log('No user in Sidebar context');

    const handleLogout = async () => {
        setLoggingOut
        try {
            await clearClientSession();
            toast.info("Déconnexion réussie.");
            router.push('/');
        } catch (error) {
            toast.error("Erreur lors de la déconnexion.");
        } finally {
            setLoggingOut(false);
        }
    }
    return (
        <Sidebar collapsible="icon" className=" " >

            <SidebarHeader className="border-b">
                <div className="flex items-center gap-1 border rounded-lg bg-primary/5 p-1 group-data-[collapsible=icon]:hidden">
                    <Image
                        src="/assets/logo/logo.png"
                        alt="Slater Security Logo"
                        width={32}
                        height={32}
                        className="w-12 h-12"
                    />
                    <div className="">
                        <h1 className="text-md font-semibold uppercase">{user?.role}</h1>
                        <p className="text-xs"> {user?.email} </p>
                    </div>
                </div>

                <div className="hidden group-data-[collapsible=icon]:block">
                    <Image
                        src="/assets/logo/logo.png"
                        alt="Slater Security Logo"
                        width={32}
                        height={32}
                        className="w-8 h-8"
                    />
                </div>
            </SidebarHeader>


            <SidebarContent className="g">
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <Icon icon={item.icon} className="group-data-[collapsible=icon]:scale-150 " />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Aides">
                            <Link href="#">
                                <Icon icon="ph:question-light" className="w-5 h-5" />
                                <span>Aides</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Paramètres">
                            <Link href="#">
                                <Icon icon="weui:setting-outlined" className="w-5 h-5" />
                                <span>Paramètres</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* USER */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>

                            {/* USER */}
                            <DropdownMenuTrigger asChild disabled={loggingOut} className="" >
                                <SidebarMenuButton className="flex items-center justify-between bg-white dark:bg-primary/10 p-2 h-13">
                                    <div className="flex items-center gap-2">
                                        {loggingOut ? (
                                                <Spinner size="sm" className="border rounded-sm p-2" />
                                            ) : (
                                                <Image
                                                    src="/assets/logo/logo.png"
                                                    alt="User Avatar"
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full border bg-primary/50"
                                                />
                                            )
                                        }
                                        {/* Identity */}
                                        <div className="flex flex-col">
                                            <p className="text-lg">{user?.first_name} {user?.last_name}</p>
                                            <span className="text-xs text-foreground/60">{user?.email}</span>
                                        </div>
                                    </div>

                                    <Icon icon="mdi:chevron-down" className="w-4 h-4 ml-1" />
                                </SidebarMenuButton>

                            </DropdownMenuTrigger>


                            <DropdownMenuContent className=" w-50 ">
                                <DropdownMenuItem>
                                    <span>Acme Inc</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Acme Corp.</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={handleLogout} >
                                    <Icon icon="solar:logout-2-broken" className="w-4 h-4" />
                                    <span>Deconnexion</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}