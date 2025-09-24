// File: src/pages/AddRecipePage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useApi } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import type { RecipeResponse } from '../types/recipe';

const AddRecipePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState('');
  const [preparationSteps, setPreparationSteps] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [calories, setCalories] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [cuisine, setCuisine] = useState('');
  const [diet, setDiet] = useState('');

  const { request } = useApi();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('recipeImage', image);
    }
    formData.append('ingredients', JSON.stringify(ingredients.split('\n').filter(item => item.trim())));
    formData.append('preparationSteps', JSON.stringify(preparationSteps.split('\n').filter(step => step.trim())));
    formData.append('cookingTime', cookingTime);
    formData.append('calories', calories);
    formData.append('difficulty', difficulty);
    formData.append('cuisine', cuisine);
    formData.append('diet', diet);

    const data = await request<RecipeResponse>({
      url: '/recipes',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (data) {
      toast({
        title: "Success!",
        description: "Your recipe has been added.",
      });
      navigate(`/recipe/${data?._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 pt-24 max-w-4xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-compass-primary to-red-500 px-8 py-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-playfair font-bold text-white mb-2"
            >
              Share Your Recipe
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-orange-100 text-lg"
            >
              Create something delicious for the community
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            {/* Basic Info Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-lg font-medium text-gray-700">
                    Recipe Title *
                  </Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                    className="h-12 text-lg border-2 border-gray-200 py-8 md:py6 focus:border-compass-primary rounded-xl transition-colors"
                    placeholder="Enter your recipe name..."
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cuisine" className="text-lg font-medium text-gray-700">
                    Cuisine Type *
                  </Label>
                  <Input 
                    id="cuisine" 
                    value={cuisine} 
                    onChange={(e) => setCuisine(e.target.value)} 
                    required 
                    className="h-12 text-lg border-2 border-gray-200 py-8 md:py6 focus:border-compass-primary rounded-xl transition-colors"
                    placeholder="e.g., Italian, Mexican, Asian..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-medium text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-compass-primary rounded-xl transition-colors resize-none py-8 sm:py-6"
                  placeholder="Tell us about your recipe - what makes it special?"
                />
              </div>
            </motion.div>

            {/* Image Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Recipe Image
              </h2>
              
              <div className="space-y-4">
                <Label htmlFor="image" className="text-lg font-medium text-gray-700">
                  Upload Photo
                </Label>
                
                {!imagePreview ? (
                  <div className="relative">
                    <input
                      id="image"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor="image"
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-compass-primary transition-colors cursor-pointer block"
                    >
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-lg text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={imagePreview} 
                        alt="Recipe preview" 
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          onClick={removeImage}
                          className="bg-red-500 hover:bg-red-600 text-white py-8 sm:py-6"
                        >
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recipe Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Recipe Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="time" className="text-lg font-medium text-gray-700">
                    Cooking Time *
                  </Label>
                  <div className="relative">
                    <Input
                      id="time"
                      type="number"
                      value={cookingTime}
                      onChange={(e) => setCookingTime(e.target.value)}
                      required
                      className="h-12 text-lg border-2 border-gray-200 focus:border-compass-primary rounded-xl transition-colors pr-16 py-8 sm:py-6"
                      placeholder="30"
                      min="1"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">min</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="calories" className="text-lg font-medium text-gray-700">
                    Calories *
                  </Label>
                  <div className="relative">
                    <Input
                      id="calories"
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      required
                      className="h-12 text-lg border-2 border-gray-200 focus:border-compass-primary rounded-xl transition-colors pr-16 py-8 sm:py-6"
                      placeholder="250"
                      min="1"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">kcal</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="difficulty" className="text-lg font-medium text-gray-700">
                    Difficulty *
                  </Label>
                  <select 
                    id="difficulty" 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)} 
                    className="w-full h-12 text-lg border-2 border-gray-200 focus:border-compass-primary rounded-xl transition-colors px-4 bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="diet" className="text-lg font-medium text-gray-700">
                    Diet Type *
                  </Label>
                  <Input
                    id="diet"
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    required
                    className="h-12 text-lg border-2 border-gray-200 focus:border-compass-primary rounded-xl transition-colors py-8 sm:py-6"
                    placeholder="e.g., Vegetarian, Keto, Gluten-free..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Ingredients and Steps Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-playfair font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Ingredients & Instructions
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="ingredients" className="text-lg font-medium text-gray-700">
                    Ingredients *
                  </Label>
                  <Textarea
                    id="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                    className="min-h-[200px] text-lg border-2 border-gray-200 focus:border-compass-primary rounded-xl transition-colors resize-none py-8 sm:py-6"
                    placeholder="Enter each ingredient on a new line:&#10;• 2 cups flour&#10;• 1 tsp salt&#10;• 3 eggs..."
                  />
                  <p className="text-sm text-gray-500">Enter one ingredient per line</p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="steps" className="text-lg font-medium text-gray-700">
                    Preparation Steps *
                  </Label>
                  <Textarea
                    id="steps"
                    value={preparationSteps}
                    onChange={(e) => setPreparationSteps(e.target.value)}
                    required
                    className="min-h-[200px] text-lg border-2 border-gray-200 focus:border-compass-primary rounded-xl transition-colors resize-none py-8 sm:py-6"
                    placeholder="Enter each step on a new line:&#10;1. Preheat oven to 350°F&#10;2. Mix dry ingredients&#10;3. Add wet ingredients..."
                  />
                  <p className="text-sm text-gray-500">Enter one step per line</p>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="pt-6"
            >
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-compass-primary to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-poppins text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 py-8 sm:py-6"
              >
                Share Your Recipe
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddRecipePage;