// File: src/components/RecipeCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface RecipeCardProps {
  recipe: {
    _id: string;
    title: string;
    image: string;
    averageRating?: number;
  };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const averageRating = recipe.averageRating ? Math.round(recipe.averageRating * 10) / 10 : 0;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 transition-colors duration-200 ${
          i <= averageRating ? 'text-compass-primary' : 'text-gray-300'
        }`}
        fill={i <= averageRating ? '#f97316' : 'none'}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    >
      <Link to={`/recipe/${recipe._id}`}>
        <Card className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
          <motion.img
            src={`http://localhost:5000${recipe.image}`}
            alt={recipe.title}
            className="w-full h-48 object-cover object-center transform transition-transform duration-500 hover:scale-110"
            whileHover={{ scale: 1.1 }}
          />
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-bold text-compass-primary truncate">
              {recipe.title}
            </CardTitle>
            <CardDescription className="flex items-center space-x-1 mt-1">
              {stars}
              <span className="ml-2 text-sm text-gray-600">
                {averageRating > 0 ? `${averageRating}/5` : 'No ratings yet'}
              </span>
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
