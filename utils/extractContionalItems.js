//import { categories } from '../data/staticData';
import { categories } from '../data/categoryData';


export const  extractItemsByTag = (tag) => {
  // Initialize an empty array to store matching items
  const matchingItems = [];

  // Check if categories and groceryAndKitchen exist
  if (!categories) {
    return matchingItems;
  }

  Object.keys(categories).forEach((mainCategoryKey) => {
    categories[mainCategoryKey].subcategories.forEach(subcategory => {
      // Check if items exist in the subcategory
      if (subcategory.items && Array.isArray(subcategory.items)) {
        // Filter items that match the specified tag
        const taggedItems = subcategory.items.filter(item => item.tag === tag);
        // Add matching items to the result array
        matchingItems.push(...taggedItems);
      }
    });
  })

  return matchingItems;
}


// Function to extract items from categories based on provided tag(s)
// export const extractTagedItems = (tags = []) => {
//   console.log("extractTagedItems::", tags)
//   // Convert tags to an array if a single string is provided
//   const tagArray = Array.isArray(tags) ? tags : [tags];
//   const allItems = [];

//   // Log the tags being used for filtering
//   console.log('Extracting suggested items for tags:', tagArray);

//   // Iterate through each main category
//   Object.keys(categories).forEach((mainCategory) => {
//     const subCategories = mainCategory.subcategories || [];
//     // Iterate through each subcategory
//     subCategories.forEach((subCategory) => {
//       const items = subCategory.items || [];
//       // Filter items by tag and validate
//       items.forEach((item) => {
//         if (
//           item &&
//           typeof item === 'object' &&
//           item.id &&
//           item.name &&
//           item.price &&
//           item.image &&
//           item.tag &&
//           tagArray.includes(item.tag)
//         ) {
//           allItems.push({
//             ...item,
//             mainCategory.key,
//             subCategory: subCategory.name,
//           });
//         } else if (item && item.tag && tagArray.includes(item.tag)) {
//           console.warn('Invalid item found for tag', item.tag, ':', item);
//         }
//       });
//     });
//   });

//   // Remove duplicates based on id
//   const uniqueItems = [];
//   const seenIds = new Set();
//   allItems.forEach((item) => {
//     if (!seenIds.has(item.id)) {
//       uniqueItems.push(item);
//       seenIds.add(item.id);
//     } else {
//       console.warn('Duplicate item id found:', item.id, item);
//     }
//   });

//   console.log('Extracted suggested items:', uniqueItems.length);
//   return uniqueItems;
// };

export const extractMainCategories = () => {
  const mainCategories = {};
  for (const key in categories) {
    if (categories.hasOwnProperty(key)) {
      const { subcategories, ...mainCategoryDetails } = categories[key];
      mainCategories[key] = mainCategoryDetails;
    }
  }
  return mainCategories;
}

export const extractSubCategories = () => {
  const subCategoriesList = [];
  for (const key in categories) {
    if (categories.hasOwnProperty(key) && categories[key].subcategories) {
      categories[key].subcategories.forEach(subCategory => {
        const { items, ...subCategoryDetails } = subCategory;
        subCategoriesList.push(subCategoryDetails);
      });
    }
  }
  return subCategoriesList;
}

export const allCategories = () => {
  return categories;
}