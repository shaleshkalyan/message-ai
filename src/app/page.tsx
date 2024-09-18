"use client";

import React from 'react';
import styles from './page.module.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Mystery Message</h1>
        <p>Your gateway to encrypted communication.</p>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.introSection}>
          <h2>Discover the Mystery</h2>
          <p>
            Dive into a world where your messages are encrypted and protected. With Mystery Message, you can send and receive secret messages with ease.
          </p>
          <Button
            className={styles.getStartedButton}
            onClick={() => window.location.href = '/sign-up'}
          >
            Get Started
          </Button>
        </section>

        <section className={styles.featuresSection}>
          <h2>Features</h2>
          <Card>
            <ul>
              <li>🔐 Secure Encryption</li>
              <li>📩 Easy Messaging</li>
              <li>🔍 Anonymous Communication</li>
            </ul>
          </Card>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Mystery Message @Shalesh Kalyan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;