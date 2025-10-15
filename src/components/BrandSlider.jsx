import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const BrandSlider = ({ brands }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % brands.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, brands.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000); // Resume auto-play after 8 seconds
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % brands.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + brands.length) % brands.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <div className="relative overflow-hidden group">
      {/* Slider Container */}
      <div className="relative h-[400px] md:h-[550px] lg:h-[650px]">
        {brands.map((brand, index) => (
          <div
            key={brand.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            <Link to={`/brands/${brand.slug}`} className="block h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={brand.heroImage}
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-end md:items-center pb-8 md:pb-0">
                <div className="container mx-auto px-4 md:px-8 lg:px-16">
                  <div className="max-w-3xl">
                    {/* Brand Logo - Hidden on mobile, visible on tablet+ */}
                    <div className="hidden md:block mb-4 lg:mb-6">
                      <div className="inline-block bg-white rounded-lg md:rounded-xl p-2 md:p-4 shadow-2xl">
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          className="h-12 md:h-16 lg:h-20 w-auto object-contain"
                        />
                      </div>
                    </div>

                    {/* Brand Name */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 text-white leading-tight">
                      {brand.name}
                    </h2>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-xl lg:text-2xl mb-4 md:mb-6 text-white/95 font-medium line-clamp-2 md:line-clamp-none">
                      {brand.description}
                    </p>

                    {/* Story Excerpt - Hidden on mobile */}
                    <p className="hidden md:block text-base lg:text-lg mb-6 lg:mb-8 text-white/85 leading-relaxed max-w-2xl line-clamp-2">
                      {brand.story}
                    </p>

                    {/* Stats - Simplified on mobile */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-8">
                      <div className="bg-white/95 backdrop-blur-md px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-lg">
                        <div className="flex items-baseline gap-1 md:gap-2">
                          <span className="font-bold text-xl md:text-2xl lg:text-3xl text-primary-600">{brand.productCount}</span>
                          <span className="text-xs md:text-sm text-gray-600 font-medium">Products</span>
                        </div>
                      </div>
                      <div className="bg-white/95 backdrop-blur-md px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-lg">
                        <div className="flex items-baseline gap-1 md:gap-2">
                          <span className="font-bold text-xl md:text-2xl lg:text-3xl text-primary-600">{brand.founded}</span>
                          <span className="text-xs md:text-sm text-gray-600 font-medium">Est.</span>
                        </div>
                      </div>
                      <div className="hidden sm:block bg-white/95 backdrop-blur-md px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl shadow-lg">
                        <div className="flex items-baseline gap-1 md:gap-2">
                          <span className="font-bold text-xl md:text-2xl lg:text-3xl text-primary-600">{brand.categories.length}</span>
                          <span className="text-xs md:text-sm text-gray-600 font-medium">Categories</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button - Simplified on mobile */}
                    <button className="bg-primary-600 text-white px-6 py-3 md:px-10 md:py-4 rounded-lg md:rounded-xl font-bold text-sm md:text-base lg:text-lg hover:bg-primary-700 transition-all duration-300 inline-flex items-center gap-2 md:gap-3 shadow-2xl w-full sm:w-auto justify-center sm:justify-start">
                      <span className="md:hidden">Shop Now</span>
                      <span className="hidden md:inline">Explore {brand.name}</span>
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on mobile, visible on hover for desktop */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-gray-900 p-3 lg:p-4 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-2xl hover:scale-110 items-center justify-center"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-gray-900 p-3 lg:p-4 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-2xl hover:scale-110 items-center justify-center"
        aria-label="Next slide"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Dots Navigation - Smaller on mobile */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
        {brands.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 md:w-12 h-2 md:h-3 bg-white shadow-lg'
                : 'w-2 md:w-3 h-2 md:h-3 bg-white/60 hover:bg-white/90 shadow-md'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter - Smaller on mobile */}
      <div className="absolute top-4 md:top-8 right-4 md:right-12 bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-6 md:py-3 rounded-full shadow-xl">
        <span className="font-bold text-gray-900 text-sm md:text-base lg:text-lg">
          {currentSlide + 1} / {brands.length}
        </span>
      </div>
    </div>
  );
};

export default BrandSlider;

