export type MetaObj = {
  avatarUrl: string;
  expiry: string;
  isNew: boolean;
  email: string;
  name: string;
};
export type User = {
  id?: string;
  username: string;
  email: string;
  hasCharge: boolean;
  startChargeTime: string;
  expireChargeTime: string;
  role: string;
  avatar?: string; // فیلد آواتار محلی
  meta: MetaObj;
  phoneNumber: string;
  zones: string[]; // Multi-select zones attribute
};

export function useUser() {
  const nuxtApp = useNuxtApp();
  const user = useLocalStorage('user', {} as User);
  const role = useLocalStorage('role', '');

  // Function to update user zones in PocketBase if empty
  const updateEmptyZonesInDatabase = async (userData: User) => {
    if (!userData || !userData.id) {
      console.error('User data or user ID is missing');
      return userData;
    }
    
    if (!userData.zones || (Array.isArray(userData.zones) && userData.zones.length === 0)) {
      try {
        await nuxtApp.$pb.collection('users').update(userData.id as string, {
          zones: ['hamdel'],
        });

        const updatedUser = {
          ...userData,
          zones: ['hamdel'],
        };
        user.value = updatedUser;
        return updatedUser;
      }
 catch (error) {
        console.error(error);
      }
    }
    return userData;
  };

  const getAllUsers = async () => {
    return await nuxtApp.$pb.collection('users').getFullList({
      sort: '-created',
    });
  };

  const setUser = async (u: User, r: string) => {
    user.value = u;
    role.value = r;
    return user;
  };

  const updateUser = async (u: User) => {
    const result = await nuxtApp.$pb.collection('users').update(u.id as string, u);
    // Ensure zones are included in the updated user object
    user.value = result;
    return result;
  };

  const getUserById = async (id: string) => {
    if (role.value !== 'admin') {
      throw new Error('Admin access required');
    }
    return await nuxtApp.$pb.collection('users').getOne(id);
  };

  const updateUserZonesById = async (id: string, zones: string[]) => {
    if (role.value !== 'admin') {
      throw new Error('Admin access required');
    }
    return await nuxtApp.$pb.collection('users').update(id, { zones });
  };

  const logout = async () => {
    user.value = {} as User;
    role.value = '';
    nuxtApp.$pb.authStore.clear();
  };

  return {
    user,
    role,
    getAllUsers,
    setUser,
    updateUser,
    getUserById,
    updateUserZonesById,
    updateEmptyZonesInDatabase,
    logout,
  };
}
