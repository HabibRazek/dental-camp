# Custom Blue Loader System

A comprehensive, reusable loader system with blue theme for the dental camp project.

## 🎨 Design Features

- **Blue Theme**: Consistent with the project's blue and white color scheme
- **Animated**: Smooth jumping cube animation with shadow
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper contrast and visibility
- **Professional**: Suitable for dental industry applications

## 📦 Components Available

### 1. Basic Loader Component
```tsx
import { Loader } from "@/components/ui/loader";

<Loader size="sm" />    // Small (24x24px)
<Loader size="md" />    // Medium (48x48px) - Default
<Loader size="lg" />    // Large (64x64px)
```

### 2. Section Loader
For loading states within page sections:
```tsx
import { SectionLoader } from "@/components/ui/loader";

<SectionLoader size="md" />
```

### 3. Page Loader
Full-page overlay loader:
```tsx
import { PageLoader } from "@/components/ui/loader";

<PageLoader />
```

### 4. Button Loader
Small loader for button loading states:
```tsx
import { ButtonLoader } from "@/components/ui/loader";

<Button disabled={loading}>
  {loading && <ButtonLoader />}
  {loading ? "Processing..." : "Submit"}
</Button>
```

## 🎯 CSS-Only Usage

For cases where you prefer pure CSS:

```html
<!-- Basic loader -->
<div class="loader"></div>

<!-- Size variants -->
<div class="loader loader-sm"></div>
<div class="loader loader-md"></div>
<div class="loader loader-lg"></div>

<!-- Section loader -->
<div class="section-loader">
  <div class="loader loader-lg"></div>
</div>

<!-- Page loader -->
<div class="page-loader">
  <div class="loader loader-lg"></div>
</div>
```

## 🔧 Implementation Examples

### Loading State in Components
```tsx
function ProductList() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  if (loading) {
    return <SectionLoader size="lg" />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Button Loading State
```tsx
function SubmitButton() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitForm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Button onClick={handleSubmit} disabled={submitting}>
      {submitting && <ButtonLoader />}
      {submitting ? "Submitting..." : "Submit Form"}
    </Button>
  );
}
```

### Page-Level Loading
```tsx
function App() {
  const [pageLoading, setPageLoading] = useState(false);

  const navigateToPage = () => {
    setPageLoading(true);
    // Simulate navigation
    setTimeout(() => setPageLoading(false), 2000);
  };

  return (
    <>
      <MainContent />
      {pageLoading && <PageLoader />}
    </>
  );
}
```

## 🎨 Customization

### Colors
The loader uses CSS custom properties that can be overridden:

```css
.loader:after {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8); /* Blue gradient */
}

.loader:before {
  background: rgba(59, 130, 246, 0.3); /* Blue shadow */
}
```

### Animation Speed
Modify the animation duration:

```css
.loader:after {
  animation: jump7456 0.5s linear infinite; /* Change 0.5s to desired speed */
}
```

### Custom Sizes
Add new size variants:

```css
.loader-xl {
  width: 80px;
  height: 80px;
}

.loader-xl:before {
  width: 80px;
  height: 8px;
  top: 100px;
}
```

## 📱 Responsive Behavior

The loader system is fully responsive:
- Automatically adjusts on mobile devices
- Maintains aspect ratio across screen sizes
- Optimized for touch interfaces

## ♿ Accessibility

- High contrast blue colors for visibility
- Smooth animations that respect `prefers-reduced-motion`
- Semantic HTML structure
- Screen reader friendly

## 🚀 Performance

- Lightweight CSS animations
- No JavaScript dependencies for basic loader
- Optimized for 60fps animations
- Minimal DOM impact

## 📍 Current Usage

The loader system is currently implemented in:
- `/catalog` - Product loading states
- `/` - Landing page product section
- `/loader-demo` - Demonstration page

## 🔄 Migration Guide

To replace existing loaders with the new system:

1. **Replace skeleton loaders:**
   ```tsx
   // Before
   <div className="animate-pulse">...</div>
   
   // After
   <SectionLoader message="Loading..." />
   ```

2. **Replace spinner components:**
   ```tsx
   // Before
   <Spinner />
   
   // After
   <Loader size="md" />
   ```

3. **Update button loading states:**
   ```tsx
   // Before
   <Button disabled={loading}>
     {loading ? "Loading..." : "Submit"}
   </Button>
   
   // After
   <Button disabled={loading}>
     {loading && <ButtonLoader />}
     {loading ? "Processing..." : "Submit"}
   </Button>
   ```

## 🎯 Best Practices

1. **Use appropriate sizes:**
   - `sm` for buttons and small components
   - `md` for general use
   - `lg` for main content areas

2. **Provide meaningful messages:**
   ```tsx
   <SectionLoader message="Loading dental products..." />
   ```

3. **Use PageLoader sparingly:**
   - Only for full page transitions
   - Always provide a timeout

4. **Maintain consistency:**
   - Use the same loader throughout your app
   - Keep messages consistent in tone

## 🐛 Troubleshooting

**Loader not showing:**
- Check if CSS is imported in `globals.css`
- Verify component imports

**Animation not smooth:**
- Check for CSS conflicts
- Ensure proper z-index values

**Size issues:**
- Use predefined size variants
- Check parent container constraints
