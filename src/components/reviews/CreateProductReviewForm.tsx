import { products } from "@wix/stores";
import WixImage from "../common/WixImage";
import { Label } from "../ui/shadcn/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/shadcn/form";
import { useForm } from "react-hook-form";
import {
  CreateProductReviewSchema,
  TCreateProductReviewSchema,
} from "~/server/api/routers/reviews/service/reviews.service.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { Input } from "../ui/shadcn/input";
import { Textarea } from "../ui/shadcn/textarea";
import { Button } from "../ui/shadcn/button";
import { LuAlertCircle, LuLoader2, LuUpload, LuX } from "react-icons/lu";
import StarRatingInput from "./StarRatingInput";
import { toast } from "~/hooks/use-toast";
import { useRef } from "react";
import useMediaUpload, { MediaAttachment } from "~/hooks/useMediaUpload";
import { cn } from "~/lib/utils";

interface CreateProductReviewFormProps {
  product: products.Product;
}

export default function CreateProductReviewForm({
  product,
}: CreateProductReviewFormProps) {
  const form = useForm<TCreateProductReviewSchema>({
    defaultValues: {
      productId: product._id,
      rating: 0,
      title: "",
      body: "",
    },
    resolver: zodResolver(CreateProductReviewSchema),
  });

  const { mutate: createProductReview, isPending } =
    api.reviews.createProductReview.useMutation({
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: err.message || "Please try again later.",
        });
      },
      onSuccess: () => {
        toast({
          title: "Review created!",
          description: "Thank you for your feedback!",
        });
        clearAttachments();
      },
    });

  const { attachments, startUpload, removeAttachment, clearAttachments } =
    useMediaUpload();

  const onSubmit = (values: TCreateProductReviewSchema) => {
    console.log("SUBITTING")
    createProductReview({
      ...values,
      media: attachments
        .filter((attachment) => attachment.url)
        .map((m) => ({
          url: m.url!,
          type: m.file.type.startsWith("image") ? "image" : "video",
        })),
    });
  };

  const uploadInProgress = attachments.some(
    (media) => media.state === "uploading",
  );

  console.log(form.getValues())

  return (
    <div className="w-full space-y-5">
      <div className="w-full space-y-2">
        <Label>Product</Label>
        <div className="flex w-full items-center gap-3">
          <WixImage
            mediaIdentifier={product.media?.mainMedia?.image?.url}
            height={50}
            width={50}
          />
          <span className="font-semibold">{product.name}</span>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <StarRatingInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Review title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell others about your experience..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-5">
            {attachments.map((a, i) => (
              <AttachmentPreview
                key={i}
                attachment={a}
                onRemoveClick={removeAttachment}
              />
            ))}
            <AddMediaButton
              onFileSelected={startUpload}
              disabled={
                attachments.filter((a) => a.state !== "failed").length >= 3
              }
            />
          </div>
          <Button
            type="submit"
            disabled={isPending || uploadInProgress}
            className="w-full"
          >
            {isPending ? (
              <LuLoader2 className="size-5 animate-spin" />
            ) : (
              <span>Submit review</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

interface AddMediaButtonProps {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}

function AddMediaButton({ onFileSelected, disabled }: AddMediaButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant={"ghost"}
        size={"icon"}
        title="Add media"
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <LuUpload className="size-6" />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            if (files[0]) onFileSelected(files[0]);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewProps {
  attachment: MediaAttachment;
  onRemoveClick: (id: string) => void;
}

function AttachmentPreview({
  attachment: { id, state, url, file },
  onRemoveClick,
}: AttachmentPreviewProps) {
  return (
    <div
      className={cn(
        "relative size-fit",
        state === "failed" && "outline-destructive",
      )}
    >
      {file.type.startsWith("image") ? (
        <WixImage
          mediaIdentifier={url}
          scaleToFill={false}
          alt={file.name}
          placeholder={URL.createObjectURL(file)}
          className={cn(
            "max-h-24 max-w-24 rounded-lg object-contain",
            !url && "opacity-50",
          )}
        />
      ) : (
        <video
          controls
          className={cn("max-h-24 max-w-24", !url && "opacity-50")}
        >
          <source src={url || URL.createObjectURL(file)} type={file.type} />
        </video>
      )}
      {state === "uploading" && (
        <div
          title="Uploading media"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center"
        >
          <LuLoader2 className="size-5 animate-spin" />
        </div>
      )}
      {state === "failed" && (
        <div
          title="Failed to upload media"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform items-center justify-center"
        >
          <LuAlertCircle className="size-5 text-destructive" />
        </div>
      )}
      <Button
        size={"icon"}
        variant={"secondary"}
        type="button"
        title="Remove media"
        onClick={() => onRemoveClick(id)}
        className="absolute -right-1.5 -top-1.5 rounded-full !p-2 size-5"
      >
        <LuX />
      </Button>
    </div>
  );
}
