import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronRight, Home, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    getCartCount,
    setIsOpen
  } = useCart();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };
  const navLinks = [{
    label: 'Home',
    href: '/',
    icon: Home
  }, {
    label: 'Shop All',
    href: '/products',
    icon: Package
  }, {
    label: 'Men',
    href: '/products?gender=men',
    icon: Users
  }, {
    label: 'Women',
    href: '/products?gender=women',
    icon: Users
  }];
  const isHomePage = location.pathname === '/';
  const cartCount = getCartCount();
  return <>
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', isScrolled || !isHomePage ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-transparent')}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Mobile menu button - Left */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={cn('md:hidden p-2 -ml-2 rounded-full transition-colors', isHomePage && !isScrolled ? 'hover:bg-white/20 text-white' : 'hover:bg-muted/50')} aria-label="Toggle menu">
              <div className="relative w-5 h-5">
                <span className={cn('absolute left-0 block h-0.5 w-5 bg-current transform transition-all duration-300', isMobileMenuOpen ? 'top-2.5 rotate-45' : 'top-1')} />
                <span className={cn('absolute left-0 top-2.5 block h-0.5 w-5 bg-current transition-opacity duration-300', isMobileMenuOpen ? 'opacity-0' : 'opacity-100')} />
                <span className={cn('absolute left-0 block h-0.5 w-5 bg-current transform transition-all duration-300', isMobileMenuOpen ? 'top-2.5 -rotate-45' : 'top-4')} />
              </div>
            </button>

            {/* Logo - Centered on mobile */}
            <Link to="/" className={cn('font-display text-xl sm:text-2xl md:text-3xl font-semibold tracking-wider transition-colors', 'absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0', isHomePage && !isScrolled ? 'text-white' : '')}>
              VELIN
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => <Link key={link.href} to={link.href} className={cn('text-sm font-medium tracking-wide transition-colors hover:text-primary/70', location.pathname === link.href && 'text-primary')}>
                  {link.label}
                </Link>)}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => {})}
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className={cn('p-2 rounded-full transition-colors', isHomePage && !isScrolled ? 'hover:bg-white/20 text-white' : 'hover:bg-muted')} aria-label="Search">
                <Search className="h-5 w-5" />
              </button>

              <Link to={user ? '/account' : '/auth'} className={cn('p-2 rounded-full transition-colors hidden sm:flex', isHomePage && !isScrolled ? 'hover:bg-white/20 text-white' : 'hover:bg-muted')} aria-label={user ? 'Account' : 'Sign in'}>
                <User className="h-5 w-5" />
              </Link>

              <button onClick={() => setIsOpen(true)} className={cn('p-2 rounded-full transition-colors relative', isHomePage && !isScrolled ? 'hover:bg-white/20 text-white' : 'hover:bg-muted')} aria-label="Cart">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className={cn('absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b transition-all duration-300 overflow-hidden', searchOpen ? 'max-h-20 py-3 sm:py-4' : 'max-h-0 py-0')}>
          <div className="container mx-auto px-4">
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <Input type="text" placeholder="Search for products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pr-12 h-10 sm:h-11" autoFocus={searchOpen} />
              <Button type="submit" size="sm" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div className={cn('fixed inset-0 z-40 md:hidden transition-all duration-300', isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none')}>
        {/* Backdrop */}
        <div className={cn('absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300', isMobileMenuOpen ? 'opacity-100' : 'opacity-0')} onClick={() => setIsMobileMenuOpen(false)} />
        
        {/* Menu Panel */}
        <div className={cn('absolute top-14 left-0 right-0 bottom-0 bg-background overflow-y-auto transition-transform duration-300 ease-out', isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full')}>
          <div className="flex flex-col min-h-full">
            {/* Navigation Links */}
            <div className="flex-1 py-4">
              <nav className="space-y-1 px-3">
                {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href || link.href !== '/' && location.pathname + location.search === link.href;
                return <Link key={link.href} to={link.href} className={cn('flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all active:scale-[0.98]', isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted active:bg-muted')}>
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className={cn('h-5 w-5 transition-colors', isActive ? 'text-primary-foreground/70' : 'text-muted-foreground')} />
                    </Link>;
              })}
              </nav>

              {/* Divider */}
              <div className="my-4 mx-4 border-t" />

              {/* Account Section */}
              <div className="px-3">
                <Link to={user ? '/account' : '/auth'} className="flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium hover:bg-muted active:bg-muted transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5" />
                    <span>{user ? 'My Account' : 'Sign In'}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-muted/30">
              <p className="text-center text-sm text-muted-foreground">
                Premium clothing crafted for modern lifestyle
              </p>
            </div>
          </div>
        </div>
      </div>
    </>;
}