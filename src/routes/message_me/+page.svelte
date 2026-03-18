<script lang="ts">
    import { toast, Toaster } from "svelte-sonner";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { createClient } from "$lib/pocketbase";

    let submissionStatus = false;
    let form = {
        userName: "",
        userEmail: "",
        userMessage: "",
    };

    const submitRequest = async () => {
        const pocketBaseClient = createClient(
            import.meta.env.VITE_POCKET_BASE!,
        );

        try {
            submissionStatus = true;
            await pocketBaseClient.collection("messages").create({
                userName: form.userName,
                userEmail: form.userEmail,
                userMessage: form.userMessage,
            });
            form = { userName: "", userEmail: "", userMessage: "" };
            toast.success("Message sent successfully");
        } catch {
            toast.error("Failed to send message");
        } finally {
            submissionStatus = false;
        }
    };
</script>

<div class=" flex min-h-screen items-center justify-center p-4">
    <Toaster />
    <Card
        class="w-full max-w-2xl border-slate-200 shadow-xl dark:border-slate-700"
    >
        <CardHeader class="pb-4">
            <CardTitle class="text-foreground text-center text-3xl font-bold"
                >Contact Us</CardTitle
            >
            <CardDescription class="text-muted-foreground text-center">
                Got a query or wish to work together?
            </CardDescription>
        </CardHeader>

        <CardContent>
            <form class="space-y-6" on:submit|preventDefault={submitRequest}>
                <div>
                    <label for="userName" class="text-sm font-medium"
                        >Name</label
                    >
                    <Input
                        id="userName"
                        name="Name"
                        bind:value={form.userName}
                        placeholder="Your name"
                        required
                        class="placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:placeholder:text-slate-500"
                    />
                </div>

                <div>
                    <label
                        for="userEmail"
                        class="text-foreground text-sm font-medium">Email</label
                    >
                    <Input
                        id="userEmail"
                        name="Email"
                        type="email"
                        bind:value={form.userEmail}
                        placeholder="you@example.com"
                        required
                        class="border-slate-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:placeholder:text-slate-500"
                    />
                </div>

                <div>
                    <label
                        for="userMessage"
                        class="text-foreground text-sm font-medium"
                        >Message</label
                    >
                    <Textarea
                        id="userMessage"
                        name="Message"
                        rows={5}
                        bind:value={form.userMessage}
                        placeholder="Your message..."
                        required
                        class="resize-none border-slate-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:placeholder:text-slate-500"
                    />
                </div>

                <Button
                    type="submit"
                    variant="outline"
                    disabled={submissionStatus}
                >
                    {#if submissionStatus}
                        Submitting...
                    {:else}
                        Submit Message
                    {/if}
                </Button>
            </form>
        </CardContent>
    </Card>
</div>
