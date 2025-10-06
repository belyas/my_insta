import Link from 'next/link';

export function renderHashtags(content: string) {
  return content.split(/(#[\w\d_]+)/g).map((part, i) => {
    if (/^#[\w\d_]+$/.test(part)) {
      const tag = part.slice(1);
      return (
        <Link key={i} href={`/search?hashtag=${encodeURIComponent(tag)}`} style={{ color: 'black', fontWeight: 700, textDecoration: 'none' }}>
          {part}
        </Link>
      );
    }
    return part;
  });
}
