"use client"

import * as React from "react"
import { FcInspection } from "react-icons/fc";
import { cn } from "@/lib/utils"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

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
                        <ul className="grid   md:w-[400px] lg:w-[500px] sm:w-full lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-6">
                                <NavigationMenuLink asChild className="justify-center align-middle items-center">
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-1 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <FcInspection className="h-32 w-32" />
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            Formulários
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground p-1">
                                            Prensa, Puncionadeira, Dobra, Rosqueadeira, Solda e Acabamento.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/csv/press" title="Planilha Prensa">
                                ODF, codigos, resultados e etc...
                            </ListItem>
                            <ListItem href="/csv/punching" title="Planilha Puncionadeira">
                                ODF, codigos, resultados e etc...
                            </ListItem>
                            <ListItem href="/csv/threader" title="Planilha Rosqueadeira">
                                ODF, codigos, resultados e etc...
                            </ListItem>
                            <ListItem href="/csv/fold" title="Planilha Dobra">
                                ODF, codigos, resultados e etc...
                            </ListItem>
                            <ListItem href="/csv/soldier" title="Planilha Solda">
                                ODF, codigos, resultados e etc...
                            </ListItem>
                            <ListItem href="/csv/finishing" title="Planilha Acabamento">
                                ODF, codigos, resultados e etc...
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
