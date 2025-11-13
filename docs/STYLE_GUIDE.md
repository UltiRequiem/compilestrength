# CompileStrength Style Guide

> **Target Audience**: Science-based lifters who understand training principles like progressive overload, periodization, and evidence-based programming.

## Brand Identity

### Brand Positioning
CompileStrength is a professional, data-driven training platform for serious lifters. We speak to users who:
- Understand exercise science fundamentals
- Track their progress systematically
- Make training decisions based on evidence
- Value progressive overload and periodization

### Voice & Tone
- **Professional** - Serious about training, not gimmicky
- **Evidence-Based** - References training principles
- **Direct** - Clear, concise language
- **Empowering** - Focus on user capability and data

**Avoid**: Developer jargon, coding metaphors, terminal references

## Visual Design

### Color Palette

#### Primary Colors
- **Primary Blue**: `#3b82f6` (rgb(59, 130, 246))
  - HSL: `217 91% 60%`
  - Usage: Primary actions, links, accents

- **Background Dark**: `#09090b` (rgb(9, 9, 11))
  - HSL: `240 10% 3.9%`
  - Usage: Page backgrounds

#### Secondary Colors
- **Zinc 950**: `#09090b` - Darkest background
- **Zinc 900**: `#18181b` - Card backgrounds
- **Zinc 800**: `#27272a` - Borders, dividers
- **Zinc 700**: `#3f3f46` - Hover states
- **Zinc 400**: `#a1a1aa` - Secondary text
- **Zinc 300**: `#d4d4d8` - Body text
- **Zinc 100**: `#f4f4f5` - Headers, emphasis

#### Accent Colors
- **Success**: Keep primary blue
- **Destructive**: `#ef4444` (red-500)

### Typography

#### Font Family
- **Primary**: Inter (sans-serif)
- **NO monospace fonts** - We are not a terminal/code app

#### Font Sizes
- **Hero Heading**: `text-5xl md:text-7xl` (48px → 72px)
- **Page Title**: `text-3xl` to `text-4xl` (30px → 36px)
- **Section Heading**: `text-2xl` (24px)
- **Card Title**: `text-xl` (20px)
- **Body Text**: `text-base` (16px)
- **Small Text**: `text-sm` (14px)
- **Micro Text**: `text-xs` (12px)

#### Font Weights
- **Bold**: Headers, emphasis
- **Semibold**: Section titles
- **Medium**: Labels, buttons
- **Regular**: Body text

### Spacing & Layout

#### Padding/Margin Scale
- Use Tailwind's spacing scale consistently
- Cards: `p-6` to `p-12` depending on size
- Sections: `py-12` to `py-24`
- Gaps: `gap-4` to `gap-8`

#### Border Radius
- **Default**: `rounded-xl` (0.75rem / 12px)
- **Buttons**: `rounded-md` (0.375rem / 6px)
- **Small Elements**: `rounded-lg` (0.5rem / 8px)

#### Container Widths
- **Landing Page**: `max-w-7xl`
- **App Content**: `max-w-6xl` to `max-w-7xl`
- **Forms**: `max-w-md` (448px)
- **Content Pages**: `max-w-3xl`

### Components

#### Buttons

**Primary Button**
```tsx
<Button size="lg" className="h-12 px-8 text-lg">
  Start Free Trial
</Button>
```
- Background: Blue-500
- Text: White
- Hover: Darker blue
- Prominent for CTAs

**Outline Button**
```tsx
<Button variant="outline" size="sm">
  Login
</Button>
```
- Border: Zinc-800
- Text: Zinc-300
- Hover: White text

#### Cards

**Standard Card**
```tsx
<Card className="border-zinc-800 p-8 rounded-xl bg-zinc-900/50">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Hover Effect**
```tsx
className="hover:bg-zinc-900 transition-colors"
```

**Glow Effect (for emphasis)**
```tsx
className="glow-blue-hover"
```

#### Navigation

**Nav Bar**
```tsx
<nav className="border-b border-zinc-800 px-6 py-4 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
  {/* Sticky navigation with blur effect */}
</nav>
```

**Logo**
```tsx
<span className="text-blue-500">Compile</span>
<span className="text-white">Strength</span>
```

#### Forms

**Input Fields**
```tsx
<Input
  className="bg-zinc-950 border-zinc-800 text-zinc-200
             focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
/>
```

**Labels**
```tsx
<Label className="text-sm font-medium mb-2">
  Label Text
</Label>
```

## Content Guidelines

### Feature Naming

#### ✅ DO Use
- **Program Generator** (not "Compiler")
- **Progress Tracker** (not "GitGains")
- **Performance Analysis** (not "Gains Debugger")
- **Training History** (not "Commit History")
- **AI Training Assistant** (not "AI Compiler")

#### ❌ DON'T Use
- Terminal metaphors (`>`, `//`, `$`)
- Code references ("compile", "debug", "git commit")
- Monospace fonts
- Developer jargon

### Writing Style

#### Headlines
- Focus on training benefits
- Use action words
- Be specific about features

**Good**: "Training Programs Built on Exercise Science"
**Bad**: "// Compile Your Strength"

