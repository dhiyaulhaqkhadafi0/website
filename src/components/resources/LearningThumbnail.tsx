import { BookOpen, CheckCheck, Code2, Compass, Layers3, Lightbulb, Megaphone, Play, Workflow } from "lucide-react";
import type { LearningResource } from "@/content/learning-resources";
import s from "./learning-library.module.css";

export function LearningThumbnail({ resource }: { resource: LearningResource }) {
  const Icon = resource.format === "checklist" ? CheckCheck : resource.format === "video" || resource.format === "course" ? Play : resource.category === "ai" ? Workflow : resource.category === "product" ? Code2 : resource.category === "marketing" ? Megaphone : Compass;
  return <div className={s.thumbnail} data-tone={resource.category} data-format={resource.format} aria-hidden="true">
    <span className={s.thumbnailIndex}>{resource.provider} / {resource.id.replace("learning-", "")}</span>
    <div className={s.thumbnailCanvas}>
      <div className={s.thumbnailSheet}><span><Icon size={20} /> {resource.format === "checklist" ? "READY TO BUILD" : resource.format === "template" ? "YOUR NEXT IDEA" : "LEARNING NOTES"}</span><i /><i /><i /><div><Lightbulb size={15} /><span>→</span><Layers3 size={15} /><span>→</span><BookOpen size={15} /></div></div>
      <div className={s.thumbnailStamp}><Icon size={32} strokeWidth={1.2} /></div>
    </div>
    <span className={s.thumbnailCaption}>{resource.title}</span>
  </div>;
}
