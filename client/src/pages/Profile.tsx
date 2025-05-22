import React, { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import UserProfile from '@/components/UserProfile';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { refreshUser } = useAuth();
  
  // Refresh user data when profile page loads
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-background">
        <UserProfile />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;