import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Flame, Utensils, Star, Heart, Loader2, Frown, StarHalf, User } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  preparationSteps: string[];
  cookingTime: number;
  calories: number;
  difficulty: string;
  cuisine: string;
  diet: string;
  author: {
    username: string;
  };
  averageRating: number;
}

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { request } = useApi();
  const { toast } = useToast();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const fetchRecipe = async () => {
      setLoading(true);
      const data = await request<Recipe>({
        url: `/recipes/${id}`,
        method: 'GET'
      });
      if (data) {
        setRecipe(data);
        checkIfFavorited(data);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    const checkIfFavorited = async (recipeData: Recipe) => {
      if (!token) return;
      const profile = await request<{ favorites: string[] }>({ url: '/users/profile', method: 'GET' });
      if (profile) {
        setIsFavorited(profile.favorites.includes(recipeData._id));
      }
    };
    
    if (id) {
      fetchRecipe();
    }
  }, [id, request]);

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to add recipes to your favorites.",
        variant: "destructive",
      });
      return;
    }
    const endpoint = isFavorited ? `/users/favorites/remove/${id}` : `/users/favorites/add/${id}`;
    const data = await request({ url: endpoint, method: 'PUT' });
    if (data) {
      setIsFavorited(!isFavorited);
      toast({
        title: "Success",
        description: isFavorited ? "Recipe removed from favorites!" : "Recipe added to favorites!",
      });
    }
  };

  const handleRating = async (rating: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to rate recipes.",
        variant: "destructive",
      });
      return;
    }
    const data = await request({ url: `/recipes/${id}/rate`, method: 'POST', data: { rating } });
    if (data) {
      toast({
        title: "Thank you!",
        description: "Your rating has been submitted.",
      });
      const updatedRecipe = await request<Recipe>({ url: `/recipes/${id}`, method: 'GET' });
      if (updatedRecipe) {
        setRecipe(updatedRecipe);
      }
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const isActive = i <= rating;
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''} ${isActive ? 'text-compass-primary fill-compass-primary' : 'text-gray-300'}`}
          onClick={interactive ? () => handleRating(i) : undefined}
        />
      );
    }
    return stars;
  };

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
        <p className="mt-4 text-gray-600">Finding your perfect recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4 pt-24">
        <Frown className="w-16 h-16 text-destructive" />
        <h2 className="text-2xl font-semibold mt-4">Recipe Not Found</h2>
        <p className="text-gray-600 mt-2">
          It looks like this recipe either doesn't exist or was removed.
        </p>
        <Button onClick={() => navigate('/')} className="mt-4 bg-compass-primary hover:bg-orange-600 py-8 sm:py-6">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 pt-24">
      {/* Changed max-w-4xl to max-w-6xl for wider card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8 font-poppins max-w-6xl mx-auto">
        <div className="md:flex md:space-x-8 items-start">
          {/* Image and quick details section */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            <motion.img
              src={`http://localhost:5000${recipe.image}`}
              alt={recipe.title}
              className="w-full h-auto rounded-2xl object-cover shadow-md"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            <div className="mt-6 p-4 bg-gray-50 rounded-xl shadow-inner border border-gray-100 grid grid-cols-2 sm:grid-cols-2 gap-4 text-gray-700">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-sm md:text-base">{recipe.cookingTime} min</span>
              </div>
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-gray-500" />
                <span className="text-sm md:text-base">{recipe.calories} kcal</span>
              </div>
              <div className="flex items-center space-x-2">
                <Utensils className="w-5 h-5 text-gray-500" />
                <span className="text-sm md:text-base capitalize">{recipe.difficulty}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm md:text-base">by {recipe.author?.username || 'Guest'}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                {renderStars(Math.round(recipe.averageRating))}
                <span className="ml-2 text-sm text-gray-600">
                    {recipe.averageRating > 0 ? `${recipe.averageRating.toFixed(1)}/5` : 'No ratings yet'}
                </span>
              </div>
              {isLoggedIn && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Rate this recipe:</span>
                  {renderStars(0, true)}
                </div>
              )}
              <Button
                onClick={handleFavorite}
                className={`w-full transition-colors rounded-xl font-bold py-8 sm:py-6 ${isFavorited ? 'bg-red-500 hover:bg-red-600' : 'bg-compass-primary hover:bg-orange-600'} text-white`}
              >
                <Heart className="w-5 h-5 mr-2" />
                {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>
          </div>

          {/* Recipe content section */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 leading-tight">{recipe.title}</h1>
            <p className="mt-2 text-xl text-gray-600 leading-relaxed">{recipe.description}</p>
            <Separator className="my-8 bg-gray-200" />
            
            <div className="mt-8">
              <h2 className="text-2xl font-semibold font-playfair text-gray-800">Ingredients</h2>
              <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
                {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-semibold font-playfair text-gray-800">Preparation</h2>
              <ol className="list-decimal list-inside mt-2 text-gray-700 space-y-2">
                {Array.isArray(recipe.preparationSteps) && recipe.preparationSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;