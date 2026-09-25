import React from 'react';

export const BrandLogo = ({ className = "w-10 h-10", showGlow = false }) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {showGlow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-burgundy-700/20 to-peach-500/30 rounded-2xl blur-md -z-10" />
      )}
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
      >
        {/* Left Burgundy Book Cover Backing */}
        <path
          d="M136 178C136 178 152 181 160 186V278L238 326V362L136 312V178Z"
          fill="#74122B"
        />

        {/* Left Peach Page Front */}
        <path
          d="M238 318C206 280 182 220 170 154C204 168 230 182 242 192C244 236 242 284 238 318Z"
          fill="#F59F87"
        />

        {/* Back Peach Page (Right Side Peeking) */}
        <path
          d="M246 250C258 190 295 158 342 144C354 152 362 160 364 166C360 174 352 182 344 186C306 196 268 222 246 250Z"
          fill="#F8B8A4"
        />

        {/* Main Right Peach Page */}
        <path
          d="M246 260C254 200 290 168 344 150C330 190 290 238 246 260Z"
          fill="#F59F87"
        />

        {/* Right Burgundy Book Cover / Speech Shape */}
        <path
          d="M246 252C256 204 292 184 346 178C366 178 376 186 376 202V294C376 308 366 316 348 322L250 374L246 252Z"
          fill="#74122B"
        />

        {/* Speech Bubble Dots inside Right Burgundy Cover */}
        <circle cx="286" cy="283" r="11" fill="#FAF6EE" />
        <circle cx="314" cy="273" r="11" fill="#FAF6EE" />
        <circle cx="342" cy="263" r="11" fill="#FAF6EE" />
      </svg>
    </div>
  );
};

export default BrandLogo;
