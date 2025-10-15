// Mock Brands Data
export const brands = [
  {
    id: 1,
    name: "TechVision",
    slug: "techvision",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop",
    description: "Leading innovator in smart technology and consumer electronics",
    story: "Founded in 2010, TechVision has been at the forefront of technological innovation, bringing cutting-edge electronics to millions of customers worldwide. Our mission is to make technology accessible, intuitive, and beautifully designed.",
    heroImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=400&fit=crop",
    founded: 2010,
    productCount: 12,
    categories: ["Electronics", "Smart Devices", "Audio"]
  },
  {
    id: 2,
    name: "UrbanStyle",
    slug: "urbanstyle",
    logo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop",
    description: "Contemporary fashion for the modern urban lifestyle",
    story: "UrbanStyle was born from the streets of New York, capturing the essence of urban culture and contemporary fashion. We believe in sustainable fashion that doesn't compromise on style, creating pieces that resonate with the modern generation.",
    heroImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=400&fit=crop",
    founded: 2015,
    productCount: 8,
    categories: ["Fashion", "Accessories", "Footwear"]
  },
  {
    id: 3,
    name: "HomeHaven",
    slug: "homehaven",
    logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
    description: "Transform your house into a haven with our home essentials",
    story: "HomeHaven is dedicated to making every house feel like home. Since 2012, we've been curating beautiful, functional home goods that blend seamlessly with any lifestyle. From kitchen essentials to decor, we help you create spaces you love.",
    heroImage: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&h=400&fit=crop",
    founded: 2012,
    productCount: 10,
    categories: ["Home & Living", "Kitchen", "Decor"]
  },
  {
    id: 4,
    name: "FitLife",
    slug: "fitlife",
    logo: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop",
    description: "Premium fitness gear for active lifestyles",
    story: "FitLife started with a simple belief: everyone deserves quality fitness equipment that motivates and performs. Our products are designed by athletes, for athletes, whether you're a beginner or a professional. We're here to support your fitness journey every step of the way.",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop",
    founded: 2016,
    productCount: 6,
    categories: ["Sports", "Fitness", "Wellness"]
  },
  {
    id: 5,
    name: "NaturePure",
    slug: "naturepure",
    logo: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200&h=200&fit=crop",
    description: "Organic beauty and wellness products from nature",
    story: "NaturePure believes in the power of nature. Our products are crafted with organic ingredients, free from harmful chemicals, and never tested on animals. Since 2014, we've been committed to bringing you pure, effective beauty and wellness solutions.",
    heroImage: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&h=400&fit=crop",
    founded: 2014,
    productCount: 7,
    categories: ["Beauty", "Skincare", "Wellness"]
  }
];

