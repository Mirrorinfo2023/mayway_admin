'use client';

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

const images = [
  'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1603415526960-fb4d996345c5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155229a19a?auto=format&fit=crop&w=800&q=80',
];

export default function CarouselSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    pauseOnHover: true,
    customPaging: () => (
      <div className="w-3 h-3 rounded-full bg-gray-300" />
    ),
    appendDots: dots => (
      <div style={{ bottom: '-20px' }}>
        <ul className="flex gap-2 justify-center">{dots}</ul>
      </div>
    ),
  };

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-xl mb-6">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <Image
              src={src}
              alt={`Carousel image ${index + 1}`}
              width={800}
              height={100}
              className="w-full h-auto object-cover rounded"
            />
          </div>
        ))}
      </Slider>

      <style jsx global>{`
        .slick-dots li.slick-active div {
          background-color: #2563eb !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
