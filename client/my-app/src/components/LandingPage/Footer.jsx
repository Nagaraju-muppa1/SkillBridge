import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-section">
      <p>&copy; {currentYear} SkillBridge. All rights reserved.</p>
      <p>
        Developed by: M. DurgaPrasad (22B81A05Z6), B. Harichandra Prasad
        (22B81A05Z8), M.Nagaraju (22B81A05AJ)
      </p>
    </footer>
  );
}

export default Footer;