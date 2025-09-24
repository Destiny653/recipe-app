import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, StarHalf, Clock, Flame, Utensils, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
// import { useToast } from '../hooks/use-toast';

interface RecipeCardProps {
  recipe: {
    _id: string;
    title: string;
    image: string;
    averageRating?: number;
    cookingTime?: number;
    calories?: number;
    difficulty?: string;
    author?: {
      username: string;
    };
  };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const averageRating = recipe.averageRating ? Math.round(recipe.averageRating * 10) / 10 : 0;
  const [imageSrc, setImageSrc] = useState(
    recipe.image.startsWith('/images/') ? recipe.image : `https://recipe-server-y83k.onrender.com/${recipe.image}`
  );
  const [user, setUser] = useState<any>(null);
  console.log(user)

  const { request } = useApi();
  const { isAuthenticated, token } = useAuth();
  // const toast = useToast();

  useEffect(() => {
    if (isAuthenticated && token) {
      const fetchUserProfile = async () => {
        try {
          const userData = await request({ url: '/users/profile', method: 'GET' });
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      };
      fetchUserProfile();
    }
  }, [isAuthenticated, token, request]);
  
  const handleImageError = () => {
    // Fallback to a placeholder image if the main image fails to load
    setImageSrc('https://placehold.co/600x400/FEE2E2/B91C1C?text=Image+Not+Found');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 text-compass-primary fill-compass-primary" />);
    }
    
    // Render half star if applicable
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 text-compass-primary fill-compass-primary" />);
    }

    // Render empty stars
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <Link to={`/recipe/${recipe._id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
        className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-300">
          <motion.img
            src={imageSrc}
            alt={recipe.title}
            className="w-56 h-56 rounded-full object-cover object-center mx-auto mt-4 transition-transform duration-500"
            whileHover={{ scale: 1.1 }}
            onError={handleImageError}
          />
          <CardHeader className="p-4 flex-grow">
            <CardTitle className="text-xl font-bold text-gray-800 truncate font-playfair">
              {recipe.title}
            </CardTitle>
            <CardDescription className="flex items-center space-x-1 mt-1">
              {renderStars(averageRating)}
              <span className="ml-2 text-sm text-gray-600">
                {averageRating > 0 ? `${averageRating}/5` : 'No ratings yet'}
              </span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 pt-0">
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
              {recipe.cookingTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cookingTime} min</span>
                </div>
              )}
              {recipe.calories && (
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4" />
                  <span>{recipe.calories} kcal</span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center space-x-1">
                  <Utensils className="w-4 h-4" />
                  <span>{recipe.difficulty}</span>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 pt-0 flex items-center space-x-2 text-gray-500 text-sm">
            <User className="w-4 h-4" />
            <span>by {recipe.author?.username || 'Guest'}</span>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};

export default RecipeCard;