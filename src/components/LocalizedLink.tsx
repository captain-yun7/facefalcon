'use client';

import Link from 'next/link';
import { useTranslations } from '@/components/TranslationsProvider';
import type { ComponentProps } from 'react';

type LocalizedLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

export default function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const { locale } = useTranslations();

  // If href already starts with a locale, don't add it again
  if (href.startsWith('/ko/') || href.startsWith('/en/')) {
    return <Link href={href} {...props} />;
  }

  // Add locale prefix
  const localizedHref = `/${locale}${href}`;

  return <Link href={localizedHref} {...props} />;
}
