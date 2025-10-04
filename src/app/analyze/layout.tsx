// Metadata is now handled dynamically in page.tsx based on query parameters

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