// Mock Categories
export const categories = [
  { 
    id: 1, 
    name: "Electronics", 
    slug: "electronics", 
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=500&fit=crop",
    tagline: "Cutting-Edge Technology for Modern Living",
    description: "Discover the latest in consumer electronics, from smartphones and laptops to smart home devices and audio equipment. Experience innovation that transforms your daily life.",
    story: "In today's digital age, electronics are more than just gadgets—they're essential tools that connect us, entertain us, and make our lives easier. Our electronics category features the most innovative and reliable products from leading technology brands. Whether you're looking to upgrade your home office, create a smart home ecosystem, or simply stay connected, we have everything you need. From powerful computing devices to immersive audio experiences, each product is carefully selected for quality, performance, and value."
  },
  { 
    id: 2, 
    name: "Fashion", 
    slug: "fashion", 
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=500&fit=crop",
    tagline: "Style That Speaks Your Language",
    description: "Express yourself through fashion. Explore our curated collection of contemporary clothing, accessories, and footwear that blend style, comfort, and quality.",
    story: "Fashion is a form of self-expression, a way to tell your story without words. Our fashion category celebrates individuality and style, offering a diverse range of clothing and accessories for every occasion. From timeless classics to the latest trends, we curate pieces that empower you to look and feel your best. Quality craftsmanship, sustainable materials, and modern designs come together to create a shopping experience that's as enjoyable as the clothes themselves. Whether you're dressing for work, weekend adventures, or special occasions, find pieces that reflect your unique personality."
  },
  { 
    id: 3, 
    name: "Home & Living", 
    slug: "home-living", 
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&h=500&fit=crop",
    tagline: "Create Spaces You'll Love to Live In",
    description: "Transform your house into a haven with our carefully selected home essentials, decor, and furnishings. Quality meets aesthetics in every piece.",
    story: "Your home is your sanctuary, and every detail matters. Our Home & Living category offers everything you need to create beautiful, functional spaces that reflect your style and enhance your daily life. From kitchen essentials that make cooking a joy to decor pieces that add personality to your rooms, we've curated products that combine form and function. Whether you're moving into a new place, refreshing your current space, or looking for that perfect accent piece, our collection helps you create a home that's uniquely yours. Quality materials, thoughtful design, and practical functionality in every product."
  },
  { 
    id: 4, 
    name: "Sports & Fitness", 
    slug: "sports-fitness", 
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=500&fit=crop",
    tagline: "Fuel Your Active Lifestyle",
    description: "Achieve your fitness goals with premium sports equipment and activewear. Performance, comfort, and durability in every product.",
    story: "Fitness is a journey, not a destination, and having the right equipment makes all the difference. Our Sports & Fitness category is designed for those who take their health and wellness seriously. Whether you're a seasoned athlete, a weekend warrior, or just beginning your fitness journey, we provide the tools you need to succeed. From yoga mats and resistance bands to advanced training equipment, every product is selected for quality, durability, and performance. Train smarter, not harder, with gear that supports your goals and motivates you to push your limits. Your body is your most important asset—invest in it wisely."
  },
  { 
    id: 5, 
    name: "Beauty & Wellness", 
    slug: "beauty-wellness", 
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&h=500&fit=crop",
    tagline: "Natural Beauty, Inside and Out",
    description: "Nurture yourself with our organic beauty and wellness products. Pure ingredients, effective results, and ethical practices in every bottle.",
    story: "True beauty comes from taking care of yourself, inside and out. Our Beauty & Wellness category celebrates natural, effective products that enhance your natural radiance without compromise. We believe in the power of pure, organic ingredients and ethical beauty practices. Every product in our collection is carefully vetted for safety, efficacy, and sustainability. From skincare that nourishes your complexion to wellness products that support your overall health, we offer solutions that work with your body, not against it. Discover beauty products that are as good for you as they are for the planet. Self-care isn't selfish—it's essential."
  }
];

