export function formatDateRelative(n: number): string {
	const diff = (Date.now() - n) / 1000 / 60
	if (diff < 60) {
		return `vor ${Math.floor(diff)} Min.`
	} else if (diff / 60 < 24) {
		return `vor ${Math.floor(diff / 60)} Std.`
	} else if (diff / 60 / 24 < 7) {
		return `vor ${Math.floor(diff / 60 / 24)} Tagen`
	}

	const date = new Date(n)
	return date.toLocaleDateString('de', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}
