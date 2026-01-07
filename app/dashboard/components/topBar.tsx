"use client";

import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { ThemeToggler } from "@/components/ui/theme-toggler";
import GlobalSearch from "./GlobalSearch";

export default function TopBar() {
    return (
        <div className="fixed bg-background top-0 left-0 right-0 border-b flex items-center justify-end gap-3 py-2 px-3">
            
            <GlobalSearch />

            <div className="flex gap-3">
                <Icon icon="iconoir:bell" className="size-6 cursor-pointer" />
                <ThemeToggler duration={700} className="    " />
            </div>


        </div>
    );
}