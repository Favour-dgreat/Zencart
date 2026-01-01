"use client";

import { useProductStore } from "@/Store/productStore";

export default function CategorySidebar() {
  const { categories, selectedCategory, filterByCategory } = useProductStore();

  return (
    <aside className="w-64 bg-gray-100 p-4 rounded-lg">
      <h3 className="font-semibold mb-4">Categories</h3>

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => filterByCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}