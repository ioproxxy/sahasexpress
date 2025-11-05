
import React from 'react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "1234567890"; // Replace with your business number
  const message = "Hello Sahas Express! I need help with my order.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8 fill-current">
        <path d="M16.003 4.295c-6.398 0-11.583 5.185-11.583 11.583 0 2.946 1.123 5.613 2.97 7.64l-1.78 4.885 5.01-1.73c1.94 1.15 4.19 1.803 6.55 1.803h.003c6.397 0 11.582-5.185 11.582-11.583S22.4 4.295 16.003 4.295zm5.55 14.502c-.282.47-1.45.922-2.028 1.083-.576.16-1.18.16-1.756-.082-.577-.24-1.334-.85-2.48-1.89-1.144-1.04-2.14-2.31-2.42-2.78-.28-.47-.04-0.71.2-0.95.24-.24.51-.63.75-.85s.24-.39.36-.67c.12-.28.08-.51-.04-.67-.12-.16-1.14-2.78-1.57-3.79-.43-1.01-.85-0.85-1.18-0.85-.31 0-.67 0-1.03.04-.35.04-.92.16-1.39.81s-1.57 2.22-1.57 4.23c0 2.01 1.61 4.9 1.85 5.26.24.35 3.1 4.9 7.56 6.66 4.46 1.75 4.46 1.18 5.26 1.08.8-.12 2.5-1.04 2.86-2.01s.35-1.81.24-2.01c-.13-.2-.56-.32-.85-.47z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
