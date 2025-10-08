"use client"

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { Badge } from "./ui/badge";
import { useSession } from "next-auth/react";
import { Menu } from "./navigation-menu";
import { RiseLoader } from "react-spinners";
import { redirect, useRouter } from "next/navigation";
import { UserPlus, Activity } from "lucide-react";
import { useState } from "react";
import { useCardModal } from "@/hooks/use-card-modal";
import { verifyAdmin } from "@/actions/verify-admin";
import { useEffect } from "react";
import { Tip } from "./ui/tip";
import { useAdminHook } from "@/hooks/use-admin";
import { useTimeLineDrawer } from "@/hooks/use-drawer-timeline";


export const Navbar = () => {
    const route = useRouter();
    const { setTheme } = useTheme();
    const { data: session } = useSession();
    const [admin, setAdmin] = useState(false);
    const handleAdmin = useAdminHook();

    const AdminOrNot = async () => {
        const res = await verifyAdmin(session?.user?.email);
        if (res === 'true') {
            setAdmin(true);
            handleAdmin.onOpen(true);
        }
    }
    useEffect(() => {
        AdminOrNot();
    }, [session]);
    const handleCardModal = useCardModal();
    const hadleTimeline = useTimeLineDrawer();
    const handleLogOut = () => {
        try {
            toast.success(' Usuario deslogado.', {
                style: {
                    border: '3px solid white',
                    padding: '30px',
                    color: 'white',
                    backgroundColor: '#020d04',
                    borderRadius: '50%',
                    boxShadow: '20px 20px 50px grey',

                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#020d04',
                },
            });
            signOut({
                callbackUrl: '/',
            });
            redirect('/')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex m-auto">
            <div className="flex">
                <div className="mr-6">
                    <Menu />
                </div>
                <Badge
                    variant='destructive'
                    className="mr-2 p-2 w-32"
                >
                    <div className="m-auto truncate">
                        {session?.user?.name ? `Inspetor ${session?.user?.name}`
                            : <div><RiseLoader color="#f5f7fa" size={5} /></div>}
                    </div>
                </Badge>
                <div className="mr-1">
                    <Tip
                        message="Linha do tempo"
                        content={
                            <Button
                                variant='newuser'
                                size='icon'
                                className="bg-blue-900 text-green-300 ml-1 hover:animate-pulse"
                                onClick={hadleTimeline.onOpen}
                            >
                                <Activity size={15} />
                            </Button>
                        }>
                    </Tip>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Alterar tema</span>
                        </Button>

                    </DropdownMenuTrigger>
                    {admin.valueOf() == true ?
                        <Tip
                            message="Criar novo usuário"
                            content={
                                <Button
                                    variant='newuser'
                                    size='icon'
                                    className="bg-green-900 text-green-300 ml-1 hover:animate-pulse"
                                    onClick={handleCardModal.onOpen}
                                >
                                    <UserPlus size={15} />
                                </Button>
                            }>
                        </Tip>
                        : <div className="w-10"></div>
                    }
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Claro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Escuro
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            Sistema
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    size='icon'
                    onClick={() => { handleLogOut() }}
                    className="ml-1"
                >
                    Sair
                </Button>
            </div>
        </div>
    )
}
