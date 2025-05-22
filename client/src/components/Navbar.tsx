import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from '@/components/ui/popover';
import { UserRound, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  // Define navigation items based on authentication status
  const baseNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Team', path: '/team' },
    { name: 'About', path: '/about' }
  ];
  
  // Add analysis route for authenticated users
  const navItems = isAuthenticated 
    ? [...baseNavItems, { name: 'Analysis', path: '/analysis' }]
    : baseNavItems;
  
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-foreground">NeurAI<span className="text-primary">Detect</span></span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="flex items-center ml-4 space-x-2">
              <ThemeToggle />
              
              {/* User Profile Dropdown or Login/Register Buttons */}
              {isAuthenticated ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="p-2 h-10 w-10 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user?.avatar 
                            ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${user.avatar}` 
                            : "/placeholder.svg"} 
                          alt={user?.name} 
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {user?.name?.charAt(0) || <UserRound className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="end">
                    <div className="space-y-1">
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {user?.name}
                      </div>
                      <div className="px-2 pb-1.5 text-xs text-muted-foreground">
                        {user?.email}
                      </div>
                      <hr className="my-1 border-border" />
                      <Link to="/profile" className="block">
                        <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                          <UserRound className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                        size="sm"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">Log In</Button>
                  </Link>
                  <Link to="/login?tab=register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile User Profile or Auth Button */}
            {isAuthenticated ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="p-2 h-9 w-9 rounded-full">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="/placeholder.svg" alt={user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user?.name?.charAt(0) || <UserRound className="h-3 w-3" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="end">
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-sm font-medium">
                      {user?.name}
                    </div>
                    <div className="px-2 pb-1 text-xs text-muted-foreground">
                      {user?.email}
                    </div>
                    <hr className="my-1 border-border" />
                    <Link to="/profile" className="block">
                      <Button variant="ghost" className="w-full justify-start text-sm" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                        <UserRound className="h-3.5 w-3.5 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                      size="sm"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="h-3.5 w-3.5 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="p-2">
                  <UserRound className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? 'text-primary' : 'text-foreground/80'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="mt-4 space-y-2 pt-3 border-t border-border">
                <Link to="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link to="/login?tab=register" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
