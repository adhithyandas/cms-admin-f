import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => <Iconify icon={name as any} width={24} height={24} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Blog',
    path: '/blog',
    icon: icon('solar:document-text-bold-duotone'),
  },
  {
    title: 'Courses',
    path: '/courses',
    icon: icon('solar:notebook-bold-duotone'),
  },
  {
    title: 'Gallery',
    path: '/gallery',
    icon: icon('solar:gallery-bold-duotone'),
  },
];
