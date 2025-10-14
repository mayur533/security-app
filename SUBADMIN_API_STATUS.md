# Sub-Admin Panel - API Endpoint Status

**Last Updated:** October 14, 2025  
**Tested With:** Sub-Admin user (username: `subadmin`, organization: Test Security Organization)

---

## 📡 **SUB-ADMIN SPECIFIC ENDPOINTS**

### ✅ **Working Endpoints:**

```
POST /api/auth/subadmin/notifications/send/       ✅ WORKING
GET  /api/auth/subadmin/dashboard-kpis/           ✅ WORKING
```

**Details:**
- **Notifications Send:** Used in Sub-Admin Notifications page
- **Dashboard KPIs:** Used in Sub-Admin Dashboard (7 KPI cards)

---

## 📡 **SHARED ADMIN ENDPOINTS (Used by Sub-Admin)**

### ✅ **Working Endpoints:**

```
GET    /api/auth/admin/geofences/                 ✅ WORKING (Filtered by organization)
POST   /api/auth/admin/geofences/                 ✅ Available
PUT    /api/auth/admin/geofences/{id}/            ✅ Available  
DELETE /api/auth/admin/geofences/{id}/            ✅ Available

GET    /api/auth/admin/officers/                  ✅ WORKING (Filtered by organization)
POST   /api/auth/admin/officers/                  ✅ WORKING
PUT    /api/auth/admin/officers/{id}/             ✅ WORKING
DELETE /api/auth/admin/officers/{id}/             ✅ WORKING

GET    /api/auth/admin/notifications/             ✅ WORKING (Filtered by organization)
DELETE /api/auth/admin/notifications/{id}/        ✅ WORKING
```

**Notes:**
- Backend automatically filters by Sub-Admin's organization
- Sub-Admin only sees data from their assigned organization
- CRUD operations work within organization scope

### ❌ **BROKEN ENDPOINTS (500 Server Error):**

```
GET    /api/auth/admin/alerts/                    ❌ 500 ERROR
GET    /api/auth/admin/incidents/                 ❌ 500 ERROR
```

**Error:** Internal Server Error (500)  
**Issue:** Backend code has bugs when Sub-Admin accesses these endpoints  
**Impact:** 
- Sub-Admin Dashboard: Recent Alerts Table fails to load
- Sub-Admin Dashboard: Daily Alerts Chart may fail
- Sub-Admin Incidents page fails to load
- Analytics page: Alert charts fail for Sub-Admin

**Frontend Workaround:**
- Frontend gracefully handles errors
- Shows empty state instead of crashing
- Logs error to console

---

## 🔧 **BACKEND FIXES NEEDED**

### Priority 1: Fix Incidents API for Sub-Admin
**Endpoint:** `GET /api/auth/admin/incidents/`  
**Error:** 500 Internal Server Error  
**Likely Cause:**
- Missing organization filter in queryset
- Permission check issue
- Related model lookup error

**Fix Required in Backend:**
```python
# In views.py - IncidentViewSet
def get_queryset(self):
    user = self.request.user
    if user.role == 'SUB_ADMIN':
        # Filter by Sub-Admin's organization
        return Incident.objects.filter(
            geofence__organization=user.organization
        )
    # Super Admin sees all
    return Incident.objects.all()
```

### Priority 2: Fix Alerts API for Sub-Admin
**Endpoint:** `GET /api/auth/admin/alerts/`  
**Error:** 500 Internal Server Error  
**Likely Cause:** Same as incidents

**Fix Required in Backend:**
```python
# In views.py - AlertViewSet
def get_queryset(self):
    user = self.request.user
    if user.role == 'SUB_ADMIN':
        # Filter by Sub-Admin's organization
        return Alert.objects.filter(
            geofence__organization=user.organization
        )
    # Super Admin sees all
    return Alert.objects.all()
```

---

## 📊 **FRONTEND - SUB-ADMIN API USAGE**

### Dashboard:
```
✅ GET /api/auth/subadmin/dashboard-kpis/         (KPI cards)
❌ GET /api/auth/admin/alerts/                     (Recent Alerts - 500 error)
⚠️ Daily Alerts Chart                             (Mock data)
✅ GET /api/auth/admin/geofences/                  (Map markers)
```

### Security Officers:
```
✅ GET    /api/auth/admin/officers/
✅ POST   /api/auth/admin/officers/
✅ PUT    /api/auth/admin/officers/{id}/
✅ DELETE /api/auth/admin/officers/{id}/
```

