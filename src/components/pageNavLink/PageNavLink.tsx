import { Link, LinkProps, useMatch, useResolvedPath } from 'react-router-dom';
import { classNameGenerator } from 'utils/pureFunctions';

export const PageNavLink = ({ children, to, ...props }: LinkProps) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  const getTabBtnClasses = (selected: boolean, hidden?: boolean) =>
    classNameGenerator({
      'px-10 py-5 rounded-10': true,
      'bg-white dark:bg-charcoal': selected,
      hidden: hidden,
    });

  return (
    <Link
      to={to}
      {...props}
      className={`flex items-center gap-4 ${getTabBtnClasses(!!match)}`}
    >
      {children}
    </Link>
  );
};