// Mock Products
export const products = [
  // TechVision Products
  {
    id: 1,
    name: "Wireless Pro Headphones",
    slug: "wireless-pro-headphones",
    brandId: 1,
    brandName: "TechVision",
    categoryId: 1,
    categoryName: "Electronics",
    price: 24999,
    originalPrice: 29999,
    discount: 17,
    rating: 4.8,
    reviewCount: 256,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop"
    ],
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.",
    features: ["Active Noise Cancellation", "30-hour Battery", "Premium Sound Quality", "Comfortable Design"],
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: 2,
    name: "Smart Watch Series X",
    slug: "smart-watch-series-x",
    brandId: 1,
    brandName: "TechVision",
    categoryId: 1,
    categoryName: "Electronics",
    price: 32999,
    originalPrice: 37999,
    discount: 13,
    rating: 4.7,
    reviewCount: 189,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop"
    ],
    description: "Advanced smartwatch with health tracking, fitness monitoring, and seamless connectivity. Stay connected and healthy with Series X.",
    features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-day Battery"],
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: 3,
    name: "Bluetooth Speaker Max",
    slug: "bluetooth-speaker-max",
    brandId: 1,
    brandName: "TechVision",
    categoryId: 1,
    categoryName: "Electronics",
    price: 12499,
    originalPrice: null,
    discount: 0,
    rating: 4.6,
    reviewCount: 342,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&h=600&fit=crop"
    ],
    description: "Portable Bluetooth speaker with 360-degree sound, waterproof design, and 20-hour playtime. Perfect for outdoor adventures.",
    features: ["360° Sound", "Waterproof IPX7", "20-hour Battery", "USB-C Charging"],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 4,
    name: "4K Ultra HD Camera",
    slug: "4k-ultra-hd-camera",
    brandId: 1,
    brandName: "TechVision",
    categoryId: 1,
    categoryName: "Electronics",
    price: 74999,
    originalPrice: 89999,
    discount: 17,
    rating: 4.9,
    reviewCount: 127,
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop"
    ],
    description: "Professional 4K camera with advanced stabilization, perfect for content creators and videographers.",
    features: ["4K 60fps", "Image Stabilization", "Touch Screen", "WiFi Connectivity"],
    inStock: true,
    isNew: true,
    isFeatured: false
  },
  
  // UrbanStyle Products
  {
    id: 5,
    name: "Classic Denim Jacket",
    slug: "classic-denim-jacket",
    brandId: 2,
    brandName: "UrbanStyle",
    categoryId: 2,
    categoryName: "Fashion",
    price: 7499,
    originalPrice: 9999,
    discount: 25,
    rating: 4.5,
    reviewCount: 198,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop"
    ],
    description: "Timeless denim jacket with a modern fit. Made from premium cotton denim for lasting comfort and style.",
    features: ["Premium Denim", "Classic Fit", "Multiple Pockets", "Versatile Style"],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 6,
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    brandId: 2,
    brandName: "UrbanStyle",
    categoryId: 2,
    categoryName: "Fashion",
    price: 10999,
    originalPrice: null,
    discount: 0,
    rating: 4.7,
    reviewCount: 234,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop"
    ],
    description: "Elegant leather crossbody bag perfect for everyday use. Features multiple compartments and adjustable strap.",
    features: ["Genuine Leather", "Adjustable Strap", "Multiple Compartments", "Designer Quality"],
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: 7,
    name: "Urban Sneakers",
    slug: "urban-sneakers",
    brandId: 2,
    brandName: "UrbanStyle",
    categoryId: 2,
    categoryName: "Fashion",
    price: 6499,
    originalPrice: 7999,
    discount: 19,
    rating: 4.4,
    reviewCount: 412,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop"
    ],
    description: "Comfortable and stylish sneakers for everyday wear. Premium materials and cushioned sole for all-day comfort.",
    features: ["Breathable Material", "Cushioned Sole", "Durable Design", "Modern Style"],
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  {
    id: 8,
    name: "Minimalist Watch",
    slug: "minimalist-watch",
    brandId: 2,
    brandName: "UrbanStyle",
    categoryId: 2,
    categoryName: "Fashion",
    price: 13499,
    originalPrice: null,
    discount: 0,
    rating: 4.8,
    reviewCount: 156,
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop"
    ],
    description: "Sleek minimalist watch with Japanese movement. Perfect accessory for any outfit.",
    features: ["Japanese Movement", "Leather Strap", "Water Resistant", "Minimalist Design"],
    inStock: true,
    isNew: true,
    isFeatured: false
  },
  
  // HomeHaven Products
  {
    id: 9,
    name: "Ceramic Dinner Set",
    slug: "ceramic-dinner-set",
    brandId: 3,
    brandName: "HomeHaven",
    categoryId: 3,
    categoryName: "Home & Living",
    price: 12499,
    originalPrice: 16999,
    discount: 26,
    rating: 4.6,
    reviewCount: 289,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=600&fit=crop"
    ],
    description: "Beautiful 16-piece ceramic dinner set. Microwave and dishwasher safe. Perfect for modern homes.",
    features: ["16-Piece Set", "Dishwasher Safe", "Modern Design", "Chip Resistant"],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 10,
    name: "Scented Candle Collection",
    slug: "scented-candle-collection",
    brandId: 3,
    brandName: "HomeHaven",
    categoryId: 3,
    categoryName: "Home & Living",
    price: 4199,
    originalPrice: null,
    discount: 0,
    rating: 4.7,
    reviewCount: 523,
    images: [
      "https://images.unsplash.com/photo-1602874801006-926d8e2ddc88?w=600&h=600&fit=crop"
    ],
    description: "Set of 3 luxury scented candles with natural soy wax. Creates a warm and inviting atmosphere.",
    features: ["Natural Soy Wax", "Long Burning", "3 Unique Scents", "Eco-Friendly"],
    inStock: true,
    isNew: true,
    isFeatured: false
  },
  {
    id: 11,
    name: "Cotton Bedding Set",
    slug: "cotton-bedding-set",
    brandId: 3,
    brandName: "HomeHaven",
    categoryId: 3,
    categoryName: "Home & Living",
    price: 9999,
    originalPrice: 12999,
    discount: 23,
    rating: 4.8,
    reviewCount: 367,
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=600&fit=crop"
    ],
    description: "Luxurious 100% cotton bedding set. Soft, breathable, and perfect for a good night's sleep.",
    features: ["100% Cotton", "Queen Size", "Machine Washable", "Breathable Fabric"],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 12,
    name: "Modern Table Lamp",
    slug: "modern-table-lamp",
    brandId: 3,
    brandName: "HomeHaven",
    categoryId: 3,
    categoryName: "Home & Living",
    price: 6699,
    originalPrice: null,
    discount: 0,
    rating: 4.5,
    reviewCount: 178,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop"
    ],
    description: "Elegant modern table lamp with adjustable brightness. Perfect for reading or ambient lighting.",
    features: ["Adjustable Brightness", "Modern Design", "Energy Efficient LED", "Touch Control"],
    inStock: true,
    isNew: true,
    isFeatured: false
  },
  
  // FitLife Products
  {
    id: 13,
    name: "Yoga Mat Pro",
    slug: "yoga-mat-pro",
    brandId: 4,
    brandName: "FitLife",
    categoryId: 4,
    categoryName: "Sports & Fitness",
    price: 3999,
    originalPrice: 5499,
    discount: 27,
    rating: 4.7,
    reviewCount: 445,
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop"
    ],
    description: "Premium yoga mat with superior grip and cushioning. Non-slip and eco-friendly materials.",
    features: ["Non-Slip Surface", "6mm Thickness", "Eco-Friendly", "Carrying Strap Included"],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 14,
    name: "Adjustable Dumbbell Set",
    slug: "adjustable-dumbbell-set",
    brandId: 4,
    brandName: "FitLife",
    categoryId: 4,
    categoryName: "Sports & Fitness",
    price: 24999,
    originalPrice: 32999,
    discount: 24,
    rating: 4.9,
    reviewCount: 312,
    images: [
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop"
    ],
    description: "Space-saving adjustable dumbbells. Replaces 15 sets of weights. Perfect for home workouts.",
    features: ["5-52.5 lbs Range", "Space Saving", "Quick Adjustment", "Durable Construction"],
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: 15,
    name: "Resistance Bands Set",
    slug: "resistance-bands-set",
    brandId: 4,
    brandName: "FitLife",
    categoryId: 4,
    categoryName: "Sports & Fitness",
    price: 2499,
    originalPrice: null,
    discount: 0,
    rating: 4.6,
    reviewCount: 567,
    images: [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop"
    ],
    description: "Set of 5 resistance bands with different resistance levels. Perfect for strength training and stretching.",
    features: ["5 Resistance Levels", "Durable Latex", "Portable", "Exercise Guide Included"],
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  
  // NaturePure Products
  {
    id: 16,
    name: "Organic Face Serum",
    slug: "organic-face-serum",
    brandId: 5,
    brandName: "NaturePure",
    categoryId: 5,
    categoryName: "Beauty & Wellness",
    price: 3299,
    originalPrice: 3999,
    discount: 18,
    rating: 4.8,
    reviewCount: 678,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop"
    ],
    description: "Organic face serum with vitamin C and hyaluronic acid. Brightens and hydrates skin naturally.",
    features: ["100% Organic", "Vitamin C", "Hyaluronic Acid", "Cruelty-Free"],
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: 17,
    name: "Natural Body Lotion",
    slug: "natural-body-lotion",
    brandId: 5,
    brandName: "NaturePure",
    categoryId: 5,
    categoryName: "Beauty & Wellness",
    price: 2099,
    originalPrice: null,
    discount: 0,
    rating: 4.7,
    reviewCount: 523,
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop"
    ],
    description: "Nourishing body lotion with shea butter and natural oils. Deep hydration without chemicals.",
    features: ["Shea Butter", "Natural Oils", "Quick Absorption", "Paraben-Free"],
    inStock: true,
    isNew: false,
    isFeatured: true
  },
  {
    id: 18,
    name: "Herbal Hair Oil",
    slug: "herbal-hair-oil",
    brandId: 5,
    brandName: "NaturePure",
    categoryId: 5,
    categoryName: "Beauty & Wellness",
    price: 1699,
    originalPrice: 2299,
    discount: 26,
    rating: 4.6,
    reviewCount: 412,
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop"
    ],
    description: "Herbal hair oil blend for strong, healthy hair. Made with coconut, argan, and essential oils.",
    features: ["Natural Ingredients", "Strengthens Hair", "Promotes Growth", "Pleasant Scent"],
    inStock: true,
    isNew: false,
    isFeatured: false
  },
  {
    id: 19,
    name: "Organic Lip Balm Set",
    slug: "organic-lip-balm-set",
    brandId: 5,
    brandName: "NaturePure",
    categoryId: 5,
    categoryName: "Beauty & Wellness",
    price: 1249,
    originalPrice: null,
    discount: 0,
    rating: 4.5,
    reviewCount: 289,
    images: [
      "https://images.unsplash.com/photo-1589666564459-93cdd3ab856a?w=600&h=600&fit=crop"
    ],
    description: "Set of 3 organic lip balms with beeswax and natural oils. Keep your lips soft and moisturized.",
    features: ["100% Natural", "Beeswax Base", "3 Flavors", "Long Lasting"],
    inStock: true,
    isNew: true,
    isFeatured: false
  }
];

