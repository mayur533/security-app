# Frontend API Usage Summary

## 🔐 Authentication APIs (Fully Implemented)

### POST Endpoints
- ✅ **POST `/api/auth/login/`** - User login
  - Used in: `src/app/login/page.tsx`
  - Service: `authService.login()`
  - Status: **WORKING**

- ✅ **POST `/api/auth/register/`** - User registration
  - Used in: `src/app/register/page.tsx`
  - Service: `authService.register()`
  - Status: **WORKING**

- ✅ **POST `/api/auth/logout/`** - User logout
  - Used in: Header component, various pages
  - Service: `authService.logout()`
  - Status: **WORKING**

- ✅ **POST `/api/auth/refresh/`** - Token refresh
  - Used in: Auth context for token management
  - Service: `authService.refreshToken()`
  - Status: **WORKING**

---

## 👥 Users Management (Fully Implemented)

### GET Endpoints
- ✅ **GET `/api/auth/admin/users/`** - List all users
  - Used in: `src/app/users/page.tsx` → `UsersTable`
  - Service: `usersService.getAll()`
  - Status: **WORKING** (Paginated response)

- ✅ **GET `/api/auth/admin/users/{id}/`** - Get user details
  - Used in: `src/components/users/edit-user-modal.tsx`
  - Service: `usersService.getById(id)`
  - Status: **WORKING**

### PUT/PATCH Endpoints
- ✅ **PUT `/api/auth/admin/users/{id}/`** - Update user
  - Used in: `src/components/users/edit-user-modal.tsx`
  - Service: `usersService.update(id, data)`
  - Status: **WORKING**

### DELETE Endpoints
- ⚠️ **DELETE `/api/auth/admin/users/{id}/`** - Delete user
  - Service method exists: `usersService.delete(id)`
  - Status: **NOT USED IN UI** (dropdown option exists but not implemented)

---

## 👮 Sub-Admins Management (Fully Implemented)

### GET Endpoints
- ✅ **GET `/api/auth/admin/subadmins/`** - List all sub-admins
  - Used in: `src/app/sub-admins/page.tsx` → `SubAdminsTable`
  - Service: `subadminsService.getAll()`
  - Status: **WORKING** (Paginated response)

- ✅ **GET `/api/auth/admin/users/{id}/`** - Get sub-admin details
  - Used in: `src/components/sub-admins/edit-subadmin-modal.tsx`
  - Service: `usersService.getById(id)` (reuses users service)
  - Status: **WORKING**

### PUT/PATCH Endpoints
- ✅ **PUT `/api/auth/admin/users/{id}/`** - Update sub-admin
  - Used in: `src/components/sub-admins/edit-subadmin-modal.tsx`
  - Service: `usersService.update(id, data)`
  - Status: **WORKING**

### POST/DELETE Endpoints
- ❌ **POST `/api/auth/admin/subadmins/create/`** - Create sub-admin
  - Service method exists: `subadminsService.create()`
  - Status: **NOT IMPLEMENTED IN UI**

- ⚠️ **DELETE `/api/auth/admin/users/{id}/`** - Delete sub-admin
  - Service method exists: `subadminsService.delete(id)`
  - Status: **NOT USED IN UI**

---

## 🗺️ Geofences Management (Partially Implemented)

### GET Endpoints
- ✅ **GET `/api/auth/admin/geofences/`** - List all geofences
  - Used in: `src/app/geofences/page.tsx`, `src/app/sub-admin/geofences/page.tsx`
  - Service: `geofencesService.getAll()`
  - Status: **WORKING**

- ✅ **GET `/api/auth/admin/geofences/{id}/`** - Get geofence details
  - Service method exists: `geofencesService.getById(id)`
  - Status: **SERVICE EXISTS** (not visibly used in view details yet)

### POST Endpoints
- ⚠️ **POST `/api/auth/admin/geofences/`** - Create geofence
  - Service method exists: `geofencesService.create(data)`
  - Status: **SERVICE EXISTS** (UI has "Add Geofence" button but may not be wired)

### PUT/PATCH Endpoints
- ⚠️ **PATCH `/api/auth/admin/geofences/{id}/`** - Update geofence
  - Service method exists: `geofencesService.update(id, data)`
  - Status: **SERVICE EXISTS**

