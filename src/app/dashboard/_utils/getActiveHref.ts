import { NavItem } from '../_constants/navigation';

export function getActiveHref(
  navItems: NavItem[],
  pathname: string,
): string | null {
  return navItems.reduce<string | null>(
    (best, item) => {
      const matches =
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`);

      if (!matches) {
        return best;
      }

      if (
        !best ||
        item.href.length > best.length
      ) {
        return item.href;
      }

      return best;
    },
    null,
  );
}