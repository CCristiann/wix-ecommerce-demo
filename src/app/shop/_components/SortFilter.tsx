import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/components/ui/shadcn/select";

interface SortFilterProps {
  sort: string | undefined;
  updateSort: (value: string) => void;
}
export default function SortFilter({ sort, updateSort }: SortFilterProps) {
  return (
    <Select value={sort || "last_updated"} onValueChange={updateSort}>
      <SelectTrigger className="w-fit gap-2 text-start">
        <span>
          Sort by: <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="last_updated">Newest</SelectItem>
        <SelectItem value="price_asc">Price (Low to high)</SelectItem>
        <SelectItem value="price_desc">Price (High to low)</SelectItem>
      </SelectContent>
    </Select>
  );
}
