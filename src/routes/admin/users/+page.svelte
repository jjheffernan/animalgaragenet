<script lang="ts">
	import { mockAdminUsers, type MockAdminUser } from '$lib/data/mock/admin-users';
	import { ROLE_OPTIONS, type Role } from '$lib/auth/roles';

	let users = $state<MockAdminUser[]>([...mockAdminUsers]);
	let email = $state('');
	let name = $state('');
	let role = $state<Role>('customer');
	let message = $state('');

	function createUser(event: SubmitEvent) {
		event.preventDefault();
		if (!email.includes('@') || !name.trim()) {
			message = 'Enter a valid name and email.';
			return;
		}

		const newUser: MockAdminUser = {
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

	function updateRole(userId: string, newRole: Role) {
		users = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
	}
</script>

<svelte:head>
	<title>Users — Admin</title>
</svelte:head>

<h1 class="font-display text-2xl font-bold uppercase text-white">Users</h1>
<p class="mt-1 text-zinc-400">Create accounts and assign roles. Prototype uses in-memory mock data until Supabase sync.</p>

{#if message}
	<p class="mt-4 rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">{message}</p>
{/if}

<section class="mt-8 rounded-sm border border-zinc-800 bg-zinc-900/50 p-6">
	<h2 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Create User</h2>
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
</section>

<section class="mt-8 overflow-x-auto rounded-sm border border-zinc-800">
	<table class="w-full min-w-[640px] text-left text-sm">
		<thead class="border-b border-zinc-800 bg-zinc-900/50 text-xs uppercase tracking-widest text-zinc-500">
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
						<select
							value={user.role}
							onchange={(e) => updateRole(user.id, e.currentTarget.value as Role)}
							class="rounded-sm border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-white"
						>
							{#each ROLE_OPTIONS as opt (opt.value)}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
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
