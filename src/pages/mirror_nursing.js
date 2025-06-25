'use client';

import Image from 'next/image';
import '../styles/mirror.css';

const MirrorNursing = () => {
  return (
    <div className="mirror-dashboard">
      <div className="mirror-header">Mirror Nursing</div>

      <div className="mirror-game-container">
        <div className="mirror-info">
          <p>
            <strong>Mirror Nursing</strong> is a revolutionary digital platform designed to support nursing students and professionals. Access curated study materials, attend live classes, and participate in mock tests tailored to various nursing entrance and licensing exams.
          </p>
        </div>
        <div className="mirror-image-box">
          <Image
            src="/img_5.png"
            alt="Mirror Nursing"
            width={400}
            height={250}
          />
        </div>
      </div>

      <p className="mirror-description">
        Mirror Nursing brings the best of nursing education directly to your device...
      </p>

      <p className="mirror-description">
        With interactive video lessons, structured learning paths, and expert mentorship...
      </p>

      <div className="mirror-section-title">Key Features</div>
      <div className="mirror-feature-list">
        {[
          "Live and recorded nursing classes",
          "Daily quizzes and weekly mock tests",
          "Study material aligned with latest nursing syllabus",
          "Expert faculty and mentorship support",
          "Progress tracking and analytics dashboard",
          "Offline downloads for low-data users",
          "Doubt-clearing sessions with real-time chat",
          "Scholarship and certificate programs",
        ].map((feature, index) => (
          <div className="mirror-section-title-row" key={index}>
            <span className="mirror-dot" />
            <span className="mirror-feature-text">{`0${index + 1}. ${feature}`}</span>
          </div>
        ))}
      </div>

      <div className="mirror-section-title">Educational & Developmental Value</div>
      <div className="mirror-feature-list">
        {[
          "Improves Subject Understanding",
          "Builds Exam Confidence",
          "Encourages Discipline and Regular Practice",
          "Supports Career Advancement and Job Placement",
          "Develops Practical & Theoretical Knowledge",
        ].map((point, idx) => (
          <div className="mirror-section-title-row" key={idx}>
            <span className="mirror-dot" />
            <span className="mirror-feature-text">{point}</span>
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
        Join thousands of aspiring and working nurses already upgrading their learning with Mirror Nursing. Start your journey today — because the world needs more skilled, confident, and empowered nurses.
      </p>
    </div>
  );
};

export default MirrorNursing;
