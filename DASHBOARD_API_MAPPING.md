# 📊 Dashboard KPI API Mapping

## Admin Dashboard (`/api/auth/dashboard-kpis/`)

### API Response:
```json
{
  "active_geofences": 0,
  "alerts_today": 0,
  "active_sub_admins": 2,
  "total_users": 9,
  "critical_alerts": 0,
  "system_health": "Good"
}
```

### Dashboard Cards Mapping:

| Card Title | API Field | Status |
|------------|-----------|--------|
| **Total Sub-Admins** | `active_sub_admins` | ✅ Mapped |
| **Active Geofences** | `active_geofences` | ✅ Mapped |
| **Active Users** | `total_users` | ✅ Mapped |
| **Security Alerts** | `alerts_today` | ✅ Mapped |

### Additional API Data Not Currently Used:
- `critical_alerts` - Count of critical severity alerts
- `system_health` - Overall system health status ("Good", "Warning", "Critical")

**Location**: `/src/components/dashboard/stats-cards.tsx`  
**Store**: `/src/lib/stores/dashboard.ts`

---

## Sub-Admin Dashboard (`/api/auth/subadmin/dashboard-kpis/`)

### Expected API Response Structure:
```json
{
  "my_geofences": 0,
  "my_officers": 0,
  "active_alerts": 0,
  "incidents_today": 0,
  "resolved_today": 0,
  "pending_alerts": 0
}
```

### Dashboard Cards Mapping:

| Card Title | API Field | Status |
|------------|-----------|--------|
| **My Geofences** | `my_geofences` | ✅ Mapped |
| **Security Officers** | `my_officers` | ✅ Mapped |
| **Active Alerts** | `active_alerts` | ✅ Mapped |
| **Incidents Today** | `incidents_today` | ✅ Mapped |

### Additional Details Displayed:
- Pending Alerts count: `pending_alerts`
- Resolved Today count: `resolved_today`

**Location**: `/src/app/sub-admin/dashboard/page.tsx`

---

## ⚠️ Important Notes:

1. **Role-Based Access**:
   - `/api/auth/dashboard-kpis/` - Requires **SUPER_ADMIN** role
   - `/api/auth/subadmin/dashboard-kpis/` - Requires **SUB_ADMIN** role
   - Accessing the wrong endpoint returns **403 Forbidden**

2. **Token Requirements**:
   - All KPI endpoints require valid JWT token in Authorization header
   - Token must be stored in `localStorage` or `sessionStorage` with key `access_token`
   - Use "Remember Me" to persist token across browser sessions

3. **Auto-Refresh**:
   - Admin Dashboard: Auto-fetches KPIs when `StatsCards` component mounts
   - Sub-Admin Dashboard: Auto-fetches KPIs on page load
   - Failed fetches silently use default values (0) to prevent errors

4. **Fallback Behavior**:
   - If API fails: Shows default values (0)
   - If 403 Forbidden: Shows default values and logs message
   - Loading state: Shows "..." while fetching

---

## 🔄 How to Test:

### Admin Dashboard:
1. Login as **Admin** (role: SUPER_ADMIN)
2. Navigate to main dashboard
3. Cards will auto-fetch and display real data from `/api/auth/dashboard-kpis/`

### Sub-Admin Dashboard:
1. Create a **Sub-Admin** user in the backend
2. Login as **Sub-Admin** (role: SUB_ADMIN)
3. Navigate to sub-admin dashboard
4. Cards will auto-fetch and display real data from `/api/auth/subadmin/dashboard-kpis/`

---

## ✅ Integration Status:

- ✅ Admin Dashboard KPIs integrated
- ✅ Sub-Admin Dashboard KPIs integrated
- ✅ Token authentication working
- ✅ Paginated responses handled (`.results` extraction)
- ✅ Role-based endpoint access
- ✅ Graceful error handling with fallbacks
- ✅ Loading states implemented

**Last Updated**: October 13, 2024

