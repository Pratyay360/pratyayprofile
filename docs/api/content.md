# content.ts

## calculateReadingTime

`function`

Calculate reading time in minutes based on text content.
Average reading speed: 200 words per minute

```typescript
export function calculateReadingTime(content: string): number
```

### Returns

`number` - 

---

## extractImagesFromMarkdown

`function`

Extract image URLs from markdown content.
Supports both markdown syntax ![alt](url) and HTML <img> tags.

```typescript
export function extractImagesFromMarkdown(content: string): string[]
```

### Returns

`string[]` - 

---

