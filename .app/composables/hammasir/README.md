# Public Counselors Module

This module provides functionality for users to browse and connect with counselors.

## Features

1. **Counselor Browsing**
   - View public counselor profiles
   - Search counselors by name or specialization
   - Pagination support

2. **Counselor Details**
   - View detailed public counselor profiles
   - Check counselor availability
   - View available time slots

3. **Connection Requests**
   - Request to connect with counselors
   - Manage counselor connections

4. **Specializations**
   - Browse counselor specializations
   - Filter counselors by specialization

5. **Client Management** (Counselor only)
   - View list of connected clients
   - Manage client connections
   - Add notes and goals for clients

## Files Structure

```
composables/hammasir/
├── usePublicCounselors.ts        # Main composable for public counselor functionality
├── useProfileCounselor.ts        # Composable for counselor profile management
├── useMyClients.ts              # Composable for counselor client management
├── index.ts                      # Export file
├── usePublicCounselors.example.ts # Usage examples for public counselors
├── useProfileCounselor.example.ts # Usage examples for counselor profile
├── useMyClients.example.ts      # Usage examples for counselor clients
├── usePublicCounselors.test.ts    # Test file for public counselors
├── useProfileCounselor.test.ts    # Test file for counselor profile
└── useMyClients.test.ts         # Test file for counselor clients
```

## Usage

### Public Counselors Composable

```typescript
import { usePublicCounselors } from '~/composables/hammasir/usePublicCounselors'

const {
  // State
  publicCounselorsState,
  counselorsError,
  isCounselorsLoading,
  
  // Computed
  publicCounselorsList,
  currentPublicCounselor,
  
  // Methods
  getPublicCounselors,
  getPublicCounselorById,
  getCounselorAvailability,
  getAvailableTimeSlots,
  requestCounselorConnection,
  getSpecializations
} = usePublicCounselors()
```

### Counselor Profile Composable

```typescript
import { useProfileCounselor } from '~/composables/hammasir/useProfileCounselor'

const {
  // State
  counselorProfileState,
  profileError,
  isProfileLoading,
  isProfileUpdating,
  
  // Computed
  currentCounselorProfile,
  
  // Methods
  getMyCounselorProfile,
  updateMyCounselorProfile,
  updatePersonalInfo,
  updateProfessionalInfo,
  updateSpecializations,
  updateAvailability,
  updateRates
} = useProfileCounselor()
```

### My Clients Composable (Counselor only)

```typescript
import { useMyClients } from '~/composables/hammasir/useMyClients'

const {
  // State
  myClientsState,
  clientsError,
  isClientsLoading,
  isClientsUpdating,
  
  // Computed
  myClientsList,
  currentClient,
  currentClientLink,
  clientNotes,
  clientGoals,
  
  // Methods
  getMyClients,
  getClientById,
  getClientLink,
  updateClientLink,
  getClientNotes,
  addClientNote,
  getClientGoals,
  addClientGoal,
  updateClientGoal
} = useMyClients()
```

## API Integration

The module integrates with the following API endpoints:

### Public Counselors
- `GET /api/v1/counselor/public` - List public counselors
- `GET /api/v1/counselor/public/{id}` - Get public counselor by ID
- `GET /api/v1/counselor/public/{id}/availability` - Get counselor availability
- `GET /api/v1/counselor/public/{id}/availability/slots` - Get available time slots
- `POST /api/v1/counselor/connections` - Request counselor connection
- `GET /api/v1/counselor/specializations` - List specializations

### Counselor Profile
- `GET /api/v1/counselor/me` - Get current counselor profile
- `PUT /api/v1/counselor/me` - Update current counselor profile
- `PUT /api/v1/counselor/me/personal-info` - Update counselor personal info
- `PUT /api/v1/counselor/me/professional-info` - Update counselor professional info
- `PUT /api/v1/counselor/me/specializations` - Update counselor specializations
- `PUT /api/v1/counselor/me/availability` - Update counselor availability
- `PUT /api/v1/counselor/me/rates` - Update counselor rates

### My Clients (Counselor only)
- `GET /api/v1/counselor/me/clients` - List counselor clients
- `GET /api/v1/counselor/me/clients/{id}` - Get client by ID
- `GET /api/v1/counselor/me/clients/{id}/link` - Get client connection link
- `PATCH /api/v1/counselor/me/clients/{id}/link` - Update client connection link
- `GET /api/v1/counselor/me/clients/{id}/notes` - Get client notes
- `POST /api/v1/counselor/me/clients/{id}/notes` - Add client note
- `GET /api/v1/counselor/me/clients/{id}/goals` - Get client goals
- `POST /api/v1/counselor/me/clients/{id}/goals` - Add client goal
- `PATCH /api/v1/counselor/me/clients/{id}/goals/{goalId}` - Update client goal

## Permissions

This module is publicly accessible for browsing counselors. Some actions like requesting connections require user authentication. Counselor profile management and client management require counselor authentication.