#### Descriptions
- Reference training principles (progressive overload, periodization)
- Use specific terminology (hypertrophy, volume, frequency)
- Focus on measurable outcomes

**Good**: "Track your lifts, monitor progressive overload, and analyze performance trends"
**Bad**: "Log workouts, track PRs, and visualize your gains"

#### Call-to-Actions
- Direct and confident
- Focus on outcomes
- Clear next steps

**Good**: "Start Free Trial", "Analyze Performance", "Generate Program"
**Bad**: "Run Gains Debugger", "Compile Your Gains"

### Iconography

#### Preferred Icons (Lucide)
- `Dumbbell` - Workouts, exercise
- `BarChart3` - Analytics, performance
- `LineChart` - Progress tracking
- `TrendingUp` - Improvements, PRs
- `Sparkles` - AI features
- `Calendar` - Scheduling
- `Activity` - Statistics
- `Target` - Goals

#### Avoid Icons
- `Terminal` - Too developer-focused
- `Bug` - Negative connotation
- `GitBranch` - Code reference
- `Code` - Developer tool

## Examples

### Landing Page Hero
```tsx
<h1 className="text-5xl md:text-7xl font-bold tracking-tight">
  Training Programs Built on
  <span className="text-blue-500 block mt-2">Exercise Science</span>
</h1>
<p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
  AI-powered programming designed for lifters who understand
  progressive overload, periodization, and evidence-based
  training principles.
</p>
```

### Feature Card
```tsx
<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50
                hover:bg-zinc-900 transition-colors">
  <h3 className="text-2xl font-bold mb-4 text-blue-500">
    AI Program Generator
  </h3>
  <p className="text-zinc-400 leading-relaxed">
    Create personalized training programs based on your experience
    level, training frequency, and goals. Built with periodization
    principles.
  </p>
</div>
```

### Stats Display
```tsx
<div className="text-2xl font-bold text-primary">
  47
</div>
<p className="text-xs text-muted-foreground">
  +3 from last month
</p>
```

## Technical Implementation

### CSS Custom Properties

#### Theme Variables
```css
:root {
  /* Primary */
  --primary: 217 91% 60%;
  --primary-foreground: 0 0% 98%;

  /* Background */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;

  /* Strength Blue (accent) */
  --strength-blue: 217 91% 60%;
  --strength-blue-dim: 217 91% 45%;
  --strength-blue-bright: 217 91% 70%;
}
```

#### Utility Classes
```css
/* Blue glow effect */
.glow-blue {
  box-shadow: 0 0 20px hsl(var(--strength-blue) / 0.3);
}

.glow-blue-hover:hover {
  box-shadow: 0 0 20px hsl(var(--strength-blue) / 0.5);
}

/* Card hover */
.card-hover:hover {
  transform: translateY(-2px);
  border-color: hsl(var(--strength-blue) / 0.5);
}

/* Custom scrollbar */
.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: rgb(59 130 246) rgb(0 0 0);
}
```

### Component Patterns

#### Page Layout
```tsx
<div className="mx-auto max-w-7xl">
  {/* Header */}
  <div className="mb-8">
    <h1 className="text-3xl font-bold">Page Title</h1>
    <p className="text-muted-foreground">Description</p>
  </div>

  {/* Content */}
  <div className="space-y-8">
    {/* Cards, sections, etc. */}
  </div>
</div>
```

#### Loading States
```tsx
<div className="flex items-center gap-2 text-zinc-400">
  <Loader2 className="w-4 h-4 animate-spin" />
  <span>Loading...</span>
</div>
```

## Migration Notes

### Deprecated Patterns
- ❌ `text-green-400` → ✅ `text-blue-500`
- ❌ `border-green-400/20` → ✅ `border-zinc-800`
- ❌ `font-mono` → ✅ Remove (use default font)
- ❌ `terminal-text` → ✅ Remove class
- ❌ `glow-green` → ✅ `glow-blue`
- ❌ `scrollbar-terminal` → ✅ `scrollbar-custom`

### Text Replacements
- "AI Compiler" → "Program Generator"
- "GitGains" → "Progress Tracker"
- "Gains Debugger" → "Performance Analysis"
- "Compile Your Strength" → "Training Programs Built on Exercise Science"
- "commit" → "training session"
- "stack trace" → "analysis details"

## Checklist for New Features

When adding new features, ensure:

- [ ] Uses zinc color palette (not green)
- [ ] No monospace fonts
- [ ] No terminal prefixes (`>`, `//`, `$`)
- [ ] No developer metaphors
- [ ] References training principles
- [ ] Uses appropriate icons (fitness, not code)
- [ ] Blue accent color for emphasis
- [ ] Rounded corners (rounded-xl)
- [ ] Consistent spacing
- [ ] Professional, science-based language

## Resources

- **Design System**: Built on Tailwind CSS v4
- **Component Library**: shadcn/ui
- **Icon Library**: Lucide React
- **Font**: Inter (Google Fonts)

---

**Last Updated**: January 2025
**Version**: 2.0 (Post-Rebrand)
