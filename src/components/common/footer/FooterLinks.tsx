import Link from 'next/link';

type FooterLink = {
  label: string;
  href: string;
};

type Props = {
  title: string;
  links: FooterLink[];
};

export default function FooterLinks({ title, links }: Props) {
  return (
    <div>
      <h4 className="mb-5 text-lg font-semibold text-[var(--heading)]">
        {title}
      </h4>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[var(--text)] transition-colors duration-300 hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
