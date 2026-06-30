<script lang="ts">
	import { enhance } from '$app/forms';
	import AdminPageHeader from '$lib/components/admin/AdminPageHeader.svelte';
	import {
		adminAlertInfo,
		adminBtnPrimary,
		adminCard,
		adminCardFlush,
		adminField,
		adminTableHead
	} from '$lib/components/admin/admin-ui';
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
	let searchQuery = $state('');

	const isLive = $derived(data.source === 'supabase');

	const filteredUsers = $derived.by(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return users;
		return users.filter(
			(user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
		);
	});

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
</script>

<svelte:head>
	<title>Users — Admin</title>
</svelte:head>

<div class="space-y-6">
	<AdminPageHeader title="Users">
		{#snippet subtitle()}
			{#if isLive}
				Auth users from Supabase. Role changes write to
				<code class="text-zinc-500">app_metadata.role</code>; invite new accounts via email.
			{:else}
				Create accounts and assign roles. Prototype uses in-memory mock data until Supabase service
				role is configured.
			{/if}
		{/snippet}
	</AdminPageHeader>

	{#if message}
		<div role="alert" class={adminAlertInfo}>
			{message}
		</div>
	{/if}

	<div class={adminCard}>
		<h2 class="text-sm font-bold uppercase tracking-widest text-white">
			{isLive ? 'Invite User' : 'Create User'}
		</h2>
		{#if isLive}
			<form
				method="POST"
				action="?/invite"
				use:enhance
				class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
			>
				<label class="block w-full">
					<span class="text-xs text-zinc-500">Name</span>
					<input type="text" name="name" required class="{adminField} mt-1" />
				</label>
				<label class="block w-full">
					<span class="text-xs text-zinc-500">Email</span>
					<input type="email" name="email" required class="{adminField} mt-1" />
				</label>
				<label class="block w-full">
					<span class="text-xs text-zinc-500">Role</span>
					<select name="role" class="{adminField} mt-1">
						{#each ROLE_OPTIONS as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</label>
				<div class="flex items-end">
					<button type="submit" class="{adminBtnPrimary} w-full">Invite</button>
				</div>
			</form>
		{:else}
			<form class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" onsubmit={createUser}>
				<label class="block w-full">
					<span class="text-xs text-zinc-500">Name</span>
					<input type="text" bind:value={name} class="{adminField} mt-1" />
				</label>
				<label class="block w-full">
					<span class="text-xs text-zinc-500">Email</span>
					<input type="email" bind:value={email} class="{adminField} mt-1" />
				</label>
				<label class="block w-full">
					<span class="text-xs text-zinc-500">Role</span>
					<select bind:value={role} class="{adminField} mt-1">
						{#each ROLE_OPTIONS as opt (opt.value)}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</label>
				<div class="flex items-end">
					<button type="submit" class="{adminBtnPrimary} w-full">Create</button>
				</div>
			</form>
		{/if}
	</div>

	<div class="flex flex-wrap items-center justify-between gap-3">
		<label class="block min-w-[14rem] flex-1 sm:max-w-md">
			<span class="sr-only">Search users</span>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="Search by name or email…"
				class={adminField}
			/>
		</label>
		<p class="text-xs text-zinc-500">
			{filteredUsers.length} of {users.length} users
		</p>
	</div>

	<div class={adminCardFlush}>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class={adminTableHead}>
						<th class="px-4 py-3 text-left">Name</th>
						<th class="px-4 py-3 text-left">Email</th>
						<th class="px-4 py-3 text-left">Role</th>
						<th class="px-4 py-3 text-left">Created</th>
						<th class="px-4 py-3 text-left">Last Active</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-zinc-800">
					{#each filteredUsers as user (user.id)}
						<tr class="odd:bg-zinc-900/30">
							<td class="px-4 py-3 font-medium">{user.name}</td>
							<td class="px-4 py-3 text-zinc-400">{user.email}</td>
							<td class="px-4 py-3">
								{#if isLive}
									<form method="POST" action="?/updateRole" use:enhance class="inline">
										<input type="hidden" name="userId" value={user.id} />
										<select
											name="role"
											value={user.role}
											onchange={(e) => e.currentTarget.form?.requestSubmit()}
											class="rounded-sm border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-white focus:border-red-600 focus:outline-none"
										>
											{#each ROLE_OPTIONS as opt (opt.value)}
												<option value={opt.value}>{opt.label}</option>
											{/each}
										</select>
									</form>
								{:else}
									<select
										value={user.role}
										onchange={(e) =>
											(users = users.map((u) =>
												u.id === user.id ? { ...u, role: e.currentTarget.value as Role } : u
											))}
										class="rounded-sm border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-white focus:border-red-600 focus:outline-none"
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
					{:else}
						<tr>
							<td colspan="5" class="px-4 py-8 text-center text-sm text-zinc-500">
								No users match “{searchQuery.trim()}”.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<div class={adminCard}>
		<h2 class="text-sm font-bold uppercase tracking-widest text-white">Role Definitions</h2>
		<dl class="mt-4 grid gap-4 sm:grid-cols-2">
			{#each ROLE_OPTIONS as opt (opt.value)}
				<div>
					<dt class="font-medium">{opt.label}</dt>
					<dd class="mt-1 text-sm text-zinc-500">{opt.description}</dd>
				</div>
			{/each}
		</dl>
	</div>
</div>
