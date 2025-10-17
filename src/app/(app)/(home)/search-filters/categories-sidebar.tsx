import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Chevron } from "react-day-picker";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoriesSidebar = ({ open, onOpenChange}: Props) => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.categories.getMany.queryOptions());

  const router = useRouter();

  const [parentCategories, setParentCategories] = useState<
    CategoriesGetManyOutput | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesGetManyOutput[1] | null>(null);

  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        const fullPath = `/${selectedCategory.slug}/${category.slug}`;
        router.push(fullPath);
      } else {
        if (category.slug === "all") {
          router.push(`/`);
        } else {
          router.push(`/${category.slug}`);
        }
        handleOpenChange(false);
      }
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  const backgroungColor = selectedCategory?.color || "bg-white";

  return (
    <div>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="left"
          className="p-0 transition-none"
          style={{ backgroundColor: backgroungColor }}
        >
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Categories</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
            {parentCategories && (
              <button
                className="w-full text-left flex items-center p-4  text-base font-medium hover:bg-black hover:text-white cursor-pointer"
                onClick={() => {
                  handleBackClick();
                }}
              >
                <Chevron className="size-4 mr-2" />
                Back
              </button>
            )}
            {currentCategories.map((category) => (
              <button
                key={category.slug}
                className="w-full text-left flex justify-between items-center p-4  text-base font-medium hover:bg-black hover:text-white cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <ChevronRightIcon className="size-4" />
                  )}
              </button>
            ))}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};
