"use client"

import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"


export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}



export function ListSkeleton({ count = 15 }: { count?: number }) {
  return (
    <div className="relative space-y-4 border rounded-xl p-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          {Array.from({ length: 4 }).map((_, cellIndex) => (
            <div key={cellIndex} className="flex-1">
              <Skeleton className="h-10 w-full" >

                {/* Action */}
                {/* <Icon icon="mdi:dots-vertical" className=" hidden last:block text-2xl text-muted-foreground" /> */}

              </Skeleton>
            </div>
          ))}
        </div>
      ))}

      <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl text-muted-foreground "> Chargement... </h2>
    </div>
  )
}
