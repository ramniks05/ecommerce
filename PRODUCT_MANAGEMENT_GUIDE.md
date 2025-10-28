# Product Management Guide

## How to Add Products in the Admin Panel

This guide will walk you through the complete process of adding products to your e-commerce store using the admin panel.

### Table of Contents
1. [Accessing Product Management](#accessing-product-management)
2. [Adding a New Product](#adding-a-new-product)
3. [Product Form Fields](#product-form-fields)
4. [Image Management](#image-management)
5. [Product Attributes](#product-attributes)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Accessing Product Management

1. **Login to Admin Panel**
   - Navigate to `/admin/login`
   - Enter your admin credentials
   - Click "Login"

2. **Navigate to Products**
   - In the admin sidebar, click on "Products"
   - You'll see the product management dashboard

---

## Adding a New Product

### Step 1: Open Add Product Form
1. Click the **"Add Product"** button (blue button with + icon)
2. The product form modal will open

### Step 2: Fill Basic Information

#### Required Fields
- **Product Name** * - Enter the product title
- **Slug** * - Auto-generated from name (editable)
- **Brand** * - Select from dropdown
- **Category** * - Select from dropdown (supports subcategories)
- **Price** * - Enter selling price

#### Optional Basic Fields
- **Original Price** - For showing discounts
- **Cost Price** - Internal cost tracking
- **SKU** - Product identification code
- **Weight** - Product weight in kg

### Step 3: Configure Pricing & Inventory

#### Pricing Section
- **Price** - Main selling price (required)
- **Original Price** - Original price before discount
- **Cost Price** - Internal cost for profit calculation
- **Discount Percentage** - 0-100% discount amount

#### Stock Management
- **Stock Quantity** - Available inventory
- **Min Stock Level** - Alert threshold (default: 5)

### Step 4: Set Physical Properties

#### Dimensions (in cm)
- **Length** - Product length
- **Width** - Product width  
- **Height** - Product height

#### Weight
- Enter weight in kilograms (supports decimals)

### Step 5: Add Product Images

#### Image Groups
The system supports 5 types of image groups:

1. **Main Images** - Primary product images for listings
2. **Gallery Images** - Additional images for product pages
3. **Thumbnail Images** - Small preview images
4. **Lifestyle Images** - Product in use scenarios
5. **Detail Images** - Close-up feature shots

#### How to Add Images
1. Click on the desired image group tab
2. Click the upload area or drag & drop images
3. Images will be automatically compressed and optimized
4. Use hover actions to move images between groups
5. Remove images with the X button

#### Image Management Features
- **Drag & Drop Upload** - Easy file selection
- **Multiple Upload** - Select multiple files at once
- **Auto Compression** - Images optimized automatically
- **Cross-Group Movement** - Move images between groups
- **Image Preview** - Visual preview of all images
- **Remove Individual** - Delete specific images

### Step 6: Add Product Content

#### Descriptions
- **Short Description** - Brief product summary
- **Full Description** - Detailed product information

#### Features
- Click "Add" to add key features
- Each feature appears as a removable tag
- Use for highlighting product benefits

#### Specifications
- Add key-value pairs for technical specs
- Example: "Material: Cotton", "Size: Large"
- Useful for detailed product information

### Step 7: Configure Product Attributes

#### Dynamic Attributes
- Attributes are managed separately in the Attributes section
- Only active attributes appear in the product form
- Supports various input types:
  - **Select Dropdown** - Choose from predefined options
  - **Radio Buttons** - Single selection with visual options
  - **Checkboxes** - Multiple selection with color indicators
  - **Text Input** - Free text entry
  - **Number Input** - Numeric values
  - **Color Picker** - Color selection with swatches
  - **Date Picker** - Date selection
  - **Text Area** - Multi-line text

#### Adding Attribute Values
1. Go to Admin → Attributes
2. Create attributes with their values
3. Return to product form to use them

### Step 8: Add Tags and SEO

#### Tags
- Add relevant tags for categorization
- Click "Add" to add new tags
- Tags appear as removable chips
- Useful for filtering and search

#### SEO Fields
- **Meta Title** - SEO title for search engines
- **Meta Description** - SEO description for search results
- Keep titles under 60 characters
- Keep descriptions under 160 characters

### Step 9: Set Product Status

#### Status Options
- **Featured** - Highlight on homepage
- **New** - Mark as new product
- **Bestseller** - Mark as popular item
- **Active** - Make product visible to customers

### Step 10: Save Product

1. Review all information
2. Click **"Create"** button
3. Product will be saved and appear in the product list
4. Modal will close automatically

---

## Product Form Fields Reference

### Basic Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Product Name | Text | Yes | Product title |
| Slug | Text | Yes | URL-friendly name |
| Brand | Select | Yes | Product brand |
| Category | Select | Yes | Product category |
| SKU | Text | No | Product code |

### Pricing
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Price | Number | Yes | Selling price |
| Original Price | Number | No | Price before discount |
| Cost Price | Number | No | Internal cost |
| Discount % | Number | No | Discount percentage |

### Inventory
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Stock Quantity | Number | Yes | Available units |
| Min Stock Level | Number | No | Alert threshold |

### Physical Properties
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Weight | Number | No | Weight in kg |
| Length | Number | No | Length in cm |
| Width | Number | No | Width in cm |
| Height | Number | No | Height in cm |

### Content
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Short Description | Text | No | Brief summary |
| Full Description | Textarea | No | Detailed info |
| Features | Dynamic | No | Key features list |
| Specifications | Key-Value | No | Technical specs |
| Tags | Dynamic | No | Product tags |

### SEO
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Meta Title | Text | No | SEO title |
| Meta Description | Textarea | No | SEO description |

---

## Image Management

### Image Specifications
- **Supported Formats**: JPG, PNG, WEBP
- **Max File Size**: 10MB per image
- **Auto Compression**: Images optimized automatically
- **Responsive**: Multiple sizes generated

### Image Group Purposes

#### Main Images
- Used for product listings
- First image shown in search results
- Primary product display image

#### Gallery Images
- Additional product views
- Different angles and details
- Shown in product detail page

#### Thumbnail Images
- Quick preview images
- Used in mobile views
- Compact product displays

#### Lifestyle Images
- Product in real-world use
- Lifestyle and context shots
- Marketing and inspiration

#### Detail Images
- Close-up feature shots
- Technical details
- Material and texture views

### Image Management Tips
1. **Use High Quality** - Start with high-resolution images
2. **Consistent Lighting** - Use similar lighting for all images
3. **Multiple Angles** - Show product from different views
4. **Lifestyle Shots** - Include product in use scenarios
5. **Detail Shots** - Highlight key features and materials

---

## Product Attributes

### Creating Attributes
1. Go to Admin → Attributes
2. Click "Add Attribute"
3. Fill attribute details:
   - Name (e.g., "Size", "Color", "Material")
   - Type (select, radio, checkbox, etc.)
   - Required/Optional
   - Active status
4. Add attribute values
5. Save attribute

### Using Attributes in Products
1. Attributes appear automatically in product form
2. Only active attributes are shown
3. Required attributes are marked with *
4. Values are loaded from attribute configuration

### Attribute Types

#### Select Dropdown
- Single selection from options
- Good for: Size, Color, Material
- Values managed in attribute settings

#### Radio Buttons
- Single selection with visual options
- Good for: Size, Color with swatches
- Shows all available options

#### Checkboxes
- Multiple selection allowed
- Good for: Features, Materials, Colors
- Can select multiple values

#### Text Input
- Free text entry
- Good for: Custom specifications
- User types any value

#### Number Input
- Numeric values only
- Good for: Measurements, Quantities
- Supports decimals

#### Color Picker
- Color selection with swatches
- Good for: Color variations
- Visual color representation

---

## Best Practices

### Product Information
1. **Clear Names** - Use descriptive, searchable product names
2. **Unique SKUs** - Use consistent SKU format
3. **Accurate Descriptions** - Include all relevant details
4. **Complete Specifications** - Add technical details
5. **Relevant Tags** - Use tags for better searchability

### Images
1. **High Quality** - Use professional product photos
2. **Multiple Angles** - Show product from different views
3. **Consistent Style** - Maintain visual consistency
4. **Proper Sizing** - Use recommended dimensions
5. **Alt Text** - Include descriptive alt text

### SEO
1. **Keyword Research** - Use relevant keywords
2. **Unique Content** - Avoid duplicate descriptions
3. **Meta Optimization** - Optimize title and description
4. **Internal Linking** - Link related products
5. **Image Alt Text** - Describe images for SEO

### Inventory Management
1. **Accurate Stock** - Keep stock levels updated
2. **Set Alerts** - Configure minimum stock levels
3. **Track Costs** - Monitor cost prices
4. **Regular Updates** - Update product information regularly

---

## Troubleshooting

### Common Issues

#### Images Not Uploading
- Check file size (max 10MB)
- Verify file format (JPG, PNG, WEBP)
- Check internet connection
- Try refreshing the page

#### Attributes Not Showing
- Ensure attributes are active
- Check attribute configuration
- Verify attribute values are set
- Refresh the product form

#### Product Not Saving
- Check required fields are filled
- Verify all data is valid
- Check for duplicate SKUs
- Ensure proper permissions

#### Images Not Displaying
- Check image URLs are valid
- Verify image files exist
- Check file permissions
- Try re-uploading images

### Getting Help
1. Check the browser console for errors
2. Verify all required fields are completed
3. Ensure proper file formats and sizes
4. Contact system administrator if issues persist

---

## Quick Reference

### Required Fields
- Product Name
- Slug
- Brand
- Category
- Price
- Stock Quantity

### Recommended Fields
- SKU
- Short Description
- Main Images
- Weight
- Dimensions
- Tags
- Meta Title

### Optional Fields
- Original Price
- Cost Price
- Discount Percentage
- Full Description
- Features
- Specifications
- Attributes
- Meta Description

---

*This guide covers the complete product management workflow. For additional help or advanced features, consult the system administrator.*
