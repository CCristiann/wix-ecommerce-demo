import { LuStar } from "react-icons/lu";
import { cn } from "~/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function StarRatingInput({
  value,
  onChange,
}: StarRatingInputProps) {
  const ratingsTexts = ["Terrible", "Bad", "Okay", "Good", "Great"];

  return (
    <div className="flex items-center gap-x-2">
      {Array.from({ length: 5 }, (_, i) => (
        <button key={i} onClick={() => onChange(i + 1)} type="button">
          <LuStar
            className={cn(
              "size-6 text-yellow-500",
              i < value && "fill-yellow-500",
            )}
          />
        </button>
      ))}
      <span>{ratingsTexts[value - 1]}</span>
    </div>
  );
}
