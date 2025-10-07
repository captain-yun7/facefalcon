'use client';

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration format (e.g., "PT10M" for 10 minutes)
  image?: string;
}

export default function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  image,
}: HowToSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://facefalcon.com';

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': name,
    'description': description,
    ...(totalTime && { 'totalTime': totalTime }),
    ...(image && { 'image': `${baseUrl}${image}` }),
    'step': steps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.name,
      'text': step.text,
      ...(step.image && { 'image': `${baseUrl}${step.image}` }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
    />
  );
}
