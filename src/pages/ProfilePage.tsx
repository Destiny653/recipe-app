// File: src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User2, Heart, CookingPot, Loader2, Frown, LogOut} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import RecipeCard from '../components/RecipeCard';
import { Separator } from '../components/ui/separator';
// import { useToast } from '../hooks/use-toast';

interface Recipe {
  _id: string;
  title: string;
  image: string;
  averageRating: number;
}

interface UserProfile {
  username: string;
  email: string;
  recipes: Recipe[];
  favorites: Recipe[];
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { request } = useApi();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const data = await request<UserProfile>({ url: '/users/profile', method: 'GET' });
      if (data) {
        setUserProfile(data);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [request]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] pt-24">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "linear", repeat: Infinity }}
        >
          <Loader2 className="w-16 h-16 text-compass-primary" />
        </motion.div>
        <p className="mt-4 text-gray-600">Loading your profile...</p>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4 pt-24">
        <Frown className="w-16 h-16 text-destructive" />
        <h2 className="text-2xl font-semibold mt-4">Failed to load profile</h2>
        <p className="text-gray-600 mt-2">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
      {/* Profile Header */}
      <div
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center mb-8"
      >
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <User2 className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-gray-800 mb-2">
            {userProfile.username}
          </h1>
          <p className="text-gray-600 font-poppins text-sm md:text-base mb-4">
            {userProfile.email}
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-4 sm:py-4 rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Recipes Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Published Recipes Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CookingPot className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-playfair font-semibold text-gray-800">
              My Published Recipes
            </h2>
          </div>
          
          <Separator className="mb-6 bg-gray-200" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.isArray(userProfile.recipes) && userProfile.recipes.length > 0 ? (
              userProfile.recipes.map((recipe) => (
                <div key={recipe._id} className="flex-1 min-w-0">
                  <RecipeCard recipe={recipe} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <CookingPot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-poppins">
                  You haven't published any recipes yet.
                </p>
              </div>
            )}
          </div>
        </motion.section>
        
        {/* Favorite Recipes Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-50 rounded-lg">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-playfair font-semibold text-gray-800">
              My Favorite Recipes
            </h2>
          </div>
          
          <Separator className="mb-6 bg-gray-200" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.isArray(userProfile.favorites) && userProfile.favorites.length > 0 ? (
              userProfile.favorites.map((recipe) => (
                <div key={recipe._id} className="flex-1 min-w-0">
                  <RecipeCard recipe={recipe} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-poppins">
                  You have no favorite recipes yet.
                </p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ProfilePage;