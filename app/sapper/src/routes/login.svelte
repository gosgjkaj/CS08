<script context="module">
	import { checkPermission } from '../utils.js'

	export async function preload(page, session) {
		const perm = await checkPermission()
		
		if (perm != null) {
			return this.redirect(302, '/')
		}

		return { }
	}
</script>

<script>
	import { goto, stores } from '@sapper/app'
	import { session } from '../stores'
	
	let email
	let password
	let warning = false
	
	let loading = false

	async function login() {
		loading = true
	
		const response = await fetch("/login",{
			method: 'POST',
			headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		})
		
		if(response.status == 201) {
			session.set({ user: (await response.json()).user})
			goto('/')
			warning =false
		} else {
			warning = true
			loading = false
		}
	
	}
</script>

<div class="container" style="width:35%; margin-top:5%">
	<h1 style="font-size: 40px; font-weight: bold; text-align: center; margin:20px">Log in</h1>

	<div class="field">
		<div class="control has-icons-left has-icons-right">
			<input bind:value={email} class="input is-primary" type="email" placeholder="Email" value="">
			<span class="icon is-small is-left">
				<i class="fas fa-envelope"></i>
			</span>
		</div>
	</div>
	
	<div class="field">
		<div class="control has-icons-left has-icons-right">
			<input bind:value={password} class="input is-primary" type="password" placeholder="Password" value="">
			<span class="icon is-small is-left">
				<i class="fas fa-lock"></i>
			</span>
		</div>
	</div>

	<div class="field is-horizontal" style="justify-content:center">
		<button class="button is-success is-medium" on:click={login}>Log in</button>
	</div>

	{#if loading} 
		<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
	{/if}

	{#if warning} 
		<div class="box has-background-danger has-text-white "> Email or password is incorrect.</div>
	{/if}
</div>
