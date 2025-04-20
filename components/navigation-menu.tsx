"use client"

import * as React from "react"
import { FcInspection } from "react-icons/fc";
import { cn } from "@/lib/utils"
import excel from '@/public/excel.svg';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Image from "next/image";
import { usePressDrawer } from "@/hooks/use-press-drawer";
import { usePunchingDrawer } from "@/hooks/use-punching-drawer";
import { useThreader } from "@/hooks/use-press-threader";
import { useFold } from "@/hooks/use-press-fold";
import { useDrawerSoldier } from "@/hooks/use-drawer-soldier";
import { useDrawerFinishing } from "@/hooks/use-press-finishing";
import { useDrawerPlate } from "@/hooks/use-plate-drawer";
import { useDrawerSerigraphy } from "@/hooks/use-serigraphy-drawer";


export function Menu() {
    const handleDrawerPress = usePressDrawer();
    const handleDrawerPunching = usePunchingDrawer()
    const handleDrawerThreader = useThreader();
    const handleDrawerFold = useFold();
    const handleDrawerSoldier = useDrawerSoldier();
    const handleDrawerFinishing = useDrawerFinishing();
    const handleDrawerPlate = useDrawerPlate();
    const handleDrawerSerigraphy = useDrawerSerigraphy();

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid md:w-[500px] lg:w-[500px] sm:w-full lg:grid-cols-[.75fr_1fr] ">
                            <li className="row-span-8 m-1 ">
                                <NavigationMenuLink asChild className="justify-center align-middle items-center ">
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-5 no-underline outline-none focus:shadow-md hover:opacity-75"
                                        href="/"
                                    >
                                        <FcInspection className="h-32 w-32" />
                                        <p className="font-extrabold text-2xl">
                                            Formulários
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem onClick={handleDrawerPlate.onOpen} title="" className="p-0 m-2 cursor-pointer">
                                <Alert
                                    variant='default'
                                    className="hover:opacity-70 flex justify-start align-middle items-center gap-x-3">
                                    <AlertTitle>
                                        <Image
                                            width={30}
                                            height={30}
                                            alt="excel"
                                            src={excel}
                                        />
                                    </AlertTitle>
                                    <AlertDescription>
                                        Chapas
                                    </AlertDescription>
                                </Alert>
                            </ListItem>
                            <ListItem onClick={handleDrawerPress.onOpen} title="" className="p-0 m-2 cursor-pointer">
                                <Alert
                                    variant='default'
                                    className="hover:opacity-70 flex justify-start align-middle items-center gap-x-3">
                                    <AlertTitle>
                                        <Image
                                            width={30}
                                            height={30}
                                            alt="excel"
                                            src={excel}
                                        />
                                    </AlertTitle>
                                    <AlertDescription>
                                        Prensa
                                    </AlertDescription>
                                </Alert>
                            </ListItem>
                            <ListItem onClick={handleDrawerPunching.onOpen} className="p-0 m-2 cursor-pointer">
                                <Alert
                                    variant='default'
                                    className="hover:opacity-70 flex justify-start align-middle items-center gap-x-3">
                                    <AlertTitle>
                                        <Image
                                            width={30}
                                            height={30}
                                            alt="excel"
                                            src={excel}
                                        />
                                    </AlertTitle>
                                    <AlertDescription className="truncate">
                                        Puncionadeira
                                    </AlertDescription>
                                </Alert>
                            </ListItem>
                            <ListItem onClick={handleDrawerThreader.onOpen} className="p-0 m-2 cursor-pointer">
                                <Alert
                                    variant='default'
                                    className="hover:opacity-70 flex justify-start align-middle items-center gap-x-3">

                                    <AlertTitle>
                                        <Image
                                            width={30}
                                            height={30}
                                            alt="excel"
                                            src={excel}
                                        />
                                    </AlertTitle>
                                    <AlertDescription className="truncate">
                                        Rosqueadeira
                                    </AlertDescription>
                                </Alert>
                            </ListItem>
                            <ListItem onClick={handleDrawerFold.onOpen} className="p-0 m-2 cursor-pointer">
                                <Alert
                                    variant='default'
                                    className="hover:opacity-70 flex justify-start align-middle items-center gap-x-3">

                                    <AlertTitle>
                                        <Image
                                            width={30}
                                            height={30}
                                            alt="excel"
                                            src={excel}
                                        />
                                    </AlertTitle>
                                    <AlertDescription>
                                        Dobra
                                    </AlertDescription>
                                </Alert>
                            </ListItem>
                            <ListItem onClick={handleDrawerSoldier.onOpen} className="p-0 m-2 cursor-pointer">
                                <Alert
                                    variant='default'
                                    className="hover:opacity-70 flex justify-start align-middle items-center gap-x-3">

                                    <AlertTitle>
                                        <Image
                                            width={30}
                                            height={30}
                                            alt="excel"
                                            src={excel}
                                        />
                                    </AlertTitle>
                                    <AlertDescription>
                                        Solda
                                    </AlertDescription>
                                </Alert>
                            </ListItem>
                            <ListItem onClick={handleDrawerFinishing.onOpen} className="p-0 m-2 cursor-pointer">
                                <Alert
                                    variant='default'
                                    className="hover:opacity-70 flex justify-start align-middle items-center gap-x-3">
                                    <AlertTitle>
                                        <Image
                                            width={30}
                                            height={30}
                                            alt="excel"
                                            src={excel}
                                        />
                                    </AlertTitle>
                                    <AlertDescription className="truncate">
                                        Acabamento
                                    </AlertDescription>
                                </Alert>
                            </ListItem>
                            <ListItem onClick={handleDrawerSerigraphy.onOpen} className="p-0 m-2 cursor-pointer">
                                <Alert
                                    variant='default'
                                    className="hover:opacity-70 flex justify-start align-middle items-center gap-x-3">
                                    <AlertTitle>
                                        <Image
                                            width={30}
                                            height={30}
                                            alt="excel"
                                            src={excel}
                                        />
                                    </AlertTitle>
                                    <AlertDescription className="truncate">
                                        Serigrafia
                                    </AlertDescription>
                                </Alert>
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none ">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground ">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
