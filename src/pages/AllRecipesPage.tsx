import React, { useEffect, useState, useMemo } from 'react';
import { motion} from 'framer-motion';
import { Frown, Loader2, Search, Filter, ChevronRight, ChevronLeft, Star, X } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import RecipeCard from '../components/RecipeCard';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';

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
  ingredients: string[];
}

const ITEMS_PER_PAGE = 12;

// Debounce utility function
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const AllRecipesPage: React.FC = () => {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { request } = useApi();
  const { toast } = useToast();

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [timeFilter, setTimeFilter] = useState<string>('');
  const [caloriesFilter, setCaloriesFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [starRatingFilter, setStarRatingFilter] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>('');
  // const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await request<{ recipes: Recipe[] }>({ url: '/recipes', method: 'GET' });
        if (data && Array.isArray(data.recipes)) {
          setAllRecipes(data.recipes);
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

  const filteredRecipes = useMemo(() => {
    let tempRecipes = [...allRecipes];

    // Search by title or ingredients
    if (debouncedSearchQuery) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase();
      tempRecipes = tempRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(lowerCaseQuery) ||
        (recipe.ingredients && recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowerCaseQuery)))
      );
    }

    // Filter by cooking time
    if (timeFilter) {
      tempRecipes = tempRecipes.filter(recipe => {
        const [min, max] = timeFilter.split('-').map(Number);
        if (max) return recipe.cookingTime && recipe.cookingTime >= min && recipe.cookingTime <= max;
        return recipe.cookingTime && recipe.cookingTime >= min;
      });
    }

    // Filter by calories
    if (caloriesFilter) {
      tempRecipes = tempRecipes.filter(recipe => {
        const [min, max] = caloriesFilter.split('-').map(Number);
        if (max) return recipe.calories && recipe.calories >= min && recipe.calories <= max;
        return recipe.calories && recipe.calories >= min;
      });
    }

    // Filter by difficulty
    if (difficultyFilter) {
      tempRecipes = tempRecipes.filter(recipe => 
        recipe.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    // Filter by star rating
    if (starRatingFilter > 0) {
      tempRecipes = tempRecipes.filter(recipe => recipe.averageRating >= starRatingFilter);
    }

    // Sorting
    if (sortOption === 'rating') {
      tempRecipes.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (sortOption === 'time-asc') {
      tempRecipes.sort((a, b) => (a.cookingTime || 0) - (b.cookingTime || 0));
    } else if (sortOption === 'calories-asc') {
      tempRecipes.sort((a, b) => (a.calories || 0) - (b.calories || 0));
    }

    // Reset to the first page if filters change
    setCurrentPage(1);
    
    return tempRecipes;
  }, [allRecipes, debouncedSearchQuery, timeFilter, caloriesFilter, difficultyFilter, starRatingFilter, sortOption]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const paginatedRecipes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecipes, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTimeFilter('');
    setCaloriesFilter('');
    setDifficultyFilter('');
    setStarRatingFilter(0);
    setSortOption('');
    toast({
      title: "Filters Cleared",
      description: "All search and filter criteria have been removed.",
    });
  };

  const clearFilter = (filterName: string) => {
    if (filterName === 'search') setSearchQuery('');
    if (filterName === 'time') setTimeFilter('');
    if (filterName === 'calories') setCaloriesFilter('');
    if (filterName === 'difficulty') setDifficultyFilter('');
    if (filterName === 'stars') setStarRatingFilter(0);
  };

  // Loading and Error states
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] pt-24">
        <div>
          <Loader2 className="w-16 h-16 text-compass-primary" />
        </div>
        <p className="mt-4 text-gray-600">Finding your perfect recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4 pt-24">
        <Frown className="w-16 h-16 text-destructive" />
        <h2 className="text-2xl font-semibold mt-4">Oops!</h2>
        <p className="text-gray-600 mt-2">
          We couldn't retrieve the recipes. Please try again.
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4 bg-compass-primary hover:bg-orange-600">
          Try Again
        </Button>
      </div>
    );
  }

  const hasActiveFilters = searchQuery || timeFilter || caloriesFilter || difficultyFilter || starRatingFilter > 0;

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-2">
          Explore All Recipes
        </h1>
        <p className="text-gray-600 text-lg">
          Find your next favorite meal with our extensive collection.
        </p>
      </motion.div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar for Filters */}
        <div className="w-full lg:w-1/4 p-6 bg-white rounded-2xl shadow-xl space-y-6">
          <h3 className="flex items-center text-lg font-bold text-compass-primary">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Sort
          </h3>
          <Separator />
          
          {/* Search input */}
          <div>
            <label htmlFor="search" className="text-sm font-medium text-gray-700 block mb-2">
              Search by Title or Ingredient
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="e.g., Chicken, Pasta"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl border-gray-300 focus-visible:ring-compass-primary"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 block mb-2">
              Sort By
            </label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger id="sort-by" className="rounded-xl focus-visible:ring-compass-primary">
                <SelectValue placeholder="Select sorting option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Average Rating</SelectItem>
                <SelectItem value="time-asc">Cooking Time (low to high)</SelectItem>
                <SelectItem value="calories-asc">Calories (low to high)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Star Rating Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Minimum Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(stars => (
                <Button
                  key={stars}
                  onClick={() => setStarRatingFilter(stars === starRatingFilter ? 0 : stars)}
                  variant="ghost"
                  className={`p-2 rounded-full transition-colors ${starRatingFilter >= stars ? 'text-yellow-500' : 'text-gray-400'}`}
                >
                  <Star className={`w-5 h-5 fill-current`} />
                </Button>
              ))}
            </div>
          </div>

          {/* Time Filter with Buttons */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Cooking Time (min)
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setTimeFilter('1-15')}
                className={`rounded-full border-2 transition-colors ${timeFilter === '1-15' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                &lt; 15
              </Button>
              <Button
                onClick={() => setTimeFilter('15-30')}
                className={`rounded-full border-2 transition-colors ${timeFilter === '15-30' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                15 - 30
              </Button>
              <Button
                onClick={() => setTimeFilter('30-60')}
                className={`rounded-full border-2 transition-colors ${timeFilter === '30-60' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                30 - 60
              </Button>
              <Button
                onClick={() => setTimeFilter('60')}
                className={`rounded-full border-2 transition-colors ${timeFilter === '60' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                &gt; 60
              </Button>
            </div>
          </div>

          {/* Calories Filter with Buttons */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Calories (kcal)
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setCaloriesFilter('1-300')}
                className={`rounded-full border-2 transition-colors ${caloriesFilter === '1-300' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                &lt; 300
              </Button>
              <Button
                onClick={() => setCaloriesFilter('300-600')}
                className={`rounded-full border-2 transition-colors ${caloriesFilter === '300-600' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                300 - 600
              </Button>
              <Button
                onClick={() => setCaloriesFilter('600-1000')}
                className={`rounded-full border-2 transition-colors ${caloriesFilter === '600-1000' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                600 - 1000
              </Button>
              <Button
                onClick={() => setCaloriesFilter('1000')}
                className={`rounded-full border-2 transition-colors ${caloriesFilter === '1000' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                &gt; 1000
              </Button>
            </div>
          </div>

          {/* Difficulty Filter with Buttons */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setDifficultyFilter('easy')}
                className={`rounded-full border-2 transition-colors ${difficultyFilter === 'easy' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                Easy
              </Button>
              <Button
                onClick={() => setDifficultyFilter('medium')}
                className={`rounded-full border-2 transition-colors ${difficultyFilter === 'medium' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                Medium
              </Button>
              <Button
                onClick={() => setDifficultyFilter('hard')}
                className={`rounded-full border-2 transition-colors ${difficultyFilter === 'hard' ? 'bg-compass-primary text-white border-compass-primary' : 'bg-transparent text-gray-700 border-gray-300 hover:bg-compass-primary hover:text-white hover:border-compass-primary'}`}
              >
                Hard
              </Button>
            </div>
          </div>

          {hasActiveFilters && (
            <Button onClick={handleClearFilters} className="w-full mt-4" variant="outline">
              Clear All Filters
            </Button>
          )}
        </div>
        
        {/* Main Content (Recipe Grid) */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              Found {filteredRecipes.length} Recipes
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {searchQuery && (
                <span className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
                  Search: {searchQuery}
                  <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" onClick={() => clearFilter('search')} />
                </span>
              )}
              {timeFilter && (
                <span className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
                  Time: {timeFilter} min
                  <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" onClick={() => clearFilter('time')} />
                </span>
              )}
              {caloriesFilter && (
                <span className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
                  Calories: {caloriesFilter} kcal
                  <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" onClick={() => clearFilter('calories')} />
                </span>
              )}
              {difficultyFilter && (
                <span className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
                  Difficulty: {difficultyFilter}
                  <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" onClick={() => clearFilter('difficulty')} />
                </span>
              )}
              {starRatingFilter > 0 && (
                <span className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium">
                  Rating: {starRatingFilter} Stars
                  <X className="w-4 h-4 ml-2 cursor-pointer hover:text-red-500" onClick={() => clearFilter('stars')} />
                </span>
              )}
            </div>
            <Separator className="mt-2" />
          </motion.div>

          {paginatedRecipes.length > 0 ? (
            <>
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedRecipes.map((recipe) => (
                  <motion.div
                    key={recipe._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-8 space-x-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="rounded-full w-10 h-10 p-0 text-gray-600 border-2 hover:border-compass-primary hover:text-compass-primary transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-gray-600 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="rounded-full w-10 h-10 p-0 text-gray-600 border-2 hover:border-compass-primary hover:text-compass-primary transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <Frown className="w-16 h-16 text-gray-400 mx-auto" />
              <p className="text-gray-600 mt-4 text-xl">
                No recipes match your filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllRecipesPage;