// Mock Users
export const users = [
  {
    id: 1,
    email: "demo@example.com",
    password: "demo123",
    firstName: "Demo",
    lastName: "User",
    phone: "+1234567890",
    addresses: [
      {
        id: 1,
        type: "home",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        isDefault: true
      }
    ]
  }
];

// Mock Orders
export const orders = [
  {
    id: "ORD-2024-001",
    userId: 1,
    date: "2024-10-10",
    status: "delivered",
    items: [
      {
        productId: 1,
        name: "Wireless Pro Headphones",
        quantity: 1,
        price: 299.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
      }
    ],
    subtotal: 299.99,
    shipping: 10.00,
    tax: 29.50,
    total: 339.49,
    shippingAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    }
  },
  {
    id: "ORD-2024-002",
    userId: 1,
    date: "2024-10-08",
    status: "shipped",
    items: [
      {
        productId: 6,
        name: "Leather Crossbody Bag",
        quantity: 1,
        price: 129.99,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&h=200&fit=crop"
      },
      {
        productId: 16,
        name: "Organic Face Serum",
        quantity: 2,
        price: 39.99,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop"
      }
    ],
    subtotal: 209.97,
    shipping: 10.00,
    tax: 21.00,
    total: 240.97,
    shippingAddress: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    }
  }
];

