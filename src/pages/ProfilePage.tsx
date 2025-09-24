// File: src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User2, Heart, CookingPot, Loader2, Frown } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import RecipeCard from '../components/RecipeCard';
import { Separator } from '../components/ui/separator';

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
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "linear", repeat: Infinity }}
        >
          <Loader2 className="w-16 h-16 text-compass-primary" />
        </motion.div>
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
        <Frown className="w-16 h-16 text-destructive" />
        <h2 className="text-2xl font-semibold mt-4">Failed to load profile</h2>
        <p className="text-gray-600 mt-2">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-10 text-center"
      >
        <User2 className="w-20 h-20 mx-auto text-gray-400 mb-4" />
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-2">{userProfile.username}</h1>
        <p className="text-gray-600 font-poppins">{userProfile.email}</p>
      </motion.div>
      
      <Separator className="my-10 bg-gray-200" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8"
      >
        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-800 mb-6">
          <CookingPot />
          <h2>My Published Recipes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userProfile.recipes.length > 0 ? (
            userProfile.recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))
          ) : (
            <p className="text-gray-500 font-poppins col-span-full text-center">You haven't published any recipes yet.</p>
          )}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-10"
      >
        <div className="flex items-center space-x-2 text-xl font-semibold text-gray-800 mb-6">
          <Heart />
          <h2>My Favorite Recipes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userProfile.favorites.length > 0 ? (
            userProfile.favorites.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))
          ) : (
            <p className="text-gray-500 font-poppins col-span-full text-center">You have no favorite recipes yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
