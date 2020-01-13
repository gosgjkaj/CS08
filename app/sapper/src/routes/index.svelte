<script>
	import { session } from '../stores'
</script>

<svelte:head>
	<title>Sapper/Prisma/Bulma app template</title>
</svelte:head>

<div class="box has-background-warning">
	<p class="content"><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>
</div>

<div class="box">
	<p class="content">
		<a href="/admin">Admin Page</a>
	</p>
</div>

{#if $session.user}
	<p class="content">
		You are logged in as {$session.user.name}. You have {$session.user.role} permission.
	</p>
{/if}