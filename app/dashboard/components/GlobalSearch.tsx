"use client";

import { useState, useEffect } from "react";

// UI Component
import {
    Command,
    
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

// Icons
import { Icon } from "@iconify/react";

export default function GlobalSearch() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <div className="relative w-1/3">
            <Input placeholder="Faire une recherche..." className="pl-8 w-full" onClick={()=>{setOpen(true)}} />
            <div className="absolute top-1/2 -translate-y-1/2 left-2 pointer-events-none">
                <Icon icon="heroicons-outline:magnifying-glass" className="size-5 text-muted-foreground " />
            </div>

            {/* ShortCuts */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 ">
                <CommandShortcut>
                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                        <span className="text-xs">⌘</span>S
                    </kbd>
                </CommandShortcut>
            </div>

                <CommandDialog open={open} onOpenChange={setOpen} className="backdrop-blur-2xl!">
                    <CommandInput placeholder="Faire une recherche dans slater security..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            <CommandItem>
                                <Icon icon="heroicons-outline:calendar" />
                                <span>Calendar</span>
                            </CommandItem>
                            <CommandItem>
                                <Icon icon="heroicons-outline:emoji-happy" />
                                <span>Search Emoji</span>
                            </CommandItem>
                            <CommandItem>
                                <Icon icon="heroicons-outline:calculator" />
                                <span>Calculator</span>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Settings">
                            <CommandItem>
                                <Icon icon="heroicons-outline:user" />
                                <span>Profile</span>
                                <CommandShortcut>⌘P</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <Icon icon="heroicons-outline:credit-card" />
                                <span>Billing</span>
                                <CommandShortcut>⌘B</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <Icon icon="heroicons-outline:cog" />
                                <span>Settings</span>
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
        </div>
    );
}