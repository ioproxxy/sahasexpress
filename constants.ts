import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Smart Noise-Cancelling Headphones',
    category: 'Gadgets',
    price: 249.99,
    stock: 15,
    imageUrl: 'https://picsum.photos/seed/headphones/400/400',
    description: 'Immerse yourself in pure sound with our AI-powered noise-cancelling headphones. All-day comfort and crystal-clear calls.',
    specifications: {
      'Connectivity': 'Bluetooth 5.2, AUX',
      'Battery Life': 'Up to 30 hours',
      'Weight': '254g',
      'Driver Size': '40mm',
    },
    reviews: [
      { author: 'Alex', rating: 5, comment: 'Absolutely amazing sound quality! The noise cancelling is top-notch.' },
      { author: 'Maria', rating: 4, comment: 'Very comfortable and great for long flights, but the app could be better.' },
    ]
  },
  {
    id: 2,
    name: 'Urban Explorer Jacket',
    category: 'Fashion',
    price: 129.50,
    stock: 30, // Total stock is now sum of variants
    imageUrl: 'https://picsum.photos/seed/jacket/400/400',
    description: 'A stylish and waterproof jacket designed for the modern adventurer. Breathable fabric with multiple utility pockets.',
    specifications: {
      'Material': 'Gore-Tex Shell, Fleece Lining',
      'Water Resistance': '10,000mm',
      'Pockets': '5 external, 2 internal',
    },
    reviews: [
        { author: 'Sam', rating: 5, comment: 'Perfect fit and truly waterproof. Looks great too!' }
    ],
    variantOptions: [
      { name: 'Size', values: ['M', 'L', 'XL'] },
      { name: 'Color', values: ['Black', 'Navy'] }
    ],
    variants: [
      { id: '2-size-M_color-Black', options: { Size: 'M', Color: 'Black' }, stock: 10 },
      { id: '2-size-M_color-Navy', options: { Size: 'M', Color: 'Navy' }, stock: 5 },
      { id: '2-size-L_color-Black', options: { Size: 'L', Color: 'Black' }, stock: 8 },
      { id: '2-size-L_color-Navy', options: { Size: 'L', Color: 'Navy' }, stock: 7 },
      { id: '2-size-XL_color-Black', options: { Size: 'XL', Color: 'Black' }, stock: 0 },
      { id: '2-size-XL_color-Navy', options: { Size: 'XL', Color: 'Navy' }, stock: 0 }
    ]
  },
  {
    id: 3,
    name: 'Portable 4K Projector',
    category: 'Tech Tools',
    price: 499.00,
    stock: 8,
    imageUrl: 'https://picsum.photos/seed/projector/400/400',
    description: 'Transform any space into a cinema with this compact 4K projector. Features auto-focus and built-in streaming apps.',
    specifications: {
        'Resolution': '3840 x 2160 (4K)',
        'Brightness': '1500 ANSI Lumens',
        'Dimensions': '15cm x 15cm x 5cm',
        'Connectivity': 'HDMI, USB-C, Wi-Fi 6',
    },
    reviews: []
  },
  {
    id: 4,
    name: 'Minimalist Chrono Watch',
    category: 'Fashion',
    price: 199.99,
    stock: 22,
    imageUrl: 'https://picsum.photos/seed/watch/400/400',
    description: 'A sleek and sophisticated timepiece with a genuine leather strap and sapphire crystal glass. Water-resistant up to 50m.',
    specifications: {
        'Case Size': '42mm',
        'Material': 'Stainless Steel, Leather',
        'Crystal': 'Sapphire',
        'Water Resistance': '5 ATM (50 meters)',
    },
    reviews: [
        { author: 'Chloe', rating: 5, comment: 'Elegant and timeless. I get compliments on it all the time.' },
        { author: 'Ben', rating: 4, comment: 'Love the design. The strap took a few days to break in.' }
    ]
  },
    {
    id: 5,
    name: 'Ergonomic Mechanical Keyboard',
    category: 'Tech Tools',
    price: 159.00,
    stock: 12,
    imageUrl: 'https://picsum.photos/seed/keyboard/400/400',
    description: 'Experience superior typing with our customizable mechanical keyboard. Features hot-swappable switches and RGB backlighting.',
    specifications: {
        'Switch Type': 'Brown Mechanical (Tactile)',
        'Layout': '75% Compact',
        'Connectivity': 'USB-C, Bluetooth 5.1',
        'Dimensions': '31.5cm x 12.5cm x 4cm',
    },
    reviews: [
        { author: 'DevUser', rating: 5, comment: 'The best keyboard I have ever owned. Typing is a dream.' }
    ]
  },
  {
    id: 6,
    name: 'Wireless Charging Dock',
    category: 'Gadgets',
    price: 59.99,
    stock: 50,
    imageUrl: 'https://picsum.photos/seed/charger/400/400',
    description: 'Power up your phone, watch, and earbuds simultaneously with this elegant 3-in-1 wireless charging station.',
    specifications: {
        'Phone Output': '15W Max',
        'Watch Output': '5W',
        'Earbuds Output': '5W',
        'Dimensions': '18cm x 9cm x 2cm',
    },
    reviews: []
  },
  {
    id: 7,
    name: 'Canvas Utility Backpack',
    category: 'Fashion',
    price: 89.99,
    stock: 40,
    imageUrl: 'https://picsum.photos/seed/backpack/400/400',
    description: 'Durable and spacious, this backpack is perfect for work or travel. Includes a padded laptop sleeve and anti-theft pocket.',
    specifications: {
        'Capacity': '25 Liters',
        'Material': 'Waxed Canvas, Leather accents',
        'Laptop Sleeve': 'Fits up to 15-inch laptop',
        'Dimensions': '45cm x 30cm x 15cm',
    },
    reviews: [
        { author: 'TravelerTom', rating: 5, comment: 'Holds everything I need for a weekend trip. Very sturdy.' },
        { author: 'StudentLife', rating: 4, comment: 'Great backpack, lots of pockets. Wish it had a water bottle holder on the side.' }
    ]
  },
  {
    id: 8,
    name: 'Smart WiFi Power Strip',
    category: 'Tech Tools',
    price: 34.95,
    stock: 100,
    imageUrl: 'https://picsum.photos/seed/powerstrip/400/400',
    description: 'Control your devices from anywhere with this smart power strip. Compatible with Alexa and Google Assistant.',
    specifications: {
        'Outlets': '4 AC, 3 USB-A',
        'Cord Length': '1.8 meters',
        'Wi-Fi': '2.4GHz only',
        'Max Load': '10A',
    },
    reviews: []
  }
];

export const MOCK_SALES_DATA = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];