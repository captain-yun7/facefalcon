'use client';

interface BlogPostingSchemaProps {
  headline: string;
  description: string;
  author: string;
  datePublished: string; // ISO 8601 format
  dateModified?: string; // ISO 8601 format
  image?: string;
  keywords?: string[];
  articleSection?: string;
}

export default function BlogPostingSchema({
  headline,
  description,
  author,
  datePublished,
  dateModified,
  image,
  keywords,
  articleSection,
}: BlogPostingSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com';

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': headline,
    'description': description,
    'author': {
      '@type': 'Person',
      'name': author,
    },
    'datePublished': datePublished,
    ...(dateModified && { 'dateModified': dateModified }),
    ...(image && {
      'image': {
        '@type': 'ImageObject',
        'url': `${baseUrl}${image}`,
      },
    }),
    ...(keywords && keywords.length > 0 && { 'keywords': keywords.join(', ') }),
    ...(articleSection && { 'articleSection': articleSection }),
    'publisher': {
      '@type': 'Organization',
      'name': 'FaceFalcon',
      'logo': {
        '@type': 'ImageObject',
        'url': `${baseUrl}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
    />
  );
}
