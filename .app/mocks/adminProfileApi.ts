// Mock API endpoints for testing admin profile functionality

// This would typically be implemented on your backend server

// GET /api/v1/profile/all
// Get all user profiles (admin only)
export const mockGetAllProfiles = (page = 1, limit = 10, search = '', status = '') => {
  // In a real implementation, this would query your database
  // For now, we'll return mock data

  const mockProfiles = [
    {
      id: '1',
      userId: 'user1',
      personalInfo: {
        id: '1',
        firstName: 'علی',
        lastName: 'احمدی',
        email: 'ali@example.com',
        phoneNumber: '09123456789',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
      },
      demographics: {
        id: '1',
        education: [],
        occupation: [],
        location: [],
      },
      preferences: {
        id: '1',
        communication: {
          email: true,
          sms: true,
        },
      },
      privacySettings: {
        id: '1',
        isProfileVisibleToCounselors: true,
        isProfileVisibleToOtherUsers: true,
        allowDataAnalysisForMatching: true,
      },
      status: 'ACTIVE',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      userId: 'user2',
      personalInfo: {
        id: '2',
        firstName: 'سارا',
        lastName: 'کریمی',
        email: 'sara@example.com',
        phoneNumber: '09123456788',
        dateOfBirth: '1992-05-15',
        gender: 'FEMALE',
      },
      demographics: {
        id: '2',
        education: [],
        occupation: [],
        location: [],
      },
      preferences: {
        id: '2',
        communication: {
          email: true,
          sms: false,
        },
      },
      privacySettings: {
        id: '2',
        isProfileVisibleToCounselors: true,
        isProfileVisibleToOtherUsers: false,
        allowDataAnalysisForMatching: false,
      },
      status: 'PENDING_VERIFICATION',
      createdAt: '2023-02-01T00:00:00Z',
      updatedAt: '2023-02-01T00:00:00Z',
    },
    {
      id: '3',
      userId: 'user3',
      personalInfo: {
        id: '3',
        firstName: 'محمد',
        lastName: 'رضایی',
        email: 'mohammad@example.com',
        phoneNumber: '09123456787',
        dateOfBirth: '1985-10-20',
        gender: 'MALE',
      },
      demographics: {
        id: '3',
        education: [],
        occupation: [],
        location: [],
      },
      preferences: {
        id: '3',
        communication: {
          email: false,
          sms: true,
        },
      },
      privacySettings: {
        id: '3',
        isProfileVisibleToCounselors: false,
        isProfileVisibleToOtherUsers: false,
        allowDataAnalysisForMatching: true,
      },
      status: 'SUSPENDED',
      createdAt: '2023-03-01T00:00:00Z',
      updatedAt: '2023-03-01T00:00:00Z',
    },
  ]

  // Filter by search term
  let filtered = mockProfiles
  if (search) {
    const term = search.toLowerCase()
    filtered = mockProfiles.filter(profile =>
      (profile.personalInfo.firstName.toLowerCase().includes(term))
      || (profile.personalInfo.lastName.toLowerCase().includes(term))
      || (profile.personalInfo.email.toLowerCase().includes(term)),
    )
  }

  // Filter by status
  if (status) {
    filtered = filtered.filter(profile => profile.status === status)
  }

  // Paginate results
  const start = (page - 1) * limit
  const end = start + limit
  const paginated = filtered.slice(start, end)

  return {
    profiles: paginated,
    total: filtered.length,
    page: page,
  }
}

// GET /api/v1/profile/admin/:userId
// Get specific user profile by ID (admin only)
export const mockGetProfileById = (userId) => {
  // In a real implementation, this would query your database for the specific user
  const mockProfiles = mockGetAllProfiles().profiles
  const profile = mockProfiles.find(p => p.userId === userId)

  if (!profile) {
    throw new Error('Profile not found')
  }

  return profile
}

// PATCH /api/v1/profile/admin/:userId/status
// Update user status (admin only)
export const mockUpdateUserStatus = (userId, statusData) => {
  // In a real implementation, this would update the user's status in your database
  const profile = mockGetProfileById(userId)

  // Update the status
  profile.status = statusData.status
  profile.updatedAt = new Date().toISOString()

  return profile
}
