import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { UserRound, Mail, Building, MapPin, Calendar, Save, X, Camera, Loader2 } from 'lucide-react';
import UserReports from './UserReports';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { updateProfile, uploadAvatar, getProfile } from '@/services/api';

type ProfileFormValues = {
  fullName: string;
  email: string;
  organization: string;
  location: string;
}

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  
  // User data state that combines auth data with profile preferences
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    organization: "NeurAI Technologies",
    location: "Not specified",
    joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
    role: "User",
    avatar: "/placeholder.svg"
  });

  // Initialize user data from auth context and server
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          // First set data from auth context for immediate display
          setUserData(prevData => ({
            ...prevData,
            fullName: user.name,
            email: user.email,
            role: user.userType === 'healthcare' ? 'Healthcare Provider' : 'Patient',
            // Use localStorage as fallback
            avatar: localStorage.getItem('userAvatar') || prevData.avatar,
            organization: localStorage.getItem('userOrganization') || prevData.organization,
            location: localStorage.getItem('userLocation') || prevData.location
          }));
          
          // Then fetch complete profile from server
          const response = await getProfile();
          
          if (response.success && response.profile) {
            // Update with server data
            const profileData = response.profile;
            
            setUserData(prevData => ({
              ...prevData,
              fullName: profileData.name,
              email: profileData.email,
              role: profileData.userType === 'healthcare' ? 'Healthcare Provider' : 'Patient',
              organization: profileData.organization || prevData.organization,
              location: profileData.location || prevData.location,
              avatar: profileData.avatar 
                ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${profileData.avatar}` 
                : prevData.avatar,
              joinDate: new Date(profileData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
            }));
            
            // Update localStorage
            if (profileData.organization) localStorage.setItem('userOrganization', profileData.organization);
            if (profileData.location) localStorage.setItem('userLocation', profileData.location);
            if (profileData.avatar) {
              const avatarUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${profileData.avatar}`;
              localStorage.setItem('userAvatar', avatarUrl);
            }
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
          // Continue with data from auth context and localStorage
        }
      }
    };
    
    fetchProfileData();
  }, [user]);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: userData.fullName,
      email: userData.email,
      organization: userData.organization,
      location: userData.location
    }
  });
  
  // Update form values when userData changes
  useEffect(() => {
    form.reset({
      fullName: userData.fullName,
      email: userData.email,
      organization: userData.organization,
      location: userData.location
    });
  }, [userData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Use the API to update profile on the server
      const result = await updateProfile({
        fullName: data.fullName,
        email: data.email,
        organization: data.organization,
        location: data.location
      });
      
      if (result.success) {
        // Update local state with the server response
        setUserData({
          ...userData,
          fullName: data.fullName,
          email: data.email,
          organization: data.organization,
          location: data.location
        });
        
        // Update local storage for persistence
        localStorage.setItem('userOrganization', data.organization);
        localStorage.setItem('userLocation', data.location);
        
        // Update the auth context user name if it changed
        if (user && data.fullName !== user.name) {
          const updatedUser = {...user, name: data.fullName};
          localStorage.setItem('user', JSON.stringify(updatedUser));
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile data:', error);
      toast({
        title: "Profile update failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const cancelEditing = () => {
    form.reset();
    setIsEditing(false);
  };
  
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image should be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload the file to the server
      const response = await uploadAvatar(file);
      
      if (response.success) {
        // Get the avatar path returned from the server
        const avatarPath = response.avatarUrl;
        
        // Get the full avatar URL for UI display
        const avatarUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${avatarPath}`;
        
        // Store it in localStorage for quick access
        localStorage.setItem('userAvatar', avatarUrl);
        
        // Update the UI
        setUserData({
          ...userData,
          avatar: avatarUrl
        });
        
        // Update the user object in localStorage and sessionStorage
        const userFromStorage = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userFromStorage) {
          const userObj = JSON.parse(userFromStorage);
          userObj.avatar = avatarPath; // Store the path, not the full URL
          
          // Update both storages to ensure it's available wherever user logged in
          localStorage.setItem('user', JSON.stringify(userObj));
          sessionStorage.setItem('user', JSON.stringify(userObj));
        }
        
        // Refresh the user data in the auth context
        await refreshUser();
        
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully.",
        });
      } else {
        throw new Error(response.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast({
        title: "Error updating profile picture",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">User Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userData.avatar} alt={userData.fullName} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {userData.fullName.split(' ').map(name => name?.[0] || '').join('')}
                </AvatarFallback>
              </Avatar>
              
              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              
              {/* Camera icon button for uploading new profile pic */}
              <Button 
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                onClick={handleProfilePictureClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground">{userData.fullName}</h2>
            <p className="text-muted-foreground">{userData.email}</p>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Badge variant="secondary" className="text-accent-foreground bg-accent/10">
              {userData.role}
            </Badge>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joined {userData.joinDate}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="w-full"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </CardFooter>
        </Card>

        {/* Profile Details / Edit Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">
              {isEditing ? "Edit Your Information" : "Profile Information"}
            </h2>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <UserRound className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="Your full name" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="Your email address" type="email" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {userData.role === 'Healthcare Provider' && (
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input {...field} placeholder="Your organization" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input {...field} placeholder="Your location" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-3">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelEditing} className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center border-b border-border pb-4">
                  <UserRound className="mr-4 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">{userData.fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-center border-b border-border pb-4">
                  <Mail className="mr-4 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{userData.email}</p>
                  </div>
                </div>
                
                {userData.role === 'Healthcare Provider' && (
                  <div className="flex items-center border-b border-border pb-4">
                    <Building className="mr-4 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Organization</p>
                      <p className="font-medium text-foreground">{userData.organization}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <MapPin className="mr-4 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{userData.location}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Reports Section */}
      <div className="mt-8">
        <UserReports />
      </div>
    </div>
  );
};

export default UserProfile;
