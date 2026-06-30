class SearchState {
	open = $state(false);
	query = $state('');

	openModal() {
		this.open = true;
	}

	closeModal() {
		this.open = false;
		this.query = '';
	}

	toggle() {
		if (this.open) this.closeModal();
		else this.openModal();
	}

	setQuery(q: string) {
		this.query = q;
	}
}

export const search = new SearchState();
