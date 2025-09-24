import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Frown, Loader2, ChefHat, Plus, Utensils, Heart, Search, Star, Clock, Users, ChevronRight, Drumstick, Pizza, Coffee, Sprout, Soup } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import RecipeCard from '../components/RecipeCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

interface Recipe {
  _id: string;
  title: string;
  image: string;
  averageRating: number;
  cookingTime?: number;
  calories?: number;
  difficulty?: string;
  author?: {
    username: string;
  };
}

interface Cuisine {
  name: string;
  icon: React.ElementType;
  colors: { bg: string; text: string; };
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
  const { isAuthenticated, setShowAuthModal } = useAuth();

  // Dummy data for new sections
  const featuredRecipes: Recipe[] = [
    {
      _id: 'featured-1',
      title: 'Spaghetti Carbonara',
      image: '/images/spaghetti.png',
      averageRating: 4.8,
      cookingTime: 25,
      calories: 650,
      difficulty: 'Easy',
      author: { username: 'Chef Italian' }
    },
    {
      _id: 'featured-2',
      title: 'Classic Tacos',
      image: '/images/tacos.png',
      averageRating: 4.5,
      cookingTime: 30,
      calories: 550,
      difficulty: 'Medium',
      author: { username: 'Maria S' }
    },
    {
      _id: 'featured-3',
      title: 'Thai Green Curry',
      image: '/images/green-curry.png',
      averageRating: 4.9,
      cookingTime: 40,
      calories: 720,
      difficulty: 'Hard',
      author: { username: 'ThaiSpice' }
    },
    {
      _id: 'featured-4',
      title: 'French Onion Soup',
      image: '/images/onion-soup.png',
      averageRating: 4.7,
      cookingTime: 50,
      calories: 400,
      difficulty: 'Medium',
      author: { username: 'ParisianBistro' }
    },
  ];

  const cuisines: Cuisine[] = [
    { name: 'Italian', icon: Pizza, colors: { bg: 'from-orange-400 to-red-500', text: 'text-white' } },
    { name: 'Mexican', icon: Utensils, colors: { bg: 'from-red-600 to-amber-500', text: 'text-white' } },
    { name: 'Asian', icon: Utensils, colors: { bg: 'from-yellow-500 to-orange-600', text: 'text-white' } },
    { name: 'American', icon: Drumstick, colors: { bg: 'from-blue-400 to-blue-600', text: 'text-white' } },
    { name: 'French', icon: Coffee, colors: { bg: 'from-rose-500 to-purple-600', text: 'text-white' } },
    { name: 'Vegetarian', icon: Sprout, colors: { bg: 'from-lime-500 to-rose-400', text: 'text-white' } },
    { name: 'Soups', icon: Soup, colors: { bg: 'from-amber-400 to-red-500', text: 'text-white' } },
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await request<{ recipes: Recipe[] }>({ url: '/recipes', method: 'GET' });
        if (data && data.recipes && Array.isArray(data.recipes)) {
          setRecipes(data.recipes);
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
    window.location.reload();
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="flex flex-col items-center justify-center min-h-[80vh] pt-24">
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
              <Loader2 className="w-16 h-16 text-compass-primary mx-auto" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 mb-2">
                Loading recipes...
              </h2>
              <p className="text-gray-600">We're gathering the best recipes for you</p>
            </motion.div>
          </motion.div>
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
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/add-recipe');
                    } else {
                      setShowAuthModal(true);
                    }
                  }}
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

  // No Data State
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
            <div className="bg-white rounded-3xl shadow-2xl p-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                className="mb-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="absolute -bottom-2 -right-2 bg-compass-primary rounded-full p-2"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4">
                  No Recipes Found
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Be the first to share your delicious recipes with our community!
                  Your culinary creations are waiting to inspire others.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-4"
              >
                <Button
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/add-recipe');
                    } else {
                      setShowAuthModal(true);
                    }
                  }}
                  className="bg-gradient-to-r from-compass-primary to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Share Your First Recipe
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Success State (With Recipes)
  return (
    <main>
      <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')` }}>
        <section className="min-h-screen bg-white bg-opacity-80 backdrop-blur-sm">
          <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-8"
                >
                  <ChefHat className="w-20 h-20 text-compass-primary mx-auto mb-6" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-playfair font-bold text-gray-800 mb-6 leading-tight"
                >
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-compass-primary to-red-500 bg-clip-text text-transparent">
                    RecipeCompass
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
                >
                  Discover, share, and create amazing recipes from around the world.
                  Join our community of passionate food lovers and home chefs.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
                >
                  <Button
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate('/add-recipe');
                      } else {
                        setShowAuthModal(true);
                      }
                    }}
                    className="bg-gradient-to-r from-compass-primary to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Share Your Recipe
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('recipes-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="border-2 border-compass-primary text-compass-primary hover:bg-compass-primary hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Explore Recipes
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-compass-primary to-red-500 rounded-full p-4">
                      <Utensils className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{recipes.length}+</h3>
                  <p className="text-gray-600">Delicious Recipes</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-compass-primary to-red-500 rounded-full p-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">1K+</h3>
                  <p className="text-gray-600">Happy Cooks</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-compass-primary to-red-500 rounded-full p-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">4.8</h3>
                  <p className="text-gray-600">Average Rating</p>
                </div>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </section>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800">
              Top Rated Recipes
            </h2>
            <Button variant="ghost" className="text-compass-primary hover:underline transition-colors">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRecipes.map((recipe) => (
              <motion.div key={recipe._id} variants={itemVariants}>
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div id="recipes-section" className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
            All Recipes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Explore every recipe in our collection, from classic favorites to new culinary inspirations.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-compass-primary to-red-500 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {Array.isArray(recipes) && recipes.map((recipe) => (
            <motion.div key={recipe._id} variants={itemVariants}>
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <h3 className="font-playfair font-semibold text-2xl text-gray-800 mb-2">
              {recipes.length}
            </h3>
            <p className="text-gray-600 mb-6">
              Delicious {recipes.length === 1 ? 'Recipe' : 'Recipes'} Available
            </p>
            <Button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/add-recipe');
                } else {
                  setShowAuthModal(true);
                }
              }}
              className="bg-compass-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your Recipe
            </Button>
          </div>
        </motion.div>
      </div>

           {/* Updated Discover by Cuisine section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800">
            Discover by Cuisine
          </h2>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide justify-center">
          {cuisines.map((cuisine) => (
            <motion.div 
              key={cuisine.name} 
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card className="rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  {/* The icon's background and color are now dynamic */}
                  <div className={`bg-gradient-to-r ${cuisine.colors.bg} p-3 rounded-full mb-3`}>
                    <cuisine.icon className={`w-8 h-8 ${cuisine.colors.text}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 whitespace-nowrap">{cuisine.name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
