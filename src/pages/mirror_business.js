'use client';

import React from 'react';
import Image from 'next/image';
import '../styles/mirror.css';
const MirrorBusiness = () => {
    const keyFeatures = [
        "All-in-one service portal (Recharge, BBPS, PAN, AEPS)",
        "Attractive commission structure",
        "Referral bonuses & rewards",
        "User-friendly business dashboard",
        "24/7 transaction support",
        "Training & marketing support",
        "Real-time reporting and analytics",
        "Instant settlement for transactions",
    ];

    const benefits = [
        "Start your own business with zero investment",
        "Expand your earning potential through referrals",
        "Operate digitally from anywhere",
        "Serve your local community with digital solutions",
        "Get access to tools and support to grow",
        "No technical knowledge required to start",
        "Flexibility to work on your own schedule",
        "Become part of a growing digital revolution",
    ];

    const platforms = [
        "Android (Google Play Store)",
        "iOS (App Store)",
        "Web Browser",
        "Windows (PWA/Desktop App)",
    ];

    return (
        <div className="dashboard">
            <header className="header">Mirror Business</header>

            <div className="mirror-business-container">
                <div className="business-info">
                    <p>
                        <strong>Mirror Business</strong> empowers individuals and small businesses to earn by offering digital services like recharge, bill payments, wallet loading, and more. Be your own boss by becoming a Mirror Business Partner and grow your network while earning commissions.
                    </p>
                    <button className="join-button">Join Now</button>
                </div>
                <div className="business-image">
                    <Image
                        src="/img_4.png"
                        alt="Mirror Business"
                        width={400}
                        height={300}
                        style={{ borderRadius: 12, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' }}
                    />
                </div>
            </div>

            <p className="mirror-description">
                Mirror Business is an inclusive platform designed for entrepreneurs, shopkeepers, and individuals looking to earn from their smartphones or desktops...
            </p>
            <p className="mirror-description">
                Our mission is to make entrepreneurship accessible to everyone...
            </p>
            <p className="mirror-description">
                We believe that digital empowerment is the key to economic freedom...
            </p>

            <div className="section-title">Key Features</div>
            <div className="feature-list">
                {keyFeatures.map((feature, idx) => (
                    <div className="section-title-row" key={idx}>
                        <span className="blue-dot"></span>
                        <span className="feature-text">{`0${idx + 1}. ${feature}`}</span>
                    </div>
                ))}
            </div>

            <div className="section-title">Why Join Mirror Business?</div>
            <div className="feature-list">
                {benefits.map((benefit, idx) => (
                    <div className="section-title-row" key={idx}>
                        <span className="blue-dot"></span>
                        <span className="feature-text">{benefit}</span>
                    </div>
                ))}
            </div>

            <div className="section-title">Platforms Available On:</div>
            <div className="feature-list">
                {platforms.map((platform, idx) => (
                    <div className="section-title-row" key={idx}>
                        <span className="blue-dot"></span>
                        <span className="feature-text">{platform}</span>
                    </div>
                ))}
            </div>

            <p className="mirror-description">
                Ready to take control of your income? Mirror Business gives you everything you need to launch your digital journey today...
            </p>
        </div>
    );
};

export default MirrorBusiness;