### DELETE Endpoints
- ⚠️ **DELETE `/api/auth/admin/geofences/{id}/`** - Delete geofence
  - Service method exists: `geofencesService.delete(id)`
  - Status: **SERVICE EXISTS**

---

## 👮 Security Officers (Sub-Admin Only) (Partially Implemented)

### GET Endpoints
- ✅ **GET `/api/auth/admin/officers/`** - List all officers
  - Used in: `src/app/sub-admin/officers/page.tsx`
  - Service: `officersService.getAll()`
  - Status: **WORKING** (requires SUB_ADMIN role)

- ⚠️ **GET `/api/auth/admin/officers/{id}/`** - Get officer details
  - Service method exists: `officersService.getById(id)`
  - Status: **SERVICE EXISTS**

### POST Endpoints
- ⚠️ **POST `/api/auth/admin/officers/`** - Create officer
  - Service method exists: `officersService.create(data)`
  - Status: **SERVICE EXISTS** (UI has modal)

### PUT/PATCH Endpoints
- ⚠️ **PATCH `/api/auth/admin/officers/{id}/`** - Update officer
  - Service method exists: `officersService.update(id, data)`
  - Status: **SERVICE EXISTS**

### DELETE Endpoints
- ⚠️ **DELETE `/api/auth/admin/officers/{id}/`** - Delete officer
  - Service method exists: `officersService.delete(id)`
  - Status: **SERVICE EXISTS**

---

## 🚨 Incidents Management (Partially Implemented)

### GET Endpoints
- ✅ **GET `/api/auth/admin/incidents/`** - List all incidents
  - Used in: `src/app/incidents/page.tsx` (Super Admin)
  - Used in: `src/app/sub-admin/incidents/page.tsx` (Sub-Admin)
  - Service: `incidentsService.getAll()`
  - Status: **WORKING**

- ⚠️ **GET `/api/auth/admin/incidents/{id}/`** - Get incident details
  - Service method exists: `incidentsService.getById(id)`
  - Status: **SERVICE EXISTS**

### POST Endpoints
- ⚠️ **POST `/api/auth/admin/incidents/`** - Create incident
  - Service method exists: `incidentsService.create(data)`
  - Status: **SERVICE EXISTS**

- ⚠️ **POST `/api/auth/admin/incidents/{id}/resolve/`** - Resolve incident
  - Service method exists: `incidentsService.resolve(id, data)`
  - Status: **SERVICE EXISTS**

### PUT/PATCH Endpoints
- ⚠️ **PATCH `/api/auth/admin/incidents/{id}/`** - Update incident
  - Service method exists: `incidentsService.update(id, data)`
  - Status: **SERVICE EXISTS**

### DELETE Endpoints
- ⚠️ **DELETE `/api/auth/admin/incidents/{id}/`** - Delete incident
  - Service method exists: `incidentsService.delete(id)`
  - Status: **SERVICE EXISTS**

---

## 📢 Notifications Management (Partially Implemented)

### GET Endpoints
- ✅ **GET `/api/auth/admin/notifications/`** - List all notifications
  - Used in: `src/app/notifications/page.tsx` (Super Admin)
  - Used in: `src/app/sub-admin/notifications/page.tsx` (Sub-Admin)
  - Service: `notificationsService.getAll()`
  - Status: **WORKING**

- ⚠️ **GET `/api/auth/admin/notifications/{id}/`** - Get notification details
  - Service method exists: `notificationsService.getById(id)`
  - Status: **SERVICE EXISTS**

### POST Endpoints
- ⚠️ **POST `/api/auth/admin/notifications/`** - Create notification
  - Service method exists: `notificationsService.create(data)`
  - Status: **SERVICE EXISTS** (UI has "Send Notification" button)

- ⚠️ **POST `/api/auth/admin/notifications/{id}/send/`** - Send notification
  - Service method exists: `notificationsService.send(id)`
  - Status: **SERVICE EXISTS**

### DELETE Endpoints
- ⚠️ **DELETE `/api/auth/admin/notifications/{id}/`** - Delete notification
  - Service method exists: `notificationsService.delete(id)`
  - Status: **SERVICE EXISTS**

---

