import { CurriculumContent } from "@/app/settings/[[...slug]]/page";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export { generateStaticParams } from "@/app/settings/[[...slug]]/page";

export default CurriculumContent;
