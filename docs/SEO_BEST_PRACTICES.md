# SEO Best Practices for CompileStrength

This document outlines SEO and metadata best practices for all pages in the
CompileStrength application, especially calculator tools.

## Overview

Proper SEO metadata helps with:

- **Search engine rankings**: Better visibility in Google, Bing, etc.
- **Social media sharing**: Rich previews on Twitter, Facebook, LinkedIn
- **Click-through rates**: Compelling titles and descriptions
- **E-A-T signals**: Expertise, Authority, Trust indicators

## Required Metadata for All Tool Pages

Every calculator tool layout (`src/app/tools/*/layout.tsx`) should include:

### 1. Basic Metadata

```typescript
export const metadata: Metadata = {
  title: "Tool Name | Descriptive Subtitle - CompileStrength",
  description: "Compelling 150-160 character description with primary keywords",
  keywords: ["primary keyword", "secondary keyword", "long-tail keyword"],
  authors: [{ name: "CompileStrength" }],
  creator: "CompileStrength",
  publisher: "CompileStrength",
  alternates: {
    canonical: "https://compilestrength.com/tools/tool-name",
  },
  // ... OpenGraph and Twitter metadata below
};
```

**Title Guidelines:**

- Keep under 60 characters (including " - CompileStrength")
- Include primary keyword at the beginning
- Format: `Primary Keyword | Secondary Keyword - CompileStrength`
- Example: `Plate Calculator | Barbell Loading Calculator - CompileStrength`

**Description Guidelines:**

- 150-160 characters optimal length
- Include primary keywords naturally
- Mention key features/benefits
- Add call-to-action when appropriate ("Free tool", "Calculate now")

**Keywords:**

- 5-8 relevant keywords
- Mix of high-volume and long-tail keywords
- Include variations users might search for

### 2. OpenGraph Metadata (Facebook, LinkedIn)

```typescript
openGraph: {
  type: "website",
  locale: "en_US",
  url: "https://compilestrength.com/tools/tool-name",
  siteName: "CompileStrength",
  title: "Tool Name | Descriptive Subtitle - CompileStrength",
  description: "Same or slightly shorter than main description",
  images: [
    {
      url: "/logo.png", // or tool-specific image
      width: 1200,
      height: 630,
      alt: "CompileStrength Tool Name - Brief Description",
    },
  ],
},
```

**OpenGraph Guidelines:**

- Always include `type: "website"` for tools
- Always include `siteName: "CompileStrength"`
- Title should match main title or be slightly shorter
- Image should be 1200x630 for optimal display
- Alt text should describe the image and include tool name

### 3. Twitter Card Metadata

```typescript
twitter: {
  card: "summary_large_image",
  title: "Tool Name | Descriptive Subtitle - CompileStrength",
  description: "Brief description optimized for Twitter (under 200 chars)",
  images: ["/logo.png"],
  creator: "@ultirequiem",
},
```

**Twitter Guidelines:**

- Always use `card: "summary_large_image"` for better visibility
- Include `creator: "@ultirequiem"` for brand attribution
- Title can be slightly shorter than main title (under 70 chars)
- Description should be compelling and under 200 characters

## Implementation Checklist

When creating or updating a tool page layout, verify:

- [ ] Title is under 60 characters and includes primary keyword
- [ ] Description is 150-160 characters with natural keyword usage
- [ ] 5-8 relevant keywords are listed
- [ ] `authors`, `creator`, and `publisher` are set to "CompileStrength"
- [ ] `alternates.canonical` is set to the full tool URL
- [ ] OpenGraph includes: `type`, `locale`, `siteName`, `url`, `title`,
      `description`
- [ ] OpenGraph image has dimensions: `width: 1200`, `height: 630`
- [ ] OpenGraph image has descriptive `alt` text
- [ ] Twitter card type is `summary_large_image`
- [ ] Twitter `creator` is set to "@ultirequiem"

## Example: Complete Tool Layout

See
[src/app/tools/plate-calculator/layout.tsx](../src/app/tools/plate-calculator/layout.tsx)
for a complete reference implementation.

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plate Calculator | Barbell Loading Calculator - CompileStrength",
  description:
    "Calculate which plates to load on your barbell for any weight. Free tool supporting kg and lb plates with visual plate layout display.",
  keywords: [
    "plate calculator",
    "barbell calculator",
    "weight plate calculator",
    "gym plate calculator",
    "powerlifting plate calculator",
    "barbell loading",
  ],
  authors: [{ name: "CompileStrength" }],
  creator: "CompileStrength",
  publisher: "CompileStrength",
  alternates: {
    canonical: "https://compilestrength.com/tools/plate-calculator",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://compilestrength.com/tools/plate-calculator",
    siteName: "CompileStrength",
    title: "Plate Calculator | Barbell Loading Calculator - CompileStrength",
    description:
      "Calculate which plates to load on your barbell for any weight. Free tool supporting kg and lb plates with visual plate layout display.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "CompileStrength Plate Calculator - Barbell Loading Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plate Calculator | Barbell Loading Calculator - CompileStrength",
    description:
      "Calculate which plates to load on your barbell for any weight. Free tool supporting kg and lb plates with visual display.",
    images: ["/logo.png"],
    creator: "@ultirequiem",
  },
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

## Common Mistakes to Avoid

1. **Inconsistent Titles**: Ensure OpenGraph and Twitter titles match or are
   consistent with the main title
2. **Missing Image Dimensions**: Always specify width and height for OpenGraph
   images
3. **No Canonical URL**: Always set canonical URL to prevent duplicate content
   issues
4. **Generic Alt Text**: Image alt text should be specific and descriptive
5. **Missing Creator Attribution**: Always include `creator` and `publisher` for
   E-A-T
6. **Wrong Twitter Card Type**: Use `summary_large_image` not `summary` for
   better CTR
7. **Keyword Stuffing**: Use natural language in descriptions, not keyword lists

## Tools for Testing

After implementing metadata, test with:

- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

## Related Documentation

- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Brand guidelines and UI patterns
- [ONBOARDING.md](./ONBOARDING.md) - Developer setup guide
- [Root Layout](../src/app/layout.tsx) - Global SEO configuration

## Future Enhancements

Consider adding:

- Structured data (JSON-LD) for calculator tools
- FAQ schema markup for tool info sections
- Breadcrumb structured data for navigation
- Tool-specific Open Graph images (1200x630)
- Alternative language versions (hreflang tags)
