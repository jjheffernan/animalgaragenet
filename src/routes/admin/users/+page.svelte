<script lang="ts">
	import { enhance } from '$app/forms';
	import type { AdminUserRow } from '$lib/server/supabase/admin-users';
	import { ROLE_OPTIONS, type Role } from '$lib/auth/roles';
	import type { PageData } from './$types';

	let {
		data,
		form
	}: {
		data: PageData;
		form: { error?: string; success?: boolean; message?: string } | null;
	} = $props();

	let users = $state<AdminUserRow[]>([...data.users]);
	let email = $state('');
	let name = $state('');
	let role = $state<Role>('customer');
	let message = $state('');

	const isLive = $derived(data.source === 'supabase');

	$effect(() => {
		users = [...data.users];
	});

	$effect(() => {
		if (form?.error) message = form.error;
		else if (form?.message) message = form.message;
		else if (form?.success) message = 'Role updated.';
	});

	function createUser(event: SubmitEvent) {
		event.preventDefault();
		if (isLive) return;

		if (!email.includes('@') || !name.trim()) {
			message = 'Enter a valid name and email.';
			return;
		}

		const newUser: AdminUserRow = {
			id: `u${Date.now()}`,
			email: email.trim(),
			name: name.trim(),
			role,
			createdAt: new Date().toISOString().slice(0, 10),
			lastActive: new Date().toISOString().slice(0, 10)
		};

		users = [...users, newUser];
		email = '';
		name = '';
		role = 'customer';
		message = `Created ${newUser.name} (${newUser.role}).`;
	}

	function updateRoleLocal(userId: string, newRole: Role) {
		if (isLive) return;
		users = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
	}
</script>

<svelte:head>
	<title>Users — Admin</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Users</h1>
<p class="mt-1 text-zinc-400">
	{#if isLive}
		Auth users from Supabase. Role changes write to <code class="text-zinc-500">app_metadata.role</code
		>; invite new accounts via email.
	{:else}
		Create accounts and assign roles. Prototype uses in-memory mock data until Supabase service role is
		configured.
	{/if}
</p>

{#if message}
	<p class="mt-4 rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
		{message}
	</p>
{/if}

<section class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">
		{isLive ? 'Invite User' : 'Create User'}
	</h2>
	{#if isLive}
		<form
			method="POST"
			action="?/invite"
			use:enhance
			class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
		>
			<label class="block">
				<span class="text-xs text-zinc-600">Name</span>
				<input
					type="text"
					name="name"
					required
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-600">Email</span>
				<input
					type="email"
					name="email"
					required
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-600">Role</span>
				<select
					name="role"
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				>
					{#each ROLE_OPTIONS as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</label>
			<div class="flex items-end">
				<button
					type="submit"
					class="w-full rounded-sm bg-red-600 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-500"
				>
					Invite
				</button>
			</div>
		</form>
	{:else}
		<form class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" onsubmit={createUser}>
			<label class="block">
				<span class="text-xs text-zinc-600">Name</span>
				<input
					type="text"
					bind:value={name}
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-600">Email</span>
				<input
					type="email"
					bind:value={email}
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				/>
			</label>
			<label class="block">
				<span class="text-xs text-zinc-600">Role</span>
				<select
					bind:value={role}
					class="mt-1 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
				>
					{#each ROLE_OPTIONS as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</label>
			<div class="flex items-end">
				<button
					type="submit"
					class="w-full rounded-sm bg-red-600 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-red-500"
				>
					Create
				</button>
			</div>
		</form>
	{/if}
</section>

<section class="mt-8 overflow-x-auto rounded-sm border border-zinc-800">
	<table class="w-full min-w-[640px] text-left text-sm">
		<thead
			class="border-b border-zinc-800 bg-zinc-900/50 text-xs uppercase tracking-widest text-zinc-500"
		>
			<tr>
				<th class="px-4 py-3">Name</th>
				<th class="px-4 py-3">Email</th>
				<th class="px-4 py-3">Role</th>
				<th class="px-4 py-3">Created</th>
				<th class="px-4 py-3">Last Active</th>
			</tr>
		</thead>
		<tbody>
			{#each users as user (user.id)}
				<tr class="border-b border-zinc-800/50">
					<td class="px-4 py-3 text-white">{user.name}</td>
					<td class="px-4 py-3 text-zinc-400">{user.email}</td>
					<td class="px-4 py-3">
						{#if isLive}
							<form method="POST" action="?/updateRole" use:enhance class="inline">
								<input type="hidden" name="userId" value={user.id} />
								<select
									name="role"
									value={user.role}
									onchange={(e) => e.currentTarget.form?.requestSubmit()}
									class="rounded-sm border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white"
								>
									{#each ROLE_OPTIONS as opt (opt.value)}
										<option value={opt.value}>{opt.label}</option>
									{/each}
								</select>
							</form>
						{:else}
							<select
								value={user.role}
								onchange={(e) => updateRoleLocal(user.id, e.currentTarget.value as Role)}
								class="rounded-sm border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white"
							>
								{#each ROLE_OPTIONS as opt (opt.value)}
									<option value={opt.value}>{opt.label}</option>
								{/each}
							</select>
						{/if}
					</td>
					<td class="px-4 py-3 text-zinc-500">{user.createdAt}</td>
					<td class="px-4 py-3 text-zinc-500">{user.lastActive}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<section class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/30 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Role Definitions</h2>
	<dl class="mt-4 grid gap-4 sm:grid-cols-2">
		{#each ROLE_OPTIONS as opt (opt.value)}
			<div>
				<dt class="font-medium text-white">{opt.label}</dt>
				<dd class="mt-1 text-sm text-zinc-500">{opt.description}</dd>
			</div>
		{/each}
	</dl>
</section>
