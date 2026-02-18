# Files to Clean Up (Optional)

These files are no longer needed after the Next.js migration. You can safely delete them:

## Files to Delete

### Old Entry Points
- `src/main.jsx` - No longer needed (replaced by Next.js app structure)
- `src/App.jsx` - Router logic now in app/page.js and app/layout.js
- `index.html` - Next.js generates this automatically

### Old Styles
- `src/index.css` - Content moved to `src/app/globals.css`

### Old Pages Directory
- `src/pages/` - All pages have been migrated to `src/app/`
  - `src/pages/Login.jsx` → `src/app/login/page.js`
  - `src/pages/Register.jsx` → `src/app/register/page.js`
  - `src/pages/Onboarding.jsx` → `src/app/onboarding/page.js`
  - `src/pages/Matches.jsx` → `src/app/matches/page.js`
  - `src/pages/Profile.jsx` → `src/app/profile/page.js`
  - `src/pages/Chat.jsx` → `src/app/chat/[matchId]/page.js`

### Configuration Files
- `vite.config.js` - No longer used (replaced by next.config.js)

## Files to Keep

### Components (Updated)
- `src/components/Navbar.jsx` ✅ (Updated for Next.js)
- `src/components/ProtectedRoute.jsx` ✅ (Updated for Next.js)

### Services (Updated)
- `src/services/api.js` ✅ (Updated env variables)
- `src/services/socket.js` ✅ (Updated env variables)
- `src/services/index.js` ✅ (No changes needed)

### Store
- `src/store/authStore.js` ✅ (No changes needed)

### Configuration
- `package.json` ✅ (Updated)
- `tailwind.config.js` ✅ (Updated)
- `postcss.config.js` ✅ (Updated)
- `.eslintrc.json` ✅ (New)
- `next.config.js` ✅ (New)
- `jsconfig.json` ✅ (New)

## Cleanup Command

You can delete the old files with these commands:

### Windows (PowerShell)
```powershell
cd frontend
Remove-Item src\main.jsx
Remove-Item src\App.jsx
Remove-Item index.html
Remove-Item src\index.css
Remove-Item -Recurse src\pages
Remove-Item vite.config.js
```

### Linux/macOS
```bash
cd frontend
rm src/main.jsx
rm src/App.jsx
rm index.html
rm src/index.css
rm -rf src/pages
rm vite.config.js
```

**Note:** Only delete these files after verifying that the Next.js version works correctly!
