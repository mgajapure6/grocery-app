import { extractItemsByTag, extractMainCategories, extractSubCategories, allCategories } from '../utils/extractContionalItems';

export const addresses = [
  { title: 'Home', address: '123 Main St, City', isDefault: true },
  { title: 'Work', address: '456 Oak Ave, Town', isDefault: false  },
  { title: 'Friend’s Place', address: '789 Pine Rd, Village', isDefault: false },
  { title: 'Other', address: '101 Elm St, Suburb', isDefault: false },
];

export const banner = {
  title: 'Fresh Groceries Delivered Fast!',
  subtitle: 'Shop now and get your essentials in under an hour.',
  image: require('../assets/img/banners/babycare-banner.jpg'),
};

export const tipOptions = [0, 2, 5, 10];

export const initialCart = [];

export const paymentMethods = [
  {
    id: 'pm-1',
    type: 'card',
    details: 'Visa ending in 1234',
    isDefault: true,
    logo: require('../assets/img/visa.png'),
  },
  {
    id: 'pm-2',
    type: 'upi',
    details: 'Google Pay',
    isDefault: false,
    logo: require('../assets/img/gpay.png'),
  },
];

export const coupons = [
  {
    id: 'coupon-1',
    code: 'SAVE5',
    discount: 5.00,
    description: '$5 off on orders above $20',
  },
  {
    id: 'coupon-2',
    code: 'SAVE10',
    discount: 10.00,
    description: '$10 off on orders above $50',
  },
  {
    id: 'coupon-3',
    code: 'FIRSTORDER',
    discount: 7.00,
    description: '$7 off on your first order',
  },
];

export const orders = [
    {
      id: 'ORD-1734567890',
      date: '2025-04-20',
      total: 25.99,
      status: 'Delivered',
      items: [
        {
          id: '1',
          name: 'Margherita Pizza',
          price: 12.99,
          quantity: 1,
          image: require('../assets/img/image-placeholder.png'),
        },
        {
          id: '2',
          name: 'Garlic Bread',
          price: 5.00,
          quantity: 2,
          image: require('../assets/img/image-placeholder.png'),
        },
      ],
      address: {
        title: 'Home',
        address: '123 Main St, City, Country',
      },
      paymentMethod: {
        type: 'Visa',
        last4: '1234',
        logo: require('../assets/img/visa.png'),
      },
    },
    {
      id: 'ORD-1734567891',
      date: '2025-04-18',
      total: 15.49,
      status: 'Cancelled',
      items: [
        {
          id: '3',
          name: 'Veggie Burger',
          price: 7.99,
          quantity: 1,
          image: require('../assets/img/image-placeholder.png'),
        },
        {
          id: '4',
          name: 'French Fries',
          price: 3.50,
          quantity: 2,
          image: require('../assets/img/image-placeholder.png'),
        },
      ],
      address: {
        title: 'Work',
        address: '456 Office Rd, City, Country',
      },
      paymentMethod: {
        type: 'Mastercard',
        last4: '5678',
        logo: require('../assets/img/visa.png'),
      },
    },
  ];

export const suggestedItems = extractItemsByTag('suggested');
export const bestDealItems = extractItemsByTag('best deals');

export const mainCategories = extractMainCategories();
export const subCategories = extractSubCategories();
export const categories = allCategories();
