import { TableSkeleton } from "@/components/shared/skeletons";
export default function Loading() {
  return <TableSkeleton rows={5} columns={6} />;
}