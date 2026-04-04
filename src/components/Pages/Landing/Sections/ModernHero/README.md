# Modern Landing Page - Component Documentation

## Overview

This new landing page redesign features a clean, professional, and modern UI with smooth animations and responsive design. The components are built using Next.js 15, GSAP animations, and SCSS modules.

## Components

### 1. **ModernHero** (`ModernHero.jsx`)
The main hero section featuring the welcoming message and animated network visualization.

#### Features:
- **Tagline**: "Connecting Students. Empowering Futures."
- **Large Heading**: "Welcome to a Thriving Student Community"
- **Description**: Compelling paragraph about student growth and support
- **Animated Network Visualization**: Interactive canvas-based network on the right side
- **Stats Overlay**: 3 key metrics displayed over the network
- **Floating Background Bubbles**: Subtle animated gradient bubbles across the background
- **Smooth Animations**: GSAP-powered fade-in effects on load

#### Responsive Breakpoints:
- Desktop: Full 2-column layout
- Tablet (1024px): Adjusted grid with responsive sizing
- Mobile (768px): Single column layout with stacked content

#### Props:
None - standalone component

#### Usage:
```jsx
import ModernHero from '@/components/Pages/Landing/Sections/ModernHero/ModernHero';

<ModernHero />
```

---

### 2. **NetworkAnimation** (`NetworkAnimation/NetworkAnimation.jsx`)
Canvas-based animated network visualization showing interconnected nodes.

#### Features:
- **20 Animated Nodes**: Floating particles with gentle movement
- **Dynamic Connections**: Lines drawn between nearby nodes
- **Glow Effect**: Subtle orange glow around each node
- **Responsive Canvas**: Scales with parent container
- **Smooth Animation Loop**: Uses requestAnimationFrame for smooth 60fps
- **Bounce Physics**: Nodes bounce off canvas edges

#### Customization:
You can modify these values in the component:
```jsx
const nodeCount = 20; // Number of nodes
const connectionDistance = 150; // Distance for drawing lines
const nodes[i].radius = Math.random() * 4 + 3; // Node size
```

#### Performance:
- Optimized for 60fps with minimal CPU overhead
- Uses canvas instead of DOM elements for better performance
- Buffer trail effect prevents flickering

---

### 3. **StatsOverlay** (`StatsOverlay/StatsOverlay.jsx`)
Displays 3 key statistics overlaid on the network visualization.

#### Features:
- **3 Stats Cards**: Happy Students, Projects Completed, Google Rating
- **Emoji Icons**: Visual representation for each stat
- **Glassmorphism Design**: Semi-transparent cards with backdrop blur
- **Hover Animation**: Cards lift and scale on hover
- **Sequential Animation**: Stats animate in sequence on load

#### Displayed Metrics:
- 👥 "5,000+ Happy Students"
- 📊 "1,200+ Projects Completed"
- ⭐ "4.8 Google Rating"

#### Customization:
Easily modify the stats in the component:
```jsx
const stats = [
  { number: "5,000+", label: "Happy Students", icon: "👥" },
  { number: "1,200+", label: "Projects Completed", icon: "📊" },
  { number: "4.8", label: "Google Rating", icon: "⭐" },
];
```

---

### 4. **ServicesSection** (`ServicesSection/ServicesSection.jsx`)
Displays 4 service cards with hover animations and interactive elements.

#### Features:
- **4 Service Cards**:
  1. Internships
  2. Training
  3. Placement Assistance
  4. Mentor Guidance
- **Icon Support**: Uses Lucide React icons
- **Hover Animations**: Lift, shadow growth, and color transitions
- **Scroll Trigger**: Cards animate in as they come into view
- **Responsive Grid**: Auto-fit grid that adapts to screen size
- **Arrow Hover Indicator**: Arrow icon appears on hover

#### Card Features:
- Icon container with gradient background
- Title and description text
- Smooth transitions and hover states
- Color accent on hover

#### Usage:
```jsx
import ServicesSection from '@/components/Pages/Landing/Sections/ModernHero/ServicesSection/ServicesSection';

<ServicesSection />
```

---

### 5. **FloatingBubbles** (`FloatingBubbles/FloatingBubbles.jsx`)
Background decoration component with floating, animated gradient bubbles.

#### Features:
- **6 Floating Bubbles**: Different sizes and positions
- **Smooth Animation**: Float and rotate continuously
- **Blur Effect**: Soft gaussian blur for premium feel
- **Mix Blend Mode**: Subtle color blending with background
- **Non-Interactive**: `pointer-events: none` for clickthrough
- **Performance**: GPU-accelerated with GSAP

#### Customization:
Modify bubble properties:
```jsx
const bubbleData = [
  {
    id: 1,
    size: 200,
    top: "10%",
    left: "-5%",
    color: "rgba(255, 107, 53, 0.08)",
  },
  // ... more bubbles
];
```

---

## Design System

### Colors
- **Primary Accent**: `#ff6b35` (Orange)
- **Dark Text**: `#1a1a2e` (Navy/Dark Blue)
- **Secondary Text**: `#404040` (Dark Gray)
- **Background**: `#faf9f6` (Cream/Off-White)

