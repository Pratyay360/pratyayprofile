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
</script>

<header
	class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
>
	<div class="container flex h-16 items-center justify-center">
		<NavigationMenu class="hidden flex-1 justify-center md:flex">
			<NavigationMenuList class="gap-x-6">
				{#each navItems as { label, href } (label)}
					<NavigationMenuItem>
						<NavigationMenuLink
							{href}
							class={cn(
								'relative px-2 py-1 text-sm font-medium transition-colors',
								$page.url.pathname === href
									? 'text-primary'
									: 'text-muted-foreground hover:text-primary'
							)}
						>
							{label}
							<span
								class={cn(
									'absolute bottom-0 left-0 h-0.5 w-full scale-x-0 bg-primary transition-transform duration-200',
									$page.url.pathname === href && 'scale-x-100'
								)}
							></span>
						</NavigationMenuLink>
					</NavigationMenuItem>
				{/each}
			</NavigationMenuList>
		</NavigationMenu>

		<div class="flex items-center gap-2">
			<Themer />

			<div class="md:hidden">
				<Sheet bind:open>
					<SheetTrigger>
						{#snippet child({ props })}
							<Button variant="ghost" size="icon" aria-label="Open menu" {...props}>
								<Menu class="h-5 w-5" />
							</Button>
						{/snippet}
					</SheetTrigger>

					<SheetContent side="right" class="w-64">
						<SheetHeader>
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>

						<nav class="mt-6 flex flex-col space-y-3 text-gray-900 dark:text-gray-200">
							{#each navItems as { label, href } (label)}
								<a
									{href}
									onclick={() => (open = false)}
									class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
								>
									{label}
								</a>
							{/each}
						</nav>

						<div class="mt-8 border-t pt-4">
							<Themer />
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</div>
</header>
