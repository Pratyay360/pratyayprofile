<script lang="ts">
	import AboutMe from './sections/aboutme.svelte'
	import Education from './sections/education.svelte';
	import Skills from './sections/skills.svelte';
	import Certificates from './certificates/preview.svelte';
	import Projects from './projects/preview.svelte';
	import BlogsPreview from './blogs/preview.svelte';
	import Donate from './sections/donate.svelte';
	import Contact from './sections/contact.svelte';
	import Resume from './sections/resume.svelte';
</script>

<div>
	<section id="profile" class="snap-center justify-center pt-20">
		<AboutMe />
	</section>
	<section id="education" class="snap-center justify-center pt-20">
		<Education />
	</section>
	<section id="skills" class="snap-center justify-center pt-20">
		<Skills />
	</section>
	<section id="certificate" class="snap-center justify-center pt-20">
		<Certificates />
	</section>
	<section id="projects" class="snap-center justify-center pt-20">
		<Projects />
	</section>
	<section id="blogs" class="snap-center justify-center pt-20">
		<BlogsPreview />
	</section>
	<section id="resume" class="snap-center justify-center pt-20">
		<Resume />
	</section>
	<section id="donate" class="snap-center justify-center pt-20">
		<Donate />
	</section>
	<section id="contact" class="snap-center justify-center pt-20">
		<Contact />
	</section>
</div>
