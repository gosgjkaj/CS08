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
    let role = 'Admin'

    let loading = false
    async function clearFields() {
        name=""
        email=""
        password=""
        confirmPassword=""
        role='Admin'
	}
	let passwordsNotMatching = false
    let emailInvalid = false
    let passwordInvalid = false
    let incompleteFields = false
	let reqError = false
	
	function validateEmail(email)  {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    }

    function validatePassword(password) {
        // at least one number, one lowercase and one uppercase letter
    // at least six characters
    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password)
    }

    function validateFieldsComplete() {
        return !([name, role, email, password, confirmPassword].includes(""))
    }

	async function register() {
		loading = true
		emailInvalid = !validateEmail(email)
		passwordInvalid = !validatePassword(password)
		incompleteFields= !validateFieldsComplete() 
		if (!emailInvalid && !passwordInvalid && !incompleteFields){
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
			reqError=true
		} finally {
			loading = false
		}
		}else{
			loading=false
		}

	}

</script>

<div class="container">
	<h1 class="title is-1">Register</h1>


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
                     <option value="Admin" selected >Admin </option>
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

	<button class="button is-primary" on:click={register}>Register</button>

	{#if loading} 
		<div class="section"><progress class="progress is-small is-info" max="100"></progress></div>
	{/if}

	{#if emailInvalid} 
        <div class="container animated fadeInUp m-md">
            <div class="notification is-danger">
                <button class="delete" on:click={() => emailInvalid = false}></button>
                Invalid email.
            </div>
        </div>
    {/if}

    {#if passwordInvalid} 
        <div class="container animated fadeInUp m-md">
            <div class="notification is-danger">
                <button class="delete" on:click={() => passwordInvalid = false}></button>
                Your password must be at least 6 characters long and contain at least one number, one uppercase letter, and one lowercase letter.
            </div>
        </div>
    {/if}

    {#if incompleteFields} 
        <div class="container animated fadeInUp m-md">
            <div class="notification is-danger">
                <button class="delete" on:click={() => incompleteFields = false}></button>
                Please complete all fields.
            </div>
        </div>
    {/if}

    {#if reqError} 
        <div class="container animated fadeInUp m-md">
            <div class="notification is-danger">
                <button class="delete" on:click={() => reqError = false}></button>
                Registration failed. You may have already registered.
            </div>
        </div>
    {/if}
</div>