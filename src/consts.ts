import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'holywater.dev',
  description:
    'holywater.dev is a blog built with Astro, Tailwind, and shadcn/ui.',
  href: 'https://holywater.dev',
  author: 'holywater',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 3,
  galleryPerPage: 50,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/',
    label: 'home',
  },
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/gallery',
    label: 'gallery',
  },
  {
    href: '/about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://www.linkedin.com/in/dummy-account-485059181/',
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/holywater2372',
    label: 'GitHub',
  },
  {
    href: 'https://discordapp.com/users/593390384785391637',
    label: 'Discord',
  },
  {
    href: 'mailto:h0lywat3rr@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:x',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
  Discord: 'simple-icons:discord',
}
