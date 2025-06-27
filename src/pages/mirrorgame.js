'use client';

import Image from 'next/image';
import '../styles/mirror.css';

const MirrorGame = () => {
  return (
    <div className="mirror-dashboard">
      <div className="mirror-header">Mirror Game</div>

      <div className="mirror-game-container">
        <div className="mirror-info">
          <p>
            Welcome to <strong>Mirror Game</strong> — an exciting, interactive way to earn while you play! Compete in daily challenges, sharpen your skills, and climb the leaderboard to unlock cashback, Mirror Points, and exclusive rewards.
          </p>
          <button className="mirror-cta-button">Play Now</button>
        </div>

        <div className="mirror-image-box">
          <Image
            src="/img_3.png"
            alt="Mirror Game"
            width={400}
            height={250}
          />
        </div>
      </div>

      <p className="mirror-description">
        Mirror Game is an innovative gaming platform integrated within the Mirror ecosystem, aiming to redefine how users interact with digital entertainment. Built with seamless functionality and engaging gameplay mechanics, Mirror Game offers users a dynamic and rewarding experience, whether they are casual players or serious gamers.
      </p>

      <p className="mirror-description">
        Designed for all age groups, Mirror Game isnt just about entertainment — it s also about learning, improving reflexes, and winning rewards. From quiz-based games and logic puzzles to reflex challenges and arcade adventures, users can play, compete, and even earn points or tokens that can be redeemed within the Mirror platform. The platform prioritizes a secure, ad-free environment with regular game updates to keep content fresh and exciting.
      </p>

      <p className="mirror-description">
        Whether you are unwinding after a busy day or challenging your friends for a high score, Mirror Game brings communities together through fun, friendly competition. Its more than just a game — its your gateway to smart play, digital engagement, and daily rewards in the Mirror world.
      </p>


      <div className="mirror-section-title">Key Features</div>
      <div className="mirror-feature-list">
        {[
          "Real-time multiplayer gaming experience",
          "Daily and weekly rewards",
          "Secure wallet integration for entry fees and winnings",
          "In-game chat and friend invitations",
          "Leaderboards to track top players",
          "Simple and engaging user interface",
          "Instant withdrawal to Mirror Wallet",
          "No ads during gameplay for a smooth experience",
        ].map((item, idx) => (
          <div className="mirror-section-title-row" key={idx}>
            <span className="mirror-dot" />
            <span className="mirror-feature-text">{`0${idx + 1}. ${item}`}</span>
          </div>
        ))}
      </div>

      <div className="mirror-section-title">Educational & Developmental Value</div>
      <div className="mirror-feature-list">
        {[
          "Improves Logical Thinking",
          "Enhances Problem Solving Skills",
          "Boosts Memory and Attention",
          "Encourages Strategic Planning",
          "Promotes Healthy Competition",
          "Teaches Time Management",
        ].map((item, idx) => (
          <div className="mirror-section-title-row" key={idx}>
            <span className="mirror-dot" />
            <span className="mirror-feature-text">{item}</span>
          </div>
        ))}
      </div>

      <div className="mirror-section-title">Platforms Available On</div>
      <div className="mirror-feature-list">
        {[
          "Android (Google Play Store)",
          "iOS (App Store)",
          "Web Browser",
          "Windows (PWA/Desktop App)",
        ].map((platform, idx) => (
          <div className="mirror-section-title-row" key={idx}>
            <span className="mirror-dot" />
            <span className="mirror-feature-text">{platform}</span>
          </div>
        ))}
      </div>

      <p className="mirror-description">
        Whether you are looking to have fun, sharpen your mind, or earn rewards...
      </p>
    </div>
  );
};

export default MirrorGame;
