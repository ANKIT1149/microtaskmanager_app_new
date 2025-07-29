import { auth } from './Firebase';

export const CheckUser = async () => {
  try {
    const user = await auth.currentUser;

    if (user) {
      const userId = user.uid;
      return userId;
    } else {
        throw new Error('No user is currently logged in');
    }
  } catch (error) {
    console.error('Error checking user:', error);
    throw new Error('Failed to check user status');
  }
};
