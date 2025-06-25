import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import styles from '../styles/Dashboard.module.css';
const services = [
  {
    title: '01. Mirror Game',
    link: '/mirrorgame',
    img: '/img_3.png',
    content:
      'Mirror Game is an exciting part of the Mirror ecosystem that lets you play, compete, and earn rewards. Challenge yourself with fun, brain-boosting games, climb the leaderboard, and win real rewards like cashback and Mirror Points directly in your Mirror Wallet.',
  },
  {
    title: '02. Mirror Business',
    link: '/mirror_business',
    img: '/img_4.png',
    content:
      'Mirror Business is a powerful digital platform that empowers individuals and entrepreneurs to offer financial and digital services. Earn commissions with zero investment.',
  },
  {
    title: '03. Mirror Nursing',
    link: '/mirror_nursing',
    img: '/img_5.png',
    content:
      'Mirror Nursing focuses on healthcare support, nursing education, and career empowerment with digital training programs and career listings.',
  },
  {
    title: '04. Mirror Shopping',
    link: '/mirror_shopping',
    img: '/img_6.png',
    content:
      'Shop for a wide variety of products with cashback, Mirror Points, and secure wallet payments for a rewarding e-commerce experience.',
  },
  {
    title: '05. Mirror Vendors',
    link: '/mirror_vendor',
    img: '/img_7.png',
    content:
      'Mirror Vendors enables small businesses to go digital and offer bill payments, recharges, and other services to grow their business.',
  },
];

const Dashboard = () => {
  return (
    <>
      <header className={styles.mainHeader}>
        <div className={styles.logo}>Mirror Hub Dashboard</div>
        <div className={styles.profileIcon}>
          <div className={styles.blueText}>About us</div>
          <div>Login</div>
          <FaUserCircle size={25} color="#0d47a1" />
        </div>
      </header>

      <div className={styles.dashboard}>
        <div className={styles.sectionTitle}>
          <h3>Introduction</h3>
        </div>

        <div className={`${styles.Container} ${styles.description}`}>
          Mirror is India First wallet payments & Shopping app with high cashback on Recharge and utility services.
          With Mirror, we strive to bring you daily needs through your mobile phone and desktop. Mirror is committed to transforming the clarity.
        </div>

        <section className={styles.servicesSection}>
          <h2 className={styles.servicesHeading}>Our Services</h2>
          <p>
  We offer a range of digital solutions to help your business grow and thrive in today&rsquo;s competitive landscape.
</p>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <h3>Web Development</h3>
              <p>Modern, responsive websites tailored to your brand and business goals.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3>Mobile App Development</h3>
              <p>High-performance Android and iOS apps with stunning user experience.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3>Digital Marketing</h3>
              <p>SEO, social media, and paid ads to grow your online presence and revenue.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3>Cloud & Hosting</h3>
              <p>Secure, scalable cloud infrastructure and hosting solutions for your apps.</p>
            </div>
          </div>
        </section>

        {services.map((item, index) => (
          <Link key={index} href={item.link} className={styles.linkBox}>
            <div className={styles.outerContainer}>
              <div className={`${styles.innerContainer} ${styles.left}`}>
                <div className='forced-colors:**: not-target:'>
                  <h3>{item.title}</h3>
                </div>
                <div className={styles.divider}></div>
                <p>{item.content}</p>
                <div className={styles.knowMore}>
                  know more <span style={{ fontSize: '16px' }}>→</span>
                </div>
              </div>
              <div className={styles.innerContainer}>
                <Image
                  src={item.img}
                  alt={item.title}
                  width={400}
                  height={250}
                  className={styles.mirrorBoxImg}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
