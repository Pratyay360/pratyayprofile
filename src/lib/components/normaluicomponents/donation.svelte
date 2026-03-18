<script lang="ts" module>
    export interface DonationCardInterface {
        link: string;
        name: string;
        image: string;
    }
</script>

<script lang="ts">
    const { link, name, image } = $props();
</script>

<a
    href={link}
    target="_blank"
    aria-label={name ? `Open ${name}` : "Open donation link"}
>
    <div
        class="h-full transform overflow-hidden transition-all hover:scale-110"
    >
        <enhanced:img
            class="w-full object-center md:h-36 lg:h-48"
            src={image}
            alt={name}
            sizes="45"
        />
    </div>
</a>