### Typography
- **Font Family**: Sharp Grotesk (custom web font)
- **Heading Font Weight**: 700 (Bold)
- **Body Font Weight**: 400-600

### Spacing
- **Hero Padding**: 4rem (2rem on mobile)
- **Section Gap**: 4rem
- **Card Padding**: 2rem
- **Border Radius**: 16px (cards), 12px (icon containers)

### Animations
- **Duration**: 0.6s - 1s for smooth, professional feel
- **Easing**: `ease-out` for arrivals, `sine.inOut` for floating
- **Stagger**: 150-200ms between elements

---

## Integration with Existing Layout

The ModernHero and ServicesSection are now integrated into the main LandingPage:

```jsx
<LandingPage>
  <ModernHero />              {/* New Hero Section */}
  <ServicesSection />         {/* New Services Section */}
  <Announcements />           {/* Existing sections */}
  <AboutUs />
  <Programs />
  {/* ... */}
</LandingPage>
```

---

## Responsive Design

All components are fully responsive with the following breakpoints:

| Breakpoint | Width | Behavior |
|-----------|-------|----------|
| Desktop | > 1024px | Full 2-column layout, large text |
| Tablet | 768px - 1024px | Adjusted grid, medium text |
| Mobile | < 768px | Single column, compact text |
| Small Mobile | < 480px | Optimized spacing and sizing |

---

## Performance Optimizations

1. **Canvas Rendering**: NetworkAnimation uses canvas for 60fps performance
2. **GPU Acceleration**: GSAP settings optimized for hardware acceleration
3. **Lazy Loading**: Components use dynamic imports with Next.js
4. **Intersection Observer**: ScrollTrigger for efficient scroll animations
5. **Non-blocking**: Background bubbles use `will-change: transform`

---

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS optimization included)
- Mobile browsers: ✅ Optimized for touch and performance

---

## Customization Guide

### Change Color Scheme
1. Update the orange color (`#ff6b35`) in:
   - `modernHero.module.scss` → `.heading`, `.tagline`
   - `servicesSection.module.scss` → icon colors
   - `networkAnimation.jsx` → node color
   - `statsOverlay.module.scss` → `.statNumber`

### Modify Stats
Edit the `stats` array in `StatsOverlay.jsx`:
```jsx
const stats = [
  { number: "YOUR_NUMBER", label: "YOUR_LABEL", icon: "EMOJI" },
  // ...
];
```

### Update Services
Edit the `services` array in `ServicesSection.jsx`:
```jsx
const services = [
  {
    id: 1,
    icon: YourIcon,
    title: "Your Service",
    description: "Your description",
  },
  // ...
];
```

### Adjust Animations
- Hero fade-in timing: Modify `.to()` durations in `ModernHero.jsx`
- Service cards hover: Update transform values in `servicesSection.module.scss`
- Network speed: Change `duration` in `FloatingBubbles.jsx`

---

## Dependencies

- `next`: 15.4.10
- `react`: 19.1.0
- `gsap`: ^3.13.0
- `@gsap/react`: ^2.1.2
- `lucide-react`: ^0.542.0

---

## File Structure

```
src/components/Pages/Landing/Sections/ModernHero/
├── ModernHero.jsx
├── index.js
├── styles/
│   └── modernHero.module.scss
├── NetworkAnimation/
│   ├── NetworkAnimation.jsx
│   └── styles/
│       └── networkAnimation.module.scss
├── StatsOverlay/
│   ├── StatsOverlay.jsx
│   └── styles/
│       └── statsOverlay.module.scss
├── FloatingBubbles/
│   ├── FloatingBubbles.jsx
│   └── styles/
│       └── floatingBubbles.module.scss
└── ServicesSection/
    ├── ServicesSection.jsx
    └── styles/
        └── servicesSection.module.scss
```

---

## Troubleshooting

### Network Animation Not Showing
- Check if canvas is rendering: Open DevTools and inspect the canvas element
- Verify screen size: Responsive canvas relies on parent container size
- Clear browser cache: Sometimes GSAP animations cache

### Stats Not Visible
- Check z-index: Ensure StatsOverlay has higher z-index than network
- Verify parent positioning: NetworkAnimation container must be `position: relative`

### Animations Laggy on Mobile
- Reduce node count in NetworkAnimation
- Disable FloatingBubbles on mobile
- Check device performance: May need to optimize for older devices

### Responsive Issues
- Test with actual devices: Browser DevTools may not simulate perfectly
- Check media queries: Ensure breakpoints match your design spec
- Verify font loading: Custom fonts must be fully loaded before animations

---

## Next Steps

1. **Test on Devices**: Verify animations and layout on actual devices
2. **Optimize Images**: Add images where needed (currently using solid colors)
3. **Add More Data**: Update stats and services with real numbers
4. **Track Analytics**: Add event tracking to service cards
5. **Enhance Accessibility**: Add ARIA labels and keyboard navigation

---

## Credits

Created with:
- ✨ GSAP for smooth animations
- 🎨 SCSS modules for styling
- ⚡ Next.js 15 for optimal performance
- 🎭 Lucide React for beautiful icons
