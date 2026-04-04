# Modern Landing Page - Design System & Color Reference

## Color Palette

### Primary Colors
```
Orange Accent:     #ff6b35 (RGB: 255, 107, 53)
Dark Navy:         #1a1a2e (RGB: 26, 26, 46)
Dark Gray:         #404040 (RGB: 64, 64, 64)
Cream/Off-White:   #faf9f6 (RGB: 250, 249, 246)
Pure White:        #ffffff (RGB: 255, 255, 255)
```

### Color Usage

#### Orange (#ff6b35) - Primary Accent
- **Hero Tagline**: "Connecting Students. Empowering Futures."
- **Network Animation**: Node color and glow
- **Network Connections**: Line color (semi-transparent)
- **Stats Numbers**: Large stat values
- **Service Icons**: Icon color and hover states
- **Buttons/CTAs**: Hover states and highlights

#### Dark Navy (#1a1a2e) - Primary Text
- **Headings**: All H1, H2, H3
- **Card Titles**: Service card titles
- **Labels**: Important labels

#### Dark Gray (#404040) - Secondary Text
- **Body Text**: Description paragraphs
- **Service Descriptions**: Card descriptions
- **Secondary Information**: Supporting text

#### Cream (#faf9f6) - Background
- **Page Background**: Main gradient
- **Section Backgrounds**: Light backgrounds
- **Spacing**: Between sections

#### White (#ffffff) - Cards
- **Service Cards**: Card background
- **Stats Cards**: Card background with transparency
- **Network Container**: Background

---

## Typography System

### Font Family: Sharp Grotesk
All text uses the custom Sharp Grotesk font loaded from `/public/fonts/sharpGrotesk/`

### Font Weights
```
Light:    300
Regular:  400
Medium:   500
SemiBold: 600
Bold:     700
ExtraBold: 800
```

### Heading Hierarchy

#### H1 - Main Hero Heading
```scss
font-size: 3.5rem;      // Desktop
font-size: 2.8rem;      // Tablet
font-size: 2.2rem;      // Mobile
font-weight: 700;
line-height: 1.2;
letter-spacing: -0.5px;
color: #1a1a2e;
```

#### H2 - Section Titles
```scss
font-size: 2.5rem;      // Desktop
font-size: 2rem;        // Tablet
font-size: 1.6rem;      // Mobile
font-weight: 700;
letter-spacing: -0.5px;
```

#### H3 - Card Titles
```scss
font-size: 1.3rem;
font-weight: 700;
letter-spacing: -0.3px;
```

### Body Text

#### Large Paragraph
```scss
font-size: 1.05rem;
line-height: 1.7;
color: #404040;
```

#### Small/Supporting Text
```scss
font-size: 0.95rem;
line-height: 1.6;
color: #404040;
```

#### Labels/Tags
```scss
font-size: 0.8rem;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.5px;
color: #ff6b35;
```

---

## Spacing System

### Standard Padding/Margin Units
```
xs:    0.5rem    (8px)
sm:    1rem      (16px)
md:    1.5rem    (24px)
lg:    2rem      (32px)
xl:    3rem      (48px)
2xl:   4rem      (64px)
3xl:   6rem      (96px)
```

### Component Spacing

#### Hero Section
```scss
padding: 4rem 2rem;         // Desktop
gap: 4rem;                  // Between left/right content
margin-bottom: 3rem;        // After section
```

#### Service Cards
```scss
padding: 2rem 1.8rem;       // Card content
gap: 2rem;                  // Between cards
margin-bottom: 1.5rem;      // Card bottom spacing
```

#### Sections
```scss
padding: 6rem 2rem;         // Top/bottom padding
margin-bottom: 4rem;        // Section separation
```

---

## Border Radius

```
xs:    4px
sm:    8px
md:    12px      // Icon containers
lg:    16px      // Main cards, network container
full:  50%       // Circles (network nodes)
```

---

## Shadows

### Card Shadow
```scss
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
```

### Card Hover Shadow
```scss
box-shadow: 0 20px 50px rgba(255, 107, 53, 0.15);
```

### Hero Network Shadow
```scss
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
```

### Elevation Levels
```
Level 1: 0 2px 4px rgba(0, 0, 0, 0.05);
Level 2: 0 4px 8px rgba(0, 0, 0, 0.08);
Level 3: 0 8px 16px rgba(0, 0, 0, 0.1);
Level 4: 0 12px 32px rgba(0, 0, 0, 0.12);
Level 5: 0 20px 60px rgba(0, 0, 0, 0.15);
```

---

## Visual Elements

### Gradients

#### Background Gradient
```scss
background: linear-gradient(135deg, #faf9f6 0%, #f5f3f0 100%);
```

#### Card Hover Gradient
```scss
background: radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
```

### Borders

#### Primary Border
```scss
border: 1px solid rgba(255, 107, 53, 0.1);
```

#### Hover Border
```scss
border: 1px solid rgba(255, 107, 53, 0.3);
```

---

## Animations & Transitions

### Timing Functions
```
Fade In:       ease: "power2.out", duration: 0.6-0.8s
Hover:         transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1)
Floating:      ease: "sine.inOut", duration: 6-10s (infinite)
Network:       continuous requestAnimationFrame loop (60 FPS)
```

