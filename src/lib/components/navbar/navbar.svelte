<script lang="ts">
    import { page } from "$app/stores";
    import { cn } from "$lib/utils";
    import { theme as themeStore } from "$lib/theme";
    import CheckIcon from "@lucide/svelte/icons/check";
    import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
    import { tick } from "svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
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
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Button } from "$lib/components/ui/button";
    import Themer from "$lib/themer/themer.svelte";
    import Menu from "@lucide/svelte/icons/menu";
    import Palette from "@lucide/svelte/icons/palette";

    let sheetOpen = $state(false);
    let popoverOpen = $state(false);
    let triggerRef = $state<HTMLButtonElement | null>(null);

    const themes = [
        { label: "catppuchin", value: "catppuchin" },
        { label: "bubblegum", value: "bubblegum" },
        { label: "candyicon", value: "candyicon" },
        { label: "claymorphism", value: "claymorphism" },
        { label: "modernminimal", value: "modernminimal" },
        { label: "pasteldreams", value: "pasteldreams" },
        { label: "vintagepaper", value: "vintagepaper" },
        { label: "violetbloom", value: "violetbloom" },
    ];

    // Fix: Make selectedValue reactive with proper null handling
    const selectedValue = $derived(
        themes.find((f) => f.value === $themeStore)?.label ?? "Select a theme..."
    );

    // Fix: Make currentHash reactive to track hash changes
    const currentHash = $derived($page.url.hash);

    const navItems = [
        { label: "About Me", href: "/#aboutme" },
        { label: "Education", href: "/#education" },
        { label: "Skills", href: "/#skills" },
        { label: "Certificates", href: "/#certificate" },
        { label: "Projects", href: "/#projects" },
        { label: "Blogs", href: "/#blogs" },
        { label: "Resume", href: "/#resume" },
        { label: "Donate", href: "/#donate" },
        { label: "Contact Me", href: "/#contact" },
    ];

    // Fix: Use reactive currentHash instead of $page.url.hash directly
    function isActive(href: string): boolean {
        const hash = href.split("#")[1];
        return currentHash === `#${hash}`;
    }

    // Fix: Safely handle null triggerRef
    function closeAndFocusTrigger() {
        popoverOpen = false;
        tick().then(() => {
            triggerRef?.focus();
        });
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
        <div class="flex items-center"></div>

        <!-- Desktop Navigation -->
        <NavigationMenu class="hidden flex-1 justify-center md:flex">
            <NavigationMenuList class="gap-x-1 lg:gap-x-2">
                {#each navItems as { label, href } (label)}
                    <NavigationMenuItem>
                        <NavigationMenuLink
                            {href}
                            class={cn(
                                "relative rounded-md px-3 py-2 text-sm font-medium transition-all",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                "hover:bg-accent hover:text-accent-foreground",
                                isActive(href)
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-primary",
                            )}
                            aria-current={isActive(href) ? "page" : undefined}
                        >
                            {label}
                            <span
                                class={cn(
                                    "absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 scale-x-0 rounded-full bg-primary transition-transform duration-200",
                                    isActive(href) && "scale-x-100",
                                )}
                            ></span>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                {/each}
            </NavigationMenuList>
        </NavigationMenu>

        <!-- Right side: Theme switcher and mobile menu button -->
        <div class="flex items-center gap-2">
            <!-- Desktop Themer -->
            <div class="hidden items-center gap-2 md:flex">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        {#snippet child({ props })}
                            <Button variant="outline" size="icon" {...props}>
                                <Palette class="h-5 w-5" />
                                <span class="sr-only">Toggle theme</span>
                            </Button>
                        {/snippet}
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                        {#each themes as theme}
                            <DropdownMenu.Item onSelect={() => ($themeStore = theme.value)}>
                                {theme.label}
                                {#if $themeStore === theme.value}
                                    <CheckIcon class="ml-auto h-4 w-4" />
                                {/if}
                            </DropdownMenu.Item>
                        {/each}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <Themer />
            </div>

            <!-- Mobile Menu -->
            <div class="md:hidden">
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
                            {#each navItems as { label, href } (label)}
                                <a
                                    {href}
                                    onclick={() => (sheetOpen = false)}
                                    class={cn(
                                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        isActive(href)
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground",
                                    )}
                                    aria-current={isActive(href) ? "page" : undefined}
                                >
                                    {label}
                                </a>
                            {/each}
                        </nav>

                        <!-- Theme Selector in Mobile Menu -->
                        <div class="mt-8 border-t pt-6">
                            <p class="mb-3 text-sm font-medium text-muted-foreground">
                                Theme
                            </p>
                            <Popover.Root bind:open={popoverOpen}>
                                <Popover.Trigger bind:ref={triggerRef}>
                                    {#snippet child({ props })}
                                        <Button
                                            variant="outline"
                                            class="w-full justify-between"
                                            {...props}
                                            role="combobox"
                                            aria-expanded={popoverOpen}
                                        >
                                            {selectedValue}
                                            <ChevronsUpDownIcon class="ms-2 size-4 shrink-0 opacity-50" />
                                        </Button>
                                    {/snippet}
                                </Popover.Trigger>
                                <Popover.Content class="w-[--radix-popover-trigger-width] p-0">
                                    <Command.Root>
                                        <Command.Input placeholder="Search themes..." />
                                        <Command.List>
                                            <Command.Empty>No themes found.</Command.Empty>
                                            <Command.Group>
                                                {#each themes as theme}
                                                    <Command.Item
                                                        value={theme.value}
                                                        onSelect={() => {
                                                            $themeStore = theme.value;
                                                            closeAndFocusTrigger();
                                                        }}
                                                    >
                                                        <CheckIcon
                                                            class={cn(
                                                                "me-2 size-4",
                                                                $themeStore !== theme.value &&
                                                                    "opacity-0",
                                                            )}
                                                        />
                                                        {theme.label}
                                                    </Command.Item>
                                                {/each}
                                            </Command.Group>
                                        </Command.List>
                                    </Command.Root>
                                </Popover.Content>
                            </Popover.Root>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </div>
</header>
