export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildSearchKeywords(input: string, tags: string[] = []): string[] {
  const raw = `${input} ${tags.join(' ')}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return Array.from(new Set(raw.split(/[^a-z0-9]+/).filter((x) => x.length >= 2)));
}

export function parseTags(value: string): string[] {
  return Array.from(new Set(value.split(',').map((x) => x.trim().toLowerCase()).filter(Boolean)));
}
