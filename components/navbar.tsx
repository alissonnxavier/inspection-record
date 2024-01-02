"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import toast from "react-hot-toast"
import { Badge } from "./ui/badge";
import { useSession } from "next-auth/react";
import { Menu } from "./navigation-menu"

export const Navbar = () => {
    const { setTheme } = useTheme();
    const { data: session } = useSession();

    const handleLogOut = () => {

        try {
            toast.success(' Usuario deslogado.', {
                style: {
                    border: '3px solid white',
                    padding: '30px',
                    color: 'white',
                    backgroundColor: '#020d04'

                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#020d04',
                },
            });
            signOut();
        } catch (error) {

        }
    }

    return (
        <div className="flex justify-start m-auto">
            <div className="mr-20">
                <Menu />
            </div>
            <div className="flex">

                <Badge
                    variant='destructive'
                    className="mr-5"
                >
                    Inspetor {session?.user?.name}
                </Badge>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    onClick={() => { handleLogOut() }}
                    className="ml-5"
                >
                    Sair
                </Button>
            </div>
        </div>
    )
}
