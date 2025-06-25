'use client';

import Image from 'next/image';
import '../styles/mirror.css';

const MirrorVendors = () => {
  return (
    <div className="mirror-dashboard">
      <div className="mirror-header">Mirror Vendors</div>

      <div className="mirror-game-container">
        <div className="mirror-info">
          <p>
            <strong>Mirror Vendors</strong> is a robust digital marketplace platform designed to empower local businesses, independent sellers, and service providers to take their offerings online with ease. From product listing to payment management, Mirror Vendors delivers a streamlined experience with tools tailored to boost visibility and drive sales.
          </p>
          <button className="mirror-cta-button">Join as Vendor</button>
        </div>
        <div className="mirror-image-box">
          <Image
            src="/img_7.png"
            alt="Mirror Vendors"
            width={400}
            height={250}
          />
        </div>
      </div>

      <p className="mirror-description">
        With Mirror Vendors, entrepreneurs can easily launch their digital storefront without the need for technical skills or huge investments...
      </p>
      <p className="mirror-description">
        Vendors also gain access to detailed analytics, marketing tools, seasonal promotions, and a growing base of Mirror customers...
      </p>
      <p className="mirror-description">
        As part of our mission to promote local economies, we also feature a vendor spotlight program where top-performing vendors are promoted...
      </p>

      <div className="mirror-section-title">Key Features</div>
      <div className="mirror-feature-list">
        {[
          "Easy product/service listing with images and descriptions",
          "Real-time order tracking and notifications",
          "Instant payment settlements to Mirror Wallet",
          "Performance dashboard with sales and engagement data",
          "Customer feedback and rating management",
          "Built-in promotions and discount tools",
          "Integrated delivery and pickup coordination",
          "Dedicated vendor support and onboarding assistance",
          "Support for bulk uploads and CSV imports",
          "Cross-platform access via mobile and web"
        ].map((feature, index) => (
          <div className="mirror-section-title-row" key={index}>
            <span className="mirror-dot"></span>
            <span className="mirror-feature-text">{`0${index + 1}. ${feature}`}</span>
          </div>
        ))}
      </div>

      <div className="mirror-section-title">Vendor Benefits</div>
      <div className="mirror-feature-list">
        {[
          "Reach a wider audience and increase revenue",
          "Zero commission for the first 3 months",
          "Exclusive access to vendor training programs",
          "Participate in seasonal sales & events",
          "Boost visibility with featured listings"
        ].map((benefit, index) => (
          <div className="mirror-section-title-row" key={index}>
            <span className="mirror-dot"></span>
            <span className="mirror-feature-text">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="mirror-section-title">Platforms Available On</div>
      <div className="mirror-feature-list">
        {["Android (Google Play Store)", "iOS (App Store)", "Web Browser"].map((platform, idx) => (
          <div className="mirror-section-title-row" key={idx}>
            <span className="mirror-dot"></span>
            <span className="mirror-feature-text">{platform}</span>
          </div>
        ))}
      </div>

      <p className="mirror-description">
        Whether you are an experienced merchant or just starting your entrepreneurial journey, Mirror Vendors offers a comprehensive platform to digitize and expand your business.
      </p>
    </div>
  );
};

export default MirrorVendors;
