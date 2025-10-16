# Role-Based Navigation Testing Guide

## Issue Fixed
The navigation wasn't showing sub-admin options because the backend returns roles with underscores (e.g., `SUB_ADMIN`) but the frontend was checking for spaces (e.g., `SUB ADMIN`).

## Changes Made

### 1. Updated `src/lib/config/navigation.ts`
- Added role normalization that replaces underscores with spaces
- Now handles: `SUB_ADMIN`, `SUB ADMIN`, `SUBADMIN`
- Now handles: `SUPER_ADMIN`, `SUPER ADMIN`, `ADMIN`

### 2. Updated `src/components/layout/main-layout.tsx`
- Added debug console logging to show user role and navigation items
- Fixed `isSubAdmin` detection to handle underscores

## How to Test

### Step 1: Start the Servers
```bash
# Terminal 1 - Backend
cd "/home/mayur/Desktop/Security admin app/SafeTNet"
source venv/bin/activate
python manage.py runserver 8000

# Terminal 2 - Frontend
cd "/home/mayur/Desktop/Security admin app/safe-fleet-admin"
npm run dev
```

### Step 2: Register Users with Different Roles

#### Register as Admin:
1. Go to http://localhost:3000/register
2. Fill in the form
3. Select "Admin" from the role dropdown
4. Register

#### Register as Sub-Admin:
1. Go to http://localhost:3000/register
2. Fill in the form
3. Select "Sub-Admin" from the role dropdown
4. Register

### Step 3: Login and Check Sidebar

#### Admin Login:
- Should see sidebar with:
  - Dashboard (/)
  - Sub-Admins (/sub-admins)
  - Users (/users)
  - Geofences (/geofences)
  - Notifications (/notifications)
  - Analytics (/analytics)
- Sidebar subtitle: "Admin Panel"

#### Sub-Admin Login:
- Should see sidebar with:
  - Dashboard (/sub-admin/dashboard)
  - Geofences (/sub-admin/geofences)
  - Security Officers (/sub-admin/officers)
  - Notifications (/sub-admin/notifications)
  - Incident Logs (/sub-admin/incidents)
- Sidebar subtitle: "Sub-Admin Panel"

### Step 4: Check Browser Console
Open browser DevTools (F12) and check the console for:
```
🔐 User Role: SUB_ADMIN (or SUPER_ADMIN)
📋 Navigation Items: 5 (for sub-admin) or 6 (for admin)
🗺️ Navigation: [array of navigation items]
```

## Expected Backend Role Values
- Admin: `SUPER_ADMIN`
- Sub-Admin: `SUB_ADMIN`
- User: `USER`

## Troubleshooting

### If sidebar still shows wrong navigation:
1. Check browser console for the debug logs
2. Verify the role value being returned from backend
3. Clear browser cache and localStorage
4. Try logging out and logging back in

### To manually clear storage:
Open browser console and run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Role Conversion Reference

### Frontend Display → Backend API
- "Admin" → "SUPER_ADMIN"
- "Sub-Admin" → "SUB_ADMIN"
- "User" → "USER"

### Backend API → Frontend Display
- "SUPER_ADMIN" → "Admin"
- "SUB_ADMIN" → "Sub-Admin"
- "USER" → "User"

### Navigation Detection (All formats supported)
- Admin: `SUPER_ADMIN`, `SUPER ADMIN`, `ADMIN`
- Sub-Admin: `SUB_ADMIN`, `SUB ADMIN`, `SUBADMIN`