// Mock Reviews
export const reviews = [
  {
    id: 1,
    productId: 1,
    userId: 1,
    userName: "John Doe",
    rating: 5,
    title: "Amazing sound quality!",
    comment: "These headphones are incredible. The noise cancellation is top-notch and battery life is exactly as advertised.",
    date: "2024-10-05",
    helpful: 24
  },
  {
    id: 2,
    productId: 1,
    userId: 2,
    userName: "Jane Smith",
    rating: 4,
    title: "Great but pricey",
    comment: "Love the sound quality and comfort, but wish they were a bit more affordable.",
    date: "2024-10-03",
    helpful: 15
  }
];

// Helper Functions
export const getProductById = (id) => products.find(p => p.id === parseInt(id));
export const getProductsByBrand = (brandSlug) => {
  const brand = brands.find(b => b.slug === brandSlug);
  return brand ? products.filter(p => p.brandId === brand.id) : [];
};
export const getProductsByCategory = (categorySlug) => {
  const category = categories.find(c => c.slug === categorySlug);
  return category ? products.filter(p => p.categoryId === category.id) : [];
};
export const getBrandBySlug = (slug) => brands.find(b => b.slug === slug);
export const getCategoryBySlug = (slug) => categories.find(c => c.slug === slug);
export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getNewProducts = () => products.filter(p => p.isNew);
export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.brandName.toLowerCase().includes(lowerQuery)
  );
};

