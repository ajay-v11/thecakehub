import React from 'react';

const CategoryNav = ({
  categories,
  onCategoryClick,
}: {
  categories: string[];
  onCategoryClick: (category: string) => void;
}) => {
  return (
    <div className='flex gap-2 overflow-x-auto'>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryClick(category)}
          className='px-4 py-2 rounded-full border-1 border-purple-800 
                      text-purple-800 hover:bg-purple-300 font-medium 
                      whitespace-nowrap transition-colors duration-200 bg-purple-100 hover:text-purple-900 hover:scale-90'>
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
