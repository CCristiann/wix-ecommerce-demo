import { products } from "@wix/stores";
import { Input } from "~/components/ui/shadcn/input";
import { Label } from "~/components/ui/shadcn/label";
import { checkInStock } from "~/lib/checkInStock";
import { cn } from "~/lib/utils";

interface ProductOptionsProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (options: Record<string, string>) => void;
}

export default function ProductOptions({
  product,
  selectedOptions,
  setSelectedOptions,
}: ProductOptionsProps) {
  return (
    <div className="space-y-2.5">
      {product.productOptions?.map((option, i) => (
        <fieldset key={i} className="space-y-1.5">
          <legend>
            <Label asChild>
              <span>{option.name}</span>
            </Label>
          </legend>
          <div className="flex flex-wrap items-center gap-1">
            {option.choices?.map((choice) => (
              <div key={i}>
                <Input
                  type="radio"
                  id={choice.description}
                  name={option.name}
                  checked={selectedOptions[option.name || ""] === choice.description}
                  onChange={() =>
                    setSelectedOptions({
                      ...selectedOptions,
                      [option.name || ""]: choice.description || "",
                    })
                  }
                  value={choice.description}
                  className="peer hidden"
                />
                <Label
                  htmlFor={choice.description}
                  className={cn(
                    "flex items-center justify-center min-w-14 rounded-lg cursor-pointer gap-1.5 border p-2 border-input/50 peer-checked:bg-accent peer-checked:border-foreground/30 transition",
                    !checkInStock(product, {
                        ...selectedOptions,
                        [option.name || ""]: choice.description || "",
                    }) && "opacity-50"
                )}
                >
                  {option.optionType === products.OptionType.color && (
                    <span
                      className="size-4 rounded-full border border-input/50"
                      style={{ backgroundColor: choice.value }}
                    />
                  )}
                  {choice.description}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
