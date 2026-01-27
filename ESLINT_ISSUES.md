# ESLint Issues (Non-Critical)

**Status:** ✅ ESLint config fixed  
**Impact:** Low - These are cosmetic/style issues, not functional bugs

---

## What Was Fixed

### ESLint Configuration Error
**Problem:** `compat is not defined` error preventing linting  
**Solution:** ✅ Removed unused `compat` import and simplified config  
**File:** `eslint.config.mjs`

---

## Remaining Linting Issues (37 total)

These are **non-critical** style/best practice warnings. They don't affect production functionality.

### 🔴 Errors (14) - Should Fix

1. **Unescaped quotes** (9 errors)
   - Files: Hero.tsx, EnhancedCTA.tsx, WhyShipFree.tsx, login-form.tsx, ContactForm.tsx, MinimalNavbar.tsx, TestimonialCards.tsx, TestimonialMarquee.tsx
   - Fix: Replace `'` with `&apos;` or use `{\"'\"}` in JSX
   - Impact: None (cosmetic)

2. **Use Next.js Link instead of <a>** (2 errors)
   - File: playground/page.tsx (lines 35, 47)
   - Fix: Replace `<a href="/">` with `<Link href="/">`
   - Impact: Minor (better performance with Link)

3. **setState in useEffect** (1 error)
   - File: playground/ui/ThemeSwitcher.tsx (line 21)
   - Fix: Initialize state directly or use lazy initialization
   - Impact: Minor (potential performance issue)

4. **require() import** (1 error)
   - File: utils/stripe.ts (line 12)
   - Fix: Use ES6 import instead
   - Impact: None (works fine, just style preference)

### ⚠️ Warnings (23) - Optional

1. **Unused variables** (17 warnings)
   - Various files with unused imports/variables
   - Fix: Remove unused code
   - Impact: None (just cleaner code)

2. **Use Next.js Image instead of <img>** (3 warnings)
   - Files: Hero.tsx, BlogList.tsx, BlogPostContent.tsx
   - Fix: Replace `<img>` with `<Image>` from next/image
   - Impact: Minor (better performance with Image)

---

## Quick Fix Commands

### Fix Unescaped Quotes (Automatic)
```bash
# Most can be auto-fixed with:
pnpm run lint -- --fix
```

### Manual Fixes Needed

**1. playground/page.tsx - Replace <a> with <Link>**
```tsx
// Before
<a href="/">Home</a>

// After
import Link from 'next/link';
<Link href="/">Home</Link>
```

**2. ThemeSwitcher.tsx - Fix setState in effect**
```tsx
// Before
const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(themes[0]);
useEffect(() => {
  const saved = getSavedTheme();
  setCurrentTheme(saved);
}, []);

// After
const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => getSavedTheme());
```

**3. utils/stripe.ts - Use ES6 import**
```tsx
// Before
const Stripe = require('stripe');

// After
import Stripe from 'stripe';
```

---

## Should You Fix These?

### Before Production: NO
- These are **cosmetic issues** that don't affect functionality
- Your app will work perfectly fine with these warnings
- Focus on the **production checklist** instead

### After Launch: YES (Low Priority)
- Clean up unused variables
- Replace <img> with <Image> for better performance
- Fix unescaped quotes for better HTML compliance
- Use Link components for better Next.js optimization

---

## Priority

**Production Readiness:** ✅ Not affected  
**Functionality:** ✅ Not affected  
**Performance:** ⚠️ Minor impact (Image vs img)  
**Code Quality:** ⚠️ Should be cleaner  

**Recommendation:** Fix after launch during code cleanup phase.

---

## Auto-Fix Command

Try this to automatically fix most issues:
```bash
pnpm run lint -- --fix
```

This will fix:
- Unescaped quotes
- Some unused imports
- Formatting issues

Manual fixes still needed for:
- <a> → <Link> conversions
- <img> → <Image> conversions
- setState in useEffect
- require() → import

---

**Last Updated:** January 26, 2026  
**Status:** Non-blocking for production deployment
