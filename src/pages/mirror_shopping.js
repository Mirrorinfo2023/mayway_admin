'use client';

import Image from 'next/image';
import '../styles/mirror.css';

const MirrorShopping = () => {
  return (
    <div className="mirror-dashboard">
      <div className="mirror-header">Mirror Shopping</div>

      <div className="mirror-game-container">
        <div className="mirror-info">
          <p>
            <strong>Mirror Shopping</strong> brings you a seamless online shopping experience within the Mirror ecosystem. Enjoy exclusive deals, instant cashback, and a frictionless checkout process powered by the integrated Mirror Wallet.
          </p>
          <button className="mirror-cta-button">Shop Now</button>
        </div>
        <div className="mirror-image-box">
          <Image
            src="/img_6.png"
            alt="Mirror Shopping"
            width={400}
            height={250}
          />
        </div>
      </div>

      <p className="mirror-description">
        Mirror Shopping offers a curated selection of top-rated products across categories such as fashion, electronics, home essentials, beauty, and lifestyle.
      </p>
      <p className="mirror-description">
        Earn Mirror Points on every purchase and redeem them for future discounts. With an easy-to-use interface, fast order tracking, and Mirror Wallet integration...
      </p>
      <p className="mirror-description">
        Mirror Shopping supports both top brands and local sellers, ensuring an inclusive and community-driven commerce experience...
      </p>

      <div className="mirror-section-title">Key Features</div>
      <div className="mirror-feature-list">
        {[
          "Cashback on every order",
          "Mirror Wallet Integration for quick payments",
          "Daily Deals & Flash Sales",
          "Loyalty Rewards System for repeat shoppers",
          "Quick Checkout with saved addresses",
          "Product Recommendations based on user interest",
          "Secure payments & order tracking",
          "Easy return and refund policy",
        ].map((feature, index) => (
          <div className="mirror-section-title-row" key={index}>
            <span className="mirror-dot" />
            <span className="mirror-feature-text">{`0${index + 1}. ${feature}`}</span>
          </div>
        ))}
      </div>

      <div className="mirror-section-title">Platforms Available On</div>
      <div className="mirror-feature-list">
        {[
          "Android (Google Play Store)",
          "iOS (App Store)",
          "Web Browser",
        ].map((platform, idx) => (
          <div className="mirror-section-title-row" key={idx}>
            <span className="mirror-dot" />
            <span className="mirror-feature-text">{platform}</span>
          </div>
        ))}
      </div>

      <p className="mirror-description">
        Start shopping with Mirror Shopping and enjoy a new way to buy, save, and earn. With each transaction, you step into a modern retail experience built for convenience, trust, and financial growth.
      </p>
    </div>
  );
};

export default MirrorShopping;
