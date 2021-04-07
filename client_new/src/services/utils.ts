export interface UserProfile {
  firstName: string,
  lastName: string
}


export const getInitials = (userProfile: UserProfile) => {
  if (userProfile && userProfile?.firstName?.length > 0 && userProfile?.lastName?.length > 0) {
    return `${userProfile?.firstName?.substring(0, 1)}${userProfile?.lastName?.substring(0, 1)}`;
  }
  return userProfile;

}

export const getUsername = (userProfile: UserProfile) => {
  if (userProfile && userProfile.firstName.length > 0 && userProfile.lastName.length > 0) {
    return `${userProfile.firstName} ${userProfile.lastName}`;
  }
}
