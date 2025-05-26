import Image from "next/image";

  // 1. Define the Category type (Good Practice)
interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string; // Assuming this is a path like /icons/clothing.svg
}

// 2. Define the Props interface
interface CategoriesProps {
  categories: Category[];
}

const Categories = async ({categories}: CategoriesProps) => {

  return (
    <section className="py-10 px-4 md:px-10 grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
      {categories.map((category) => (
        <div key={category.id} className="space-y-2">
          <div className="w-12 h-12 bg-gray-200 mx-auto rounded-full flex items-center justify-center">
            {category.icon && <Image src={category.icon} fill  alt={`${category.name} Icon`} className="w-8 h-8 object-contain" />}
          </div>
          <p className="text-sm">{category.name}</p>
        </div>
      ))}
    </section>
  );
};

export default Categories;