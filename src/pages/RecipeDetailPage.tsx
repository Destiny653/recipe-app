// File: src/pages/RecipeDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Frown, Loader2, Clock, Flame, Star, StarHalf } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Separator } from '../components/ui/separator';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  preparationSteps: string[];
  cookingTime: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  diet: string;
  averageRating: number;
}

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { request } = useApi();

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }
      const data = await request<Recipe>({ url: `/recipes/${id}`, method: 'GET' });
      if (data) {
        setRecipe(data);
      } else {
        setError(true);
      }
      setLoading(false);
    };

    fetchRecipe();
  }, [id, request]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 text-compass-primary fill-compass-primary" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-5 h-5 text-compass-primary fill-compass-primary" />);
    }
    while (stars.length < 5) {
      stars.push(<Star key={stars.length} className="w-5 h-5 text-gray-300" />);
    }
    return stars;
  };

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
        <p className="mt-4 text-gray-600">Preparing the recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
        <Frown className="w-16 h-16 text-destructive" />
        <h2 className="text-2xl font-semibold mt-4">Recipe Not Found</h2>
        <p className="text-gray-600 mt-2">
          The recipe you are looking for might not exist or has been moved.
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
        className="bg-white rounded-2xl shadow-lg p-6 md:p-10"
      >
        <motion.img
          src={`http://localhost:5000${recipe.image}`}
          alt={recipe.title}
          className="w-full h-80 object-cover object-center rounded-xl shadow-lg mb-8"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-2 md:mb-0">{recipe.title}</h1>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            {renderStars(recipe.averageRating)}
            <span className="text-lg font-poppins text-gray-600">
              {recipe.averageRating.toFixed(1)} / 5
            </span>
          </div>
        </div>
        
        <p className="text-gray-700 mt-4 mb-6 font-poppins">{recipe.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-700 font-poppins">
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center space-x-2">
            <Clock className="w-6 h-6 text-compass-primary" />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center space-x-2">
            <Flame className="w-6 h-6 text-compass-primary" />
            <span>{recipe.calories} kcal</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center space-x-2">
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        <Separator className="my-8 bg-gray-200" />
        
        <div className="grid md:grid-cols-2 gap-10 font-poppins">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ingredients</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Preparation Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {recipe.preparationSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RecipeDetailPage;
