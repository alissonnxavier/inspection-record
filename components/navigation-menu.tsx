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

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
        description:
            "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
        description:
            "For sighted users to preview content available behind a link.",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
        description:
            "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
        description: "Visually or semantically separates content.",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
        description:
            "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
        description:
            "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
]

export function Menu() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid md:w-[500px] lg:w-[500px] sm:w-full lg:grid-cols-[.75fr_1fr] ">
                            <li className="row-span-6 m-2 ">
                                <NavigationMenuLink asChild className="justify-center align-middle items-center ">
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-5 no-underline outline-none focus:shadow-md hover:opacity-75"
                                        href="/"
                                    >
                                        <FcInspection className="h-32 w-32" />
                                        {/*  <Alert className="gap-y-5">
                                            <AlertTitle>Formulários</AlertTitle>
                                            <AlertDescription>
                                                Prensa
                                            </AlertDescription>
                                            <AlertDescription>
                                                Puncionadeira
                                            </AlertDescription>
                                            <AlertDescription>
                                                Dobra
                                            </AlertDescription>
                                            <AlertDescription>
                                                Rosqueadeira
                                            </AlertDescription>
                                            <AlertDescription>
                                                Solda
                                            </AlertDescription>
                                            <AlertDescription>
                                                Acabamento
                                            </AlertDescription>
                                        </Alert> */}
                                        <p className="font-extrabold text-2xl">
                                            Formulários
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/csv/press" title="" className="p-0 m-2">
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
                            <ListItem href="/csv/punching" className="p-0 m-2">
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
                            <ListItem href="/csv/threader" className="p-0 m-2">
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
                            <ListItem href="/csv/fold" className="p-0 m-2">
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
                            <ListItem href="/csv/soldier" className="p-0 m-2">
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
                            <ListItem href="/csv/finishing" className="p-0 m-2">
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
