export interface NavItem {
  label: string;
  href: string;
}

interface NavMenuProps {
  items: NavItem[];
  activeHref: string;
}

export default function NavMenu({ items, activeHref }: NavMenuProps) {
  return (
    <nav className="border-t border-neutral-200" aria-label="Danh mục">
      <ul className="m-0 flex list-none gap-5 overflow-x-auto whitespace-nowrap p-0 lg:justify-center">
        {items.map((item) => {
          const active = item.href === activeHref;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block py-[11px] hover:text-[#f4511e] ${
                  active ? "text-[#f4511e]" : ""
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
