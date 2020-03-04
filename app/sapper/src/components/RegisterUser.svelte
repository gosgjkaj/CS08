<script>
	import { query, mutate } from 'svelte-apollo'
	import { gql } from 'apollo-boost'
	import { client } from '../gqlClient'
	import { goto } from '@sapper/app'
    export let afterRegister = () => {}
	let name
	let email
	let password
    let confirmPassword
    let role

    let loading = false
    async function clearFields() {
        name=""
        email=""
        password=""
        confirmPassword=""
        role=""
    }

	async function register() {
		loading = true

		try {
			const signupMutation = await mutate(client(), { mutation: gql`
				mutation {
					signup(
						name: "${name}"
						email:"${email}"
                        password: "${password}"
                        role: ${role}
					) {
						token
					}
				}
			`})

            afterRegister()
            clearFields()
		} catch(e) {
			console.error(e)
		} finally {
			loading = false
		}

	}

</script>

<div class="container">
	<h1 style="font-size: 40px; font-weight: bold; text-align: center; margin:20px">Register</h1>


	<div class="field is-horizontal">
		<div class="field-label is-normal">
			<label class="label">Name</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control has-icons-left has-icons-right">
					<input bind:value={name} class="input is-primary is-expanded" type="text" placeholder="" value="">
					<span class="icon is-small is-left">
						<i class="fas fa-user"></i>
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="field is-horizontal">
		<div class="field-label is-normal">
			<label class="label">Email</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control has-icons-left has-icons-right">
					<input bind:value={email} class="input is-primary is-expanded" type="email" placeholder="" value="">
					<span class="icon is-small is-left">
						<i class="fas fa-envelope"></i>
					</span>
				</div>
			</div>
		</div>
	</div>

    <div class="field is-horizontal">
		<div class="field-label is-normal">
			<label class="label">Role</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control has-icons-left has-icons-right is-expanded">

                    <div class="select is-primary is-expanded">
                    <select bind:value={role} class="is-expanded" aria-placeholder="Normal" >
                     <option value="Admin" >Admin </option>
                     <option value="Normal"> Normal</option>
                     <option value="Restricted">Restricted(Read only)</option>
					
                    </select>
                    </div>
                     <div class="icon is-small is-left">
                        <i class="fas fa-user-tag"></i>
                    </div>
				</div>
			</div>
		</div>
	</div>

	<div class="field is-horizontal">
		<div class="field-label is-normal">
			<label class="label">Password</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control has-icons-left has-icons-right">
					<input bind:value={password} class="input is-primary is-expanded" type="password" placeholder="" value="">
					<span class="icon is-small is-left">
						<i class="fas fa-lock"></i>
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="field is-horizontal">
		<div class="field-label is-normal">
			<label class="label">Confirm Password</label>
		</div>
		<div class="field-body">
			<div class="field">
				<div class="control has-icons-left has-icons-right">
					<input bind:value={confirmPassword} class="input is-primary is-expanded" type="password" placeholder="" value="">
					<span class="icon is-small is-left">
						<i class="fas fa-lock"></i>
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="field is-horizontal" style="justify-content:center">
		<button class="button is-primary is-medium" on:click={register}>Register</button>
	</div>

	{#if loading} 
		<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
	{/if}
</div>