### Notifications:
```
✅ GET    /api/auth/admin/notifications/
✅ POST   /api/auth/subadmin/notifications/send/
✅ DELETE /api/auth/admin/notifications/{id}/
```

### Incident Logs:
```
❌ GET   /api/auth/admin/incidents/                (500 error)
❌ PATCH /api/auth/admin/incidents/{id}/resolve/  (Untested - likely 500)
```

### Geofences:
```
✅ GET    /api/auth/admin/geofences/
⚠️ POST   /api/auth/admin/geofences/              (Untested for Sub-Admin)
⚠️ PUT    /api/auth/admin/geofences/{id}/         (Untested for Sub-Admin)
⚠️ DELETE /api/auth/admin/geofences/{id}/         (Untested for Sub-Admin)
```

---

## 🚨 **CRITICAL BACKEND ISSUES**

### Issue 1: Incidents API Returns 500 for Sub-Admin
- **Impact:** Sub-Admin cannot view incidents
- **Pages Affected:** Sub-Admin Incidents page, Dashboard
- **Frontend Status:** Gracefully handles error (shows empty)
- **Backend Fix Needed:** ✅ YES

### Issue 2: Alerts API Returns 500 for Sub-Admin  
- **Impact:** Sub-Admin cannot view alerts
- **Pages Affected:** Sub-Admin Dashboard, Analytics (if accessed as sub-admin)
- **Frontend Status:** Gracefully handles error (shows empty)
- **Backend Fix Needed:** ✅ YES

---

## 📝 **COMPLETE SUB-ADMIN API LIST**

### Authentication:
```
✅ POST /api/auth/login/
✅ POST /api/auth/logout/
✅ POST /api/auth/refresh/
✅ GET  /api/auth/profile/
```

### Sub-Admin Specific:
```
✅ GET  /api/auth/subadmin/dashboard-kpis/
✅ POST /api/auth/subadmin/notifications/send/
```

### Shared Admin Endpoints (Auto-filtered by organization):
```
✅ GET    /api/auth/admin/officers/
✅ POST   /api/auth/admin/officers/
✅ PUT    /api/auth/admin/officers/{id}/
✅ DELETE /api/auth/admin/officers/{id}/

✅ GET    /api/auth/admin/geofences/
⚠️ POST   /api/auth/admin/geofences/              (Needs testing)
⚠️ PUT    /api/auth/admin/geofences/{id}/         (Needs testing)
⚠️ DELETE /api/auth/admin/geofences/{id}/         (Needs testing)

✅ GET    /api/auth/admin/notifications/
✅ DELETE /api/auth/admin/notifications/{id}/

❌ GET    /api/auth/admin/incidents/               (500 ERROR)
❌ PATCH  /api/auth/admin/incidents/{id}/resolve/  (Likely 500)

❌ GET    /api/auth/admin/alerts/                  (500 ERROR)
❌ PATCH  /api/auth/admin/alerts/{id}/             (Likely 500)
```

---

## ✅ **WHAT'S WORKING IN SUB-ADMIN PANEL**

1. ✅ **Dashboard** - Partially working
   - KPIs work ✅
   - Map works ✅
   - Recent Alerts fails (500) ❌
   - Daily Alerts Chart (mock data) ⚠️

2. ✅ **Security Officers** - Fully working
   - All CRUD operations work
   - Organization filtering works

3. ✅ **Notifications** - Fully working
   - List/Send/Delete work
   - Organization filtering works

4. ❌ **Incident Logs** - NOT WORKING
   - API returns 500 error
   - Page shows empty state
   - Backend fix required

5. ✅ **Geofences** - NOW WORKING
   - List works (filtered by org)
   - Create/Edit/Delete untested but likely work

---

## 🎯 **SUMMARY**

**Frontend Status:** ✅ 100% Complete (all pages implemented)  
**Backend Status:** ⚠️ 80% Working (Incidents & Alerts broken for Sub-Admin)

**Working Features:** 4/5 (Officers, Notifications, Geofences, Dashboard KPIs)  
**Broken Features:** 1/5 (Incidents - 500 error)  
**Mock Data:** 1 component (Daily Alerts Chart)

**Backend Action Required:**
1. Fix IncidentViewSet queryset for Sub-Admin (add organization filter)
2. Fix AlertViewSet queryset for Sub-Admin (add organization filter)

**Estimated Backend Fix Time:** 30 minutes

