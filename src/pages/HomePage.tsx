import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Frown, Loader2, ChefHat, Plus, Utensils, Heart } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Button } from '../components/ui/button';
import RecipeCard from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';

interface Recipe {
  _id: string;
  title: string;
  image: string;
  averageRating: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const HomePage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { request } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const data = await request<Recipe[]>({ url: '/recipes', method: 'GET' });
        if (data) {
          setRecipes(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [request]);

  const retryFetch = () => {
    setLoading(true);
    setError(false);
    // Trigger the effect again
    window.location.reload();
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                className="mb-6"
              >
                <ChefHat className="w-20 h-20 text-compass-primary mx-auto" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-2xl font-playfair font-semibold text-gray-800 mb-2">
                  Cooking up something delicious...
                </h2>
                <p className="text-gray-600">We're gathering the best recipes for you</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto"
            >
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Frown className="w-16 h-16 text-red-400 mx-auto mb-6" />
              </motion.div>
              
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 mb-4">
                Oops! Kitchen Error
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We're having trouble connecting to our recipe database. 
                Our chefs are working on it!
              </p>
              
              <div className="space-y-3">
                <Button 
                  onClick={retryFetch} 
                  className="w-full bg-compass-primary text-white hover:bg-orange-600 h-12 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                >
                  <Loader2 className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/add-recipe')}
                  className="w-full border-2 border-compass-primary text-compass-primary hover:bg-compass-primary hover:text-white h-12 rounded-xl font-medium transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your Recipe
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State (No Recipes)
  if (recipes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-12 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                className="mb-8"
              >
                <div className="relative">
                  <Utensils className="w-24 h-24 text-gray-300 mx-auto" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="absolute -bottom-2 -right-2 bg-compass-primary rounded-full p-3"
                  >
                    <Heart className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-6">
                  Welcome to RecipeCompass
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  It looks like our recipe collection is empty! Be the first to share 
                  your favorite recipes with the community.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-4"
              >
                <Button 
                  onClick={() => navigate('/add-recipe')}
                  className="bg-gradient-to-r from-compass-primary to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Share Your First Recipe
                </Button>
              </motion.div>
            </div>
            
            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <ChefHat className="w-12 h-12 text-compass-primary mx-auto mb-4" />
                <h3 className="font-playfair font-semibold text-lg mb-2">Share Recipes</h3>
                <p className="text-gray-600 text-sm">Upload your favorite recipes with photos and detailed instructions</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Heart className="w-12 h-12 text-compass-primary mx-auto mb-4" />
                <h3 className="font-playfair font-semibold text-lg mb-2">Rate & Review</h3>
                <p className="text-gray-600 text-sm">Discover amazing recipes and share your cooking experiences</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <Utensils className="w-12 h-12 text-compass-primary mx-auto mb-4" />
                <h3 className="font-playfair font-semibold text-lg mb-2">Cook Together</h3>
                <p className="text-gray-600 text-sm">Join a community of food lovers and cooking enthusiasts</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success State (With Recipes)
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 mb-4">
            Popular Recipes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing recipes shared by our community of food lovers
          </p>
          <div className="mt-8">
            <Button 
              onClick={() => navigate('/add-recipe')}
              className="bg-compass-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your Recipe
            </Button>
          </div>
        </motion.div>

        {/* Recipe Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {recipes.map((recipe) => (
            <motion.div key={recipe._id} variants={itemVariants}>
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <h3 className="font-playfair font-semibold text-2xl text-gray-800 mb-2">
              {recipes.length}
            </h3>
            <p className="text-gray-600">
              Delicious {recipes.length === 1 ? 'Recipe' : 'Recipes'} Available
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;