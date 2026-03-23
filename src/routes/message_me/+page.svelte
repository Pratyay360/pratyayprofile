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

    const pocketBaseClient = createClient(import.meta.env.VITE_POCKET_BASE);

    let submissionStatus = $state(false);

    let form = $state({
        userName: "",
        userEmail: "",
        userMessage: "",
    });

    const submitRequest = async (e: Event) => {
        e.preventDefault();
        try {
            submissionStatus = true;
            const data = {
                name: form.userName,
                email: form.userEmail,
                message: form.userMessage,
            };
            await pocketBaseClient.collection("messages").create(data);
            toast.success("Message sent successfully");
            form.userName = "";
            form.userEmail = "";
            form.userMessage = "";
        } catch (err) {
            console.error(err);
            toast.error("Failed to send message");
        } finally {
            submissionStatus = false;
        }
    };
</script>

<Toaster />

<div class="flex min-h-screen items-center justify-center p-4">
    <Card class="w-full max-w-2xl border-border shadow-xl">
        <CardHeader class="pb-4">
            <CardTitle class="text-foreground text-center text-3xl font-bold">
                Get In Touch
            </CardTitle>
            <CardDescription class="text-muted-foreground text-center p-3">
                Message me :)
            </CardDescription>
        </CardHeader>

        <CardContent>
                <div>
                    <label for="userName" class="text-sm font-medium">
                        Name
                    </label>
                    <Input
                        id="userName"
                        name="Name"
                        bind:value={form.userName}
                        placeholder="Your name"
                        required
                    />
                </div>

                <div>
                    <label for="userEmail" class="text-foreground text-sm font-medium">
                        Email
                    </label>
                    <Input
                        id="userEmail"
                        name="Email"
                        type="email"
                        bind:value={form.userEmail}
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div>
                    <label for="userMessage" class="text-foreground text-sm font-medium">
                        Message
                    </label>
                    <Textarea
                        id="userMessage"
                        name="Message"
                        rows={5}
                        bind:value={form.userMessage}
                        placeholder="Your message..."
                        required
                        class="resize-none"
                    />
                </div>

                <Button
                    variant="outline"
                    onclick={submitRequest}
                    disabled={submissionStatus}
                >
                    {#if submissionStatus}
                        Submitting...
                    {:else}
                        Submit Message
                    {/if}
                </Button>
        </CardContent>
    </Card>
</div>
