import Image from "next/image";
import { icons } from "lucide-react"; 
// import * as LucideIcons from "lucide-react";
import Link from "next/link";

// 1. Create a type representing all possible icon names from the library.
export type IconName = keyof typeof icons;

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string; // Either a path or a Lucide icon name
  itemCount?: number; // Number of items in category
}

interface CategoriesProps {
  categories: Category[];
}

const Categories = async ({ categories }: CategoriesProps) => {
  return (
    <section className="py-12 px-4 md:px-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
        {categories.map((category) => {
          const isImage = category.icon.startsWith("/") || category.icon.startsWith(".");
          const LucideIcon = !isImage ? icons[category.icon as IconName]
 : null;

          return (
            <Link 
              href={`/shop/${category.slug}`} 
              key={category.id} 
              className="bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center">
                {isImage && (
                  <Image
                    src={category.icon}
                    width={48}
                    height={48}
                    alt={`${category.name} Icon`}
                    className="object-contain"
                  />
                )}
                {!isImage && LucideIcon && (
                  <LucideIcon className="w-12 h-12 text-gray-700" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{category.name}</p>
                {category.itemCount !== undefined && (
                  <p className="text-xs text-gray-500">{category.itemCount} items</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;