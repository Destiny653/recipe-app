import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AuthModal from './components/AuthModal';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import AllRecipesPage from './pages/AllRecipesPage'; // Import the new page

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-poppins bg-gray-50 text-gray-800">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/recipes" element={<AllRecipesPage />} /> {/* Add the new route here */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* These routes are now protected */}
              <Route 
                path="/add-recipe" 
                element={
                  <ProtectedRoute>
                    <AddRecipePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <Toaster />
          <AuthModal />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
