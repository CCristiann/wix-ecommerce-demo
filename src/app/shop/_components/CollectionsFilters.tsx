import { collections } from "@wix/stores";
import { Button } from "~/components/ui/shadcn/button";
import { Checkbox } from "~/components/ui/shadcn/checkbox";
import { Label } from "~/components/ui/shadcn/label";

interface CollectionsFiltersProps {
  collections: collections.Collection[];
  selectedCollectionIds: string[];
  updateCollectionIds: (collectionIds: string[]) => void;
}

export default function CollectionsFilters({
  collections,
  selectedCollectionIds,
  updateCollectionIds,
}: CollectionsFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="font-bold">Collections</div>
      <ul className="space-y-1.5">
        {collections.map((c, i) => {
          const collectionId = c._id;
          if (!collectionId) return null;

          return (
            <li key={i}>
              <Label className="flex items-center gap-2">
                <Checkbox
                  id={collectionId}
                  checked={selectedCollectionIds.includes(collectionId)}
                  onCheckedChange={(checked) => {
                    updateCollectionIds(
                      checked
                        ? [...selectedCollectionIds, collectionId]
                        : selectedCollectionIds.filter(
                            (id) => id !== collectionId
                          )
                    );
                  }}
                />
                <span className="line-clamp-1 break-all">{c.name}</span>
              </Label>
            </li>
          );
        })}
      </ul>
      {selectedCollectionIds.length > 0 && (
        <Button
          variant={"outline"}
          size={"xs"}
          onClick={() => updateCollectionIds([])}
        >
          Clear
        </Button>
      )}
    </div>
  );
}
