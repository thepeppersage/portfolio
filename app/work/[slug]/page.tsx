import { notFound } from "next/navigation";
import { ProjectPageContent } from "@/components/ProjectPageContent";
import { getProjectBySlug, projects } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectPageContent project={project} />;
}
