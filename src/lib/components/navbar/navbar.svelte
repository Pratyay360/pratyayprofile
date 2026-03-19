<script lang="ts">
    import { page } from "$app/stores";
    import { cn } from "$lib/utils";
    import {
        NavigationMenuRoot as NavigationMenu,
        NavigationMenuList,
        NavigationMenuItem,
        NavigationMenuLink,
    } from "$lib/components/ui/navigation-menu";
    import {
        Sheet,
        SheetContent,
        SheetTrigger,
        SheetHeader,
        SheetTitle,
    } from "$lib/components/ui/sheet";
    import { Button } from "$lib/components/ui/button";
    import Themer from "$lib/themer/themer.svelte";
    import Menu from "@lucide/svelte/icons/menu";

    let sheetOpen = $state(false);

    type NavItem = {
        label: string;
        href: string;
        type: "hash" | "path";
        value: string;
    };

    const navItems: NavItem[] = [
        { label: "About Me", href: "/#profile", type: "hash", value: "#profile" },
        { label: "Education", href: "/#education", type: "hash", value: "#education" },
        { label: "Skills", href: "/#skills", type: "hash", value: "#skills" },
        { label: "Certificates", href: "/certificates", type: "path", value: "/certificates" },
        { label: "Projects", href: "/projects", type: "path", value: "/projects" },
        { label: "Blogs", href: "/blogs", type: "path", value: "/blogs" },
        { label: "Resume", href: "/#resume", type: "hash", value: "#resume" },
        { label: "Donate", href: "/#donate", type: "hash", value: "#donate" },
        { label: "Contact Me", href: "/#contact", type: "hash", value: "#contact" },
    ];

    function isActive(item: NavItem): boolean {
        if (item.type === "path") {
            return $page.url.pathname === item.value || $page.url.pathname.startsWith(`${item.value}/`);
        }

        return $page.url.pathname === "/" && $page.url.hash === item.value;
    }
</script>

<a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
>
    Skip to content
</a>

<header
    class="supports-backdrop-filter:bg-background/90 sticky top-0 z-50 w-full border-b backdrop-blur"
>
    <div class="container flex h-16 items-center justify-between px-4 md:px-6">
        <div class="hidden md:block md:w-10"></div>

        <!-- Desktop Navigation -->
        <NavigationMenu class="hidden flex-1 justify-center md:flex">
            <NavigationMenuList class="gap-x-1 lg:gap-x-2">
                {#each navItems as item (item.label)}
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            href={item.href}
                            class={cn(
                                "relative rounded-md px-3 py-2 text-sm font-medium transition-all",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                "hover:bg-accent hover:text-accent-foreground",
                                isActive(item)
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-primary",
                            )}
                            aria-current={isActive(item) ? "page" : undefined}
                        >
                            {item.label}
                            <span
                                class={cn(
                                    "absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 scale-x-0 rounded-full bg-primary transition-transform duration-200",
                                    isActive(item) && "scale-x-100",
                                )}
                            ></span>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                {/each}
            </NavigationMenuList>
        </NavigationMenu>

        <!-- Right side: Theme switcher and mobile menu button -->
        <div class="flex items-center gap-2">
            <Themer />

            <div class="md:hidden">
                <!-- Fix 2: use sheetOpen -->
                <Sheet bind:open={sheetOpen}>
                    <SheetTrigger>
                        {#snippet child({ props })}
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Open menu"
                                {...props}
                                class="hover:bg-accent"
                            >
                                <Menu class="h-5 w-5" />
                            </Button>
                        {/snippet}
                    </SheetTrigger>

                    <SheetContent side="right" class="w-64 p-6 overflow-y-auto">
                        <SheetHeader class="mb-6">
                            <SheetTitle>Menu</SheetTitle>
                        </SheetHeader>

                        <nav class="flex flex-col space-y-4">
                            {#each navItems as item (item.label)}
                                <a
                                    href={item.href}
                                    onclick={() => (sheetOpen = false)}
                                    class={cn(
                                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        isActive(item)
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground",
                                    )}
                                    aria-current={isActive(item)
                                        ? "page"
                                        : undefined}
                                >
                                    {item.label}
                                </a>
                            {/each}
                        </nav>

                        <div class="mt-8 border-t pt-6">
                            <p class="mb-2 text-sm text-muted-foreground">
                                Theme
                            </p>
                            <Themer />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </div>
</header>