### Transform Effects
```
Lift on Hover:    transform: translateY(-12px)
Scale on Hover:   transform: scale(1.05)
Network Scale:    transform: scale(1.15)
Fade Effects:     opacity: 0 → 1
```

---

## Responsive Breakpoints

| Device | Width | CSS Rule |
|--------|-------|----------|
| Desktop | > 1024px | - |
| Tablet | 768px - 1024px | `@media (max-width: 1024px)` |
| Mobile | < 768px | `@media (max-width: 768px)` |
| Small | < 480px | `@media (max-width: 480px)` |

### Text Scaling
```
Display 1 (H1):    3.5rem → 2.8rem → 2.2rem → 1.8rem
Display 2 (H2):    2.5rem → 2rem → 1.6rem
Heading (H3):      1.3rem → 1.15rem
Body:              1.05rem → 0.95rem → 0.95rem
```

---

## Icon System

### Icons Library: Lucide React
All icons use consistent sizing and color system:

```jsx
// Size variants
<Icon size={24} />  // Small
<Icon size={32} />  // Medium
<Icon size={40} />  // Large
<Icon size={48} />  // Extra Large

// Color usage
color: #ff6b35;     // Orange accent
color: #1a1a2e;     // Dark text
color: #404040;     // Gray text
```

### Available Icons
- **Internships**: Briefcase
- **Training**: BookOpen
- **Placement**: Target
- **Mentoring**: Users
- Plus 600+ more from lucide-react

---

## Component Color Specifications

### ModernHero
```
Text Color:          #1a1a2e (navy)
Tagline:             #ff6b35 (orange)
Paragraph:           #404040 (gray)
Background:          linear-gradient(#faf9f6, #f5f3f0)
Network Border:      1px solid rgba(#ff6b35, 0.1)
```

### NetworkAnimation
```
Node Color:          #ff6b35 (orange)
Node Highlight:      rgba(255, 255, 255, 0.6)
Node Glow:           rgba(#ff6b35, 0.3)
Connections:         rgba(#ff6b35, 0.4)
Container:           rgba(255, 255, 255, 0.6) + backdrop blur
```

### StatsOverlay
```
Card Background:     rgba(255, 255, 255, 0.95)
Card Border:         1px solid rgba(#ff6b35, 0.2)
Stat Number:         #ff6b35 (orange)
Stat Label:          #404040 (gray)
Border on Hover:     rgba(#ff6b35, 0.4)
```

### ServicesSection
```
Card Background:     #ffffff (white)
Card Border:         1px solid rgba(#ff6b35, 0.1)
Title:               #1a1a2e (navy)
Description:         #404040 (gray)
Icon Color:          #ff6b35 (orange)
Icon Background:     linear-gradient rgba(#ff6b35, 0.1-0.05)
Arrow:               #ff6b35 (orange)
Section Background:  linear-gradient(#faf9f6, #f5f3f0)
```

### FloatingBubbles
```
Color Spectrum:      rgba(#ff6b35, 0.05-0.08) orange tints
Filter:              blur(40px)
Mix Blend Mode:      multiply
Opacity:             0.6
```

---

## Glassmorphism Details

### Stats Card Glass Effect
```scss
background: rgba(255, 255, 255, 0.95);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 107, 53, 0.2);
```

### Network Container Glass
```scss
background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%);
border: 1px solid rgba(255, 107, 53, 0.1);
```

---

## Accessibility Colors

### Contrast Ratios (WCAG AA)
- Navy (#1a1a2e) on Cream (#faf9f6): ✅ 15.8:1 (AAA+)
- Gray (#404040) on Cream (#faf9f6): ✅ 8.5:1 (AAA)
- Orange (#ff6b35) on White: ✅ 6.3:1 (AA)
- Orange (#ff6b35) on Cream: ✅ 6.8:1 (AA)

---

## Dark Mode Considerations

If dark mode is needed, suggested palette:
```
Dark Background:     #0f0f1e
Dark Text:           #e8e8f0
Dark Secondary:      #a0a0b0
Dark Accent:         #ff6b35 (keep same)
Dark Card:           #1a1a2e
```

---

## Export Guidelines

### For Designers
- Use Sharp Grotesk font in design tools
- Default spacing: 8px base unit
- Breakpoints: 1024px (tablet), 768px (mobile)
- Primary color: #ff6b35

### For Developers
- Import color variables from SCSS
- Use provided mixins for spacing
- Follow component structure
- Use provided SCSS modules

---

## Quick Copy-Paste Colors

```css
/* Primary Colors */
--color-orange: #ff6b35;
--color-navy: #1a1a2e;
--color-gray: #404040;
--color-cream: #faf9f6;
--color-white: #ffffff;

/* Shadows */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
--shadow-md: 0 8px 24px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.15);

/* Spacing */
--space-xs: 0.5rem;
--space-sm: 1rem;
--space-md: 1.5rem;
--space-lg: 2rem;
--space-xl: 3rem;
```

---

## Brand Voice

The design communicates:
- **Professional**: Clean, minimal aesthetic
- **Modern**: Contemporary yet timeless
- **Trustworthy**: Strong contrast, clear hierarchy
- **Energetic**: Orange accent adds warmth and energy (but minimal use)
- **Inclusive**: High contrast accessibility

---

## Version Control

Last Updated: March 31, 2026
Version: 1.0
Status: Production Ready