## 🎫 Promocodes Management (Fully Implemented)

### GET Endpoints
- ✅ **GET `/api/auth/admin/promocode/`** - List all promocodes
  - Used in: `src/app/promocodes/page.tsx`
  - Service: `promocodesService.getAll()`
  - Status: **WORKING**

- ✅ **GET `/api/auth/admin/promocode/{id}/`** - Get promocode details
  - Used in: View Details modal in promocodes page
  - Service: `promocodesService.getById(id)`
  - Status: **WORKING**

### POST Endpoints
- ⚠️ **POST `/api/auth/admin/promocode/`** - Create promocode
  - Service method exists: `promocodesService.create(data)`
  - Status: **SERVICE EXISTS** (UI has "Create Promocode" button with modal)

### PUT/PATCH Endpoints
- ✅ **PATCH `/api/auth/admin/promocode/{id}/`** - Update promocode
  - Used in: `src/app/promocodes/page.tsx` → Edit modal
  - Service: `promocodesService.update(id, data)`
  - Status: **WORKING** (Full edit modal with form, also used for activate/deactivate toggle)

### DELETE Endpoints
- ⚠️ **DELETE `/api/auth/admin/promocode/{id}/`** - Delete promocode
  - Service method exists: `promocodesService.delete(id)`
  - Status: **SERVICE EXISTS** (Dropdown has delete option)

---

## 📊 Dashboard KPIs (Fully Implemented)

### GET Endpoints
- ✅ **GET `/api/auth/admin/dashboard-kpis/`** - Super Admin dashboard stats
  - Used in: `src/app/dashboard/page.tsx`
  - Direct API call (no service wrapper)
  - Status: **WORKING**

- ✅ **GET `/api/auth/subadmin/dashboard-kpis/`** - Sub-Admin dashboard stats
  - Used in: `src/app/sub-admin/dashboard/page.tsx`
  - Direct API call (no service wrapper)
  - Status: **WORKING**

---

## 📈 Summary Statistics

### ✅ Fully Working (Used in UI)
- **Authentication**: 4/4 endpoints (100%)
  - Login, Register, Logout, Token Refresh

- **Users Management**: 2/4 GET/PUT endpoints
  - List Users, Get User Details, Update User
  - ❌ Missing: Create User (not in UI), Delete User (not implemented)

- **Sub-Admins Management**: 2/4 GET/PUT endpoints
  - List Sub-Admins, Get Sub-Admin Details, Update Sub-Admin
  - ❌ Missing: Create Sub-Admin (not in UI), Delete Sub-Admin (not implemented)

- **Promocodes**: 3/5 endpoints (60%)
  - List Promocodes, Get Promocode Details, Update Promocode
  - ⚠️ Create exists in service with UI modal (needs testing)
  - ⚠️ Delete exists in service but not wired in UI

- **Dashboard KPIs**: 2/2 endpoints (100%)
  - Super Admin KPIs, Sub-Admin KPIs

### ⚠️ Partially Implemented (Service exists, UI incomplete)
- **Geofences**: Service complete, UI may need wiring
- **Officers**: Service complete, UI modal exists
- **Incidents**: Service complete, UI displays data
- **Notifications**: Service complete, UI has send form

### 📊 Overall API Usage
- **Total API Endpoints Defined**: ~50+
- **Fully Working in UI**: ~15 (30%)
- **Service Ready, UI Partial**: ~25 (50%)
- **Not Implemented**: ~10 (20%)

---

## 🎯 Recommended Next Steps

1. **Complete CRUD Operations** for:
   - Promocodes (Create/Edit/Delete)
   - Officers (Create/Edit/Delete)
   - Notifications (Send/Create)
   - Geofences (Create/Edit/Delete)

2. **Add View Details Modals** for:
   - Officers
   - Incidents
   - Notifications
   - Geofences

3. **Implement User Creation** from UI (currently only update is available)

4. **Wire up Delete Operations** with confirmation modals

5. **Add Analytics Pages** (if backend supports)

---

## 📝 Notes

- All authentication flows are fully implemented
- User and Sub-Admin management is read-only with update capability
- Most services have full CRUD methods defined
- UI implementation is focused on viewing and basic updates
- Create/Delete operations mostly exist in services but not wired to UI

