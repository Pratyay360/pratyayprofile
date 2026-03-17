<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import {
		NavigationMenuRoot as NavigationMenu,
		NavigationMenuList,
		NavigationMenuItem,
		NavigationMenuLink
	} from '$lib/components/ui/navigation-menu';
	import {
		Sheet,
		SheetContent,
		SheetTrigger,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import Themer from '$lib/themer/themer.svelte';
	import Menu from '@lucide/svelte/icons/menu';

	const navItems = [
		{ label: 'About Me', href: '/#aboutme' },
		{ label: 'Education', href: '/#education' },
		{ label: 'Skills', href: '/#skills' },
		{ label: 'Certificates', href: '/#certificate' },
		{ label: 'Projects', href: '/#projects' },
		{ label: 'Blogs', href: '/#blogs' },
		{ label: 'Resume', href: '/#resume' },
		{ label: 'Donate', href: '/#donate' },
		{ label: 'Contact Me', href: '/#contact' }
	];

	let open = $state(false);
	function isActive(href: string): boolean {
		const hash = href.split('#')[1];
		return $page.url.hash === `#${hash}`;
	}
	
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
>
	Skip to content
</a>

<header
	class="bg-background/95 supports-backdrop-filter:bg-background/90 sticky top-0 z-50 w-full border-b backdrop-blur"
>
	<div class="container flex h-16 items-center justify-between px-4 md:px-6">
		<!-- Optional: Site logo or name -->
		<div class="flex items-center">
			<!-- <a href="/" class="text-xl font-bold text-foreground">Your Name</a> -->
		</div>

		<!-- Desktop Navigation -->
		<NavigationMenu class="hidden flex-1 justify-center md:flex">
			<NavigationMenuList class="gap-x-1 lg:gap-x-2">
				{#each navItems as { label, href } (label)}
					<NavigationMenuItem>
						<NavigationMenuLink
							{href}
							class={cn(
								'relative rounded-md px-3 py-2 text-sm font-medium transition-all',
								'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
								'hover:bg-accent hover:text-accent-foreground',
								isActive(href)
									? 'text-primary bg-primary/10'
									: 'text-muted-foreground hover:text-primary'
							)}
							aria-current={isActive(href) ? 'page' : undefined}
						>
							{label}
							<!-- Animated underline for active item -->
							<span
								class={cn(
									'absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 scale-x-0 rounded-full bg-primary transition-transform duration-200',
									isActive(href) && 'scale-x-100'
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
				<Sheet bind:open>
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

					<SheetContent side="right" class="w-64 p-6">
						<SheetHeader class="mb-6">
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>

						<nav class="flex flex-col space-y-4">
							{#each navItems as { label, href } (label)}
								<a
									{href}
									onclick={() => (open = false)}
									class={cn(
										'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
										'hover:bg-accent hover:text-accent-foreground',
										isActive(href)
											? 'text-primary bg-primary/10'
											: 'text-muted-foreground'
									)}
									aria-current={isActive(href) ? 'page' : undefined}
								>
									{label}
								</a>
							{/each}
						</nav>

						<div class="mt-8 border-t pt-6">
							<p class="mb-2 text-sm text-muted-foreground">Theme</p>
							<Themer />
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</div>
</header>
