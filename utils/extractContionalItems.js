import { categories } from '../data/staticData';

// Function to extract items from categories based on provided tag(s)
export const extractTagedItems = (tags = []) => {
  // Convert tags to an array if a single string is provided
  const tagArray = Array.isArray(tags) ? tags : [tags];
  const allItems = [];

  // Log the tags being used for filtering
  console.log('Extracting suggested items for tags:', tagArray);

  // Iterate through each main category
  Object.keys(categories).forEach((mainCategory) => {
    const subCategories = categories[mainCategory] || [];
    // Iterate through each subcategory
    subCategories.forEach((subCategory) => {
      const items = subCategory.items || [];
      // Filter items by tag and validate
      items.forEach((item) => {
        if (
          item &&
          typeof item === 'object' &&
          item.id &&
          item.name &&
          item.price &&
          item.image &&
          item.tag &&
          tagArray.includes(item.tag)
        ) {
          allItems.push({
            ...item,
            mainCategory,
            subCategory: subCategory.name,
          });
        } else if (item && item.tag && tagArray.includes(item.tag)) {
          console.warn('Invalid item found for tag', item.tag, ':', item);
        }
      });
    });
  });

  // Remove duplicates based on id
  const uniqueItems = [];
  const seenIds = new Set();
  allItems.forEach((item) => {
    if (!seenIds.has(item.id)) {
      uniqueItems.push(item);
      seenIds.add(item.id);
    } else {
      console.warn('Duplicate item id found:', item.id, item);
    }
  });

  console.log('Extracted suggested items:', uniqueItems.length);
  return uniqueItems;
};