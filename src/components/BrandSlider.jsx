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
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-6 md:px-12 lg:px-20">
                  <div className="max-w-3xl">
                    {/* Brand Logo */}
                    <div className="mb-6 animate-fade-in">
                      <div className="inline-block bg-white rounded-xl p-4 shadow-2xl">
                        <img
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          className="h-16 md:h-20 w-auto object-contain"
                        />
                      </div>
                    </div>

                    {/* Brand Name */}
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-white leading-tight">
                      {brand.name}
                    </h2>

                    {/* Description */}
                    <p className="text-xl md:text-2xl lg:text-3xl mb-4 text-white/95 font-medium">
                      {brand.description}
                    </p>

                    {/* Story Excerpt */}
                    <p className="text-base md:text-lg mb-8 text-white/85 leading-relaxed max-w-2xl line-clamp-3">
                      {brand.story}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-3xl text-primary-600">{brand.productCount}</span>
                          <span className="text-sm text-gray-600 font-medium">Products</span>
                        </div>
                      </div>
                      <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-3xl text-primary-600">{brand.founded}</span>
                          <span className="text-sm text-gray-600 font-medium">Established</span>
                        </div>
                      </div>
                      <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-3xl text-primary-600">{brand.categories.length}</span>
                          <span className="text-sm text-gray-600 font-medium">Categories</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="group/btn bg-primary-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-all duration-300 inline-flex items-center gap-3 shadow-2xl hover:shadow-primary-600/50 hover:scale-105">
                      Explore {brand.name}
                      <svg className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-gray-900 p-4 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-2xl hover:scale-110"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md text-gray-900 p-4 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-2xl hover:scale-110"
        aria-label="Next slide"
      >
        <FiChevronRight size={28} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {brands.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-16 h-4 bg-white shadow-lg'
                : 'w-4 h-4 bg-white/60 hover:bg-white/90 shadow-md'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 md:right-12 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl">
        <span className="font-bold text-gray-900 text-lg">
          {currentSlide + 1} / {brands.length}
        </span>
      </div>
    </div>
  );
};

export default BrandSlider;

