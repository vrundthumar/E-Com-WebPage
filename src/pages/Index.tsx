import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, RotateCcw, Shield, Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section - Modern Asymmetric Design */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-foreground">
        {/* Abstract geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large circle */}
          <div className="absolute -top-1/4 -right-1/4 w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-gold/20 via-gold/5 to-transparent blur-3xl" />
          {/* Small accent circles */}
          <div className="absolute top-1/3 left-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full bg-gold/10 blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 sm:w-48 sm:h-48 rounded-full bg-primary/10 blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
          
          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Content Grid */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-20 sm:py-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-6 sm:mb-8 animate-fade-up">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold" />
                <span className="text-xs sm:text-sm font-medium text-white/90">New Season 2025</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4 sm:mb-6 animate-fade-up text-white leading-[1.05]" 
                style={{ animationDelay: '0.1s' }}
              >
                Redefine
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-gold via-gold/80 to-gold/60 bg-clip-text text-transparent">
                    Your Style
                  </span>
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-gold to-transparent rounded-full" />
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 text-white/60 animate-fade-up leading-relaxed" 
                style={{ animationDelay: '0.2s' }}
              >
                Premium clothing crafted for those who dare to stand out. 
                Discover pieces that speak your language.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-up" 
                style={{ animationDelay: '0.3s' }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gold text-foreground hover:bg-gold/90 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold shadow-2xl shadow-gold/20 rounded-full"
                >
                  <Link to="/products">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base backdrop-blur-sm rounded-full"
                >
                  <Link to="/products?gender=women" className="flex items-center gap-2">
                    <Play className="h-4 w-4 fill-current" />
                    Watch Lookbook
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-10 mt-10 sm:mt-14 animate-fade-up" 
                style={{ animationDelay: '0.4s' }}
              >
                {[
                  { value: '50K+', label: 'Happy Customers' },
                  { value: '4.9', label: 'Rating' },
                  { value: '200+', label: 'Styles' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-gold">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Image Composition */}
            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                {/* Main Image */}
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                  <img
                    src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80"
                    alt="Fashion Model"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
                </div>

                {/* Floating Card 1 */}
                <div className="absolute -left-4 sm:-left-8 top-1/4 bg-white/10 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/10 shadow-xl animate-fade-up hidden sm:block" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/20 flex items-center justify-center">
                      <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">Free Shipping</p>
                      <p className="text-white/50 text-xs sm:text-sm">On all orders</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -right-4 sm:-right-8 bottom-1/4 bg-white/10 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/10 shadow-xl animate-fade-up hidden sm:block" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1,2,3].map((i) => (
                        <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gold/40 to-gold/20 border-2 border-foreground" />
                      ))}
                    </div>
                    <div className="ml-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-gold fill-gold" />
                        <span className="text-white font-medium text-sm sm:text-base">4.9</span>
                      </div>
                      <p className="text-white/50 text-xs">2.5k reviews</p>
                    </div>
                  </div>
                </div>

                {/* Decorative ring */}
                <div className="absolute -z-10 inset-0 translate-x-4 translate-y-4 rounded-3xl border border-gold/20 hidden lg:block" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Discover our curated collections for men and women
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Men's Collection */}
            <Link 
              to="/products?gender=men" 
              className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
                alt="Men's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8">
                <h3 className="font-display text-2xl sm:text-3xl font-semibold mb-2 text-white">
                  Men's Collection
                </h3>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                  Explore Collection
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            {/* Women's Collection */}
            <Link 
              to="/products?gender=women" 
              className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                alt="Women's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8">
                <h3 className="font-display text-2xl sm:text-3xl font-semibold mb-2 text-white">
                  Women's Collection
                </h3>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                  Explore Collection
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹2,000' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: Star, title: 'Premium Quality', desc: 'Crafted with care' },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 mb-3 sm:mb-4">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base mb-1">{feature.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4">
            Join the Velin Community
          </h2>
          <p className="text-background/70 text-sm sm:text-base max-w-md mx-auto mb-6 sm:mb-8">
            Subscribe to get early access to new collections, exclusive offers, and style inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 rounded-full bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <Button className="h-12 px-6 bg-gold text-foreground hover:bg-gold/90 rounded-full font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;