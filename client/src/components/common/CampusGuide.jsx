import React from 'react';

/**
 * CampusGuide - The unified, consistent virtual campus guide & assistant character.
 * Visual Identity:
 * - Modern, friendly university student assistant ("Aria")
 * - Palette: Deep Burgundy (#74122B / #520B1C), Peach/Coral (#F59F87 / #FFBE98), Warm Cream (#FAF6EE / #FFF8F5)
 * - Poses: 'hero', 'complaint', 'tracking', 'ai', 'privacy', 'avatar'
 */
export const CampusGuide = ({ 
  pose = 'hero', 
  className = '', 
  size = 'md',
  isHovered = false,
  onClick = null,
  animated = true 
}) => {
  // Size mappings
  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52',
    xl: 'w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64',
    hero: 'w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-72 lg:h-72',
    card: 'w-24 h-24 sm:w-32 sm:h-32'
  };

  const selectedSize = sizeClasses[size] || size;

  // Render SVG based on pose
  const renderCharacterSVG = () => {
    switch (pose) {
      /* =========================================================================
         1. HERO POSE: Welcoming standing pose, gentle wave / hand gesture
         ========================================================================= */
      case 'hero':
        return (
          <svg viewBox="0 0 240 280" className="w-full h-full drop-shadow-md select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="heroJacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C1533" />
                <stop offset="100%" stopColor="#520B1C" />
              </linearGradient>
              <linearGradient id="heroPeachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD1BA" />
                <stop offset="100%" stopColor="#F59F87" />
              </linearGradient>
              <linearGradient id="heroSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDDFD0" />
                <stop offset="100%" stopColor="#F3C3B1" />
              </linearGradient>
              <linearGradient id="heroHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3D1A24" />
                <stop offset="100%" stopColor="#20060E" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ambient Background Aura */}
            <circle cx="120" cy="140" r="90" fill="url(#heroPeachGrad)" opacity="0.15" />
            <circle cx="120" cy="140" r="70" fill="#8C1533" opacity="0.08" />

            {/* Legs & Lower Body */}
            <path d="M96 220 L94 270" stroke="#3A141E" strokeWidth="10" strokeLinecap="round" />
            <path d="M144 220 L146 270" stroke="#3A141E" strokeWidth="10" strokeLinecap="round" />
            {/* Shoes */}
            <ellipse cx="91" cy="272" rx="12" ry="5" fill="#520B1C" />
            <ellipse cx="149" cy="272" rx="12" ry="5" fill="#520B1C" />

            {/* Torso & Burgundy University Jacket */}
            <path d="M80 145 C75 180 85 225 90 225 L150 225 C155 225 165 180 160 145 Z" fill="url(#heroJacketGrad)" />
            {/* Inner Cream Shirt with Peach Collar Accent */}
            <path d="M106 145 L120 185 L134 145 Z" fill="#FFFDF8" />
            <path d="M104 145 L120 178 L112 145 Z" fill="url(#heroPeachGrad)" opacity="0.9" />
            <path d="M136 145 L120 178 L128 145 Z" fill="url(#heroPeachGrad)" opacity="0.9" />
            {/* Jacket Lapels */}
            <path d="M86 145 L112 195 L106 225 L88 225 Z" fill="#630D22" />
            <path d="M154 145 L128 195 L134 225 L152 225 Z" fill="#630D22" />

            {/* Campus Voice Shield Badge */}
            <g transform="translate(94, 168) scale(0.7)">
              <path d="M0 2 C6 0 14 0 20 2 C20 12 16 20 10 24 C4 20 0 12 0 2 Z" fill="#F59F87" />
              <path d="M3 4 C7 3 13 3 17 4 C17 11 14 17 10 20 C6 17 3 11 3 4 Z" fill="#8C1533" />
            </g>

            {/* Left Arm: Resting naturally */}
            <path d="M82 150 C68 175 66 195 72 210" stroke="url(#heroJacketGrad)" strokeWidth="14" strokeLinecap="round" />
            <circle cx="73" cy="214" r="7" fill="url(#heroSkinGrad)" />

            {/* Right Arm: Welcoming gentle wave gesture */}
            <g className={animated ? "animate-guide-wave origin-[155px_150px]" : ""}>
              <path d="M156 150 C175 165 186 150 192 132" stroke="url(#heroJacketGrad)" strokeWidth="14" strokeLinecap="round" />
              {/* Hand in friendly open palm */}
              <circle cx="194" cy="126" r="7" fill="url(#heroSkinGrad)" />
              <path d="M192 124 L200 116" stroke="url(#heroSkinGrad)" strokeWidth="4" strokeLinecap="round" />
              <path d="M194 122 L202 119" stroke="url(#heroSkinGrad)" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Neck */}
            <rect x="113" y="128" width="14" height="18" rx="7" fill="url(#heroSkinGrad)" />

            {/* Head / Face */}
            <g className={animated ? "animate-guide-head origin-[120px_100px]" : ""}>
              {/* Back Hair */}
              <ellipse cx="120" cy="98" rx="34" ry="38" fill="url(#heroHairGrad)" />
              
              {/* Face Shape */}
              <path d="M96 95 C96 122 106 132 120 132 C134 132 144 122 144 95 C144 75 134 68 120 68 C106 68 96 75 96 95 Z" fill="url(#heroSkinGrad)" />

              {/* Ears */}
              <ellipse cx="94" cy="96" rx="4" ry="7" fill="url(#heroSkinGrad)" />
              <ellipse cx="146" cy="96" rx="4" ry="7" fill="url(#heroSkinGrad)" />
              {/* Friendly Peach Blush */}
              <circle cx="104" cy="104" r="5" fill="#F59F87" opacity="0.45" />
              <circle cx="136" cy="104" r="5" fill="#F59F87" opacity="0.45" />

              {/* Friendly Sparkly Eyes */}
              <ellipse cx="108" cy="95" rx="3.2" ry="4.2" fill="#2B0E17" />
              <circle cx="109.2" cy="93.8" r="1.2" fill="#FFFFFF" />
              <ellipse cx="132" cy="95" rx="3.2" ry="4.2" fill="#2B0E17" />
              <circle cx="133.2" cy="93.8" r="1.2" fill="#FFFFFF" />

              {/* Modern Sleek Eyeglasses */}
              <rect x="101" y="88" width="15" height="13" rx="4" stroke="#74122B" strokeWidth="1.6" fill="none" opacity="0.85" />
              <rect x="124" y="88" width="15" height="13" rx="4" stroke="#74122B" strokeWidth="1.6" fill="none" opacity="0.85" />
              <path d="M116 93 L124 93" stroke="#74122B" strokeWidth="1.6" />

              {/* Gentle Warm Smile */}
              <path d="M113 112 Q120 119 127 112" stroke="#74122B" strokeWidth="2.4" strokeLinecap="round" fill="none" />

              {/* Front Modern Styled Hair */}
              <path d="M92 84 C100 60 140 56 148 78 C136 70 118 70 102 82 Z" fill="url(#heroHairGrad)" />
              <path d="M94 85 C98 94 100 102 96 110 C92 98 90 90 94 85 Z" fill="url(#heroHairGrad)" />
              <path d="M146 85 C142 94 140 102 144 110 C148 98 150 90 146 85 Z" fill="url(#heroHairGrad)" />
            </g>
          </svg>
        );

      /* =========================================================================
         2. COMPLAINT POSE: Holding a verification clipboard / checklist & pen
         ========================================================================= */
      case 'complaint':
        return (
          <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="compJacket" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C1533" />
                <stop offset="100%" stopColor="#520B1C" />
              </linearGradient>
              <linearGradient id="compSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDDFD0" />
                <stop offset="100%" stopColor="#F3C3B1" />
              </linearGradient>
              <linearGradient id="compHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3D1A24" />
                <stop offset="100%" stopColor="#20060E" />
              </linearGradient>
            </defs>

            {/* Torso */}
            <path d="M68 125 C64 155 70 195 75 195 L125 195 C130 195 136 155 132 125 Z" fill="url(#compJacket)" />
            <path d="M88 125 L100 155 L112 125 Z" fill="#FFFDF8" />
            <path d="M86 125 L100 150 L94 125 Z" fill="#F59F87" />
            <path d="M114 125 L100 150 L106 125 Z" fill="#F59F87" />

            {/* Arms Holding Clipboard */}
            {/* Left Arm holding board */}
            <path d="M70 130 C60 155 70 178 85 180" stroke="url(#compJacket)" strokeWidth="11" strokeLinecap="round" />
            {/* Right Arm holding pen & pointing */}
            <path d="M130 130 C140 150 135 168 120 174" stroke="url(#compJacket)" strokeWidth="11" strokeLinecap="round" />

            {/* Modern Clipboard with Checkmarks */}
            <g transform="translate(74, 138) rotate(-4)">
              <rect x="0" y="0" width="48" height="62" rx="6" fill="#FDFBF7" stroke="#8C1533" strokeWidth="2" />
              <rect x="15" y="-4" width="18" height="7" rx="3" fill="#8C1533" />
              {/* Lines & Checkmarks */}
              <circle cx="10" cy="14" r="3" fill="#F59F87" />
              <line x1="18" y1="14" x2="38" y2="14" stroke="#74122B" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="26" r="3" fill="#F59F87" />
              <line x1="18" y1="26" x2="40" y2="26" stroke="#74122B" strokeWidth="2" strokeLinecap="round" />
              <circle cx="10" cy="38" r="3" fill="#F59F87" />
              <line x1="18" y1="38" x2="34" y2="38" stroke="#74122B" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 48 L20 48" stroke="#F59F87" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Hands */}
            <circle cx="77" cy="172" r="5" fill="url(#compSkin)" />
            <circle cx="118" cy="172" r="5" fill="url(#compSkin)" />
            {/* Stylus / Pen */}
            <line x1="116" y1="174" x2="108" y2="164" stroke="#F59F87" strokeWidth="3" strokeLinecap="round" />

            {/* Head */}
            <rect x="94" y="112" width="12" height="16" rx="6" fill="url(#compSkin)" />
            <ellipse cx="100" cy="85" rx="28" ry="32" fill="url(#compHair)" />
            <path d="M80 82 C80 106 88 116 100 116 C112 116 120 106 120 82 C120 64 112 58 100 58 C88 58 80 64 80 82 Z" fill="url(#compSkin)" />
            
            <circle cx="87" cy="92" r="4" fill="#F59F87" opacity="0.4" />
            <circle cx="113" cy="92" r="4" fill="#F59F87" opacity="0.4" />
            <ellipse cx="90" cy="83" rx="2.8" ry="3.5" fill="#2B0E17" />
            <circle cx="91" cy="82" r="1" fill="#FFFFFF" />
            <ellipse cx="110" cy="83" rx="2.8" ry="3.5" fill="#2B0E17" />
            <circle cx="111" cy="82" r="1" fill="#FFFFFF" />

            {/* Glasses */}
            <rect x="84" y="77" width="13" height="11" rx="3" stroke="#74122B" strokeWidth="1.4" fill="none" opacity="0.85" />
            <rect x="103" y="77" width="13" height="11" rx="3" stroke="#74122B" strokeWidth="1.4" fill="none" opacity="0.85" />
            <line x1="97" y1="81" x2="103" y2="81" stroke="#74122B" strokeWidth="1.4" />

            <path d="M94 100 Q100 106 106 100" stroke="#74122B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M76 72 C84 52 116 48 124 66 C114 60 98 60 84 70 Z" fill="url(#compHair)" />
          </svg>
        );

      /* =========================================================================
         3. TRACKING POSE: Looking through / holding a glowing digital scanner
         ========================================================================= */
      case 'tracking':
        return (
          <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="trackJacket" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C1533" />
                <stop offset="100%" stopColor="#520B1C" />
              </linearGradient>
              <linearGradient id="trackSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDDFD0" />
                <stop offset="100%" stopColor="#F3C3B1" />
              </linearGradient>
              <linearGradient id="trackHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3D1A24" />
                <stop offset="100%" stopColor="#20060E" />
              </linearGradient>
              <linearGradient id="trackScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF8F5" />
                <stop offset="100%" stopColor="#FFEDDF" />
              </linearGradient>
            </defs>

            {/* Torso */}
            <path d="M68 125 C64 155 70 195 75 195 L125 195 C130 195 136 155 132 125 Z" fill="url(#trackJacket)" />
            <path d="M88 125 L100 155 L112 125 Z" fill="#FFFDF8" />
            <path d="M86 125 L100 150 L94 125 Z" fill="#F59F87" />
            <path d="M114 125 L100 150 L106 125 Z" fill="#F59F87" />

            {/* Arms holding tablet */}
            <path d="M70 132 C62 155 72 176 86 178" stroke="url(#trackJacket)" strokeWidth="11" strokeLinecap="round" />
            <path d="M130 132 C138 155 128 176 114 178" stroke="url(#trackJacket)" strokeWidth="11" strokeLinecap="round" />

            {/* Glowing Tracker Tablet Device */}
            <g transform="translate(68, 142)">
              <rect x="0" y="0" width="64" height="46" rx="6" fill="#1B060D" stroke="#F59F87" strokeWidth="1.8" />
              <rect x="4" y="4" width="56" height="38" rx="4" fill="url(#trackScreenGrad)" />
              {/* ID Badge Search Visual */}
              <text x="8" y="16" fill="#74122B" fontSize="7" fontWeight="bold" fontFamily="monospace">CV-A82F91</text>
              <rect x="8" y="22" width="28" height="4" rx="2" fill="#74122B" opacity="0.6" />
              <rect x="8" y="29" width="40" height="4" rx="2" fill="#F59F87" opacity="0.8" />
              {/* Green/Peach Status Dot */}
              <circle cx="50" cy="14" r="3" fill="#10B981" />
            </g>

            {/* Hands Holding Device */}
            <circle cx="68" cy="166" r="5" fill="url(#trackSkin)" />
            <circle cx="132" cy="166" r="5" fill="url(#trackSkin)" />

            {/* Head looking slightly down attentively */}
            <rect x="94" y="112" width="12" height="16" rx="6" fill="url(#trackSkin)" />
            <ellipse cx="100" cy="85" rx="28" ry="32" fill="url(#trackHair)" />
            <path d="M80 82 C80 106 88 116 100 116 C112 116 120 106 120 82 C120 64 112 58 100 58 C88 58 80 64 80 82 Z" fill="url(#trackSkin)" />
            
            <circle cx="87" cy="93" r="4" fill="#F59F87" opacity="0.4" />
            <circle cx="113" cy="93" r="4" fill="#F59F87" opacity="0.4" />
            {/* Eyes focused slightly downward */}
            <ellipse cx="90" cy="86" rx="2.8" ry="3.5" fill="#2B0E17" />
            <circle cx="91" cy="86" r="1" fill="#FFFFFF" />
            <ellipse cx="110" cy="86" rx="2.8" ry="3.5" fill="#2B0E17" />
            <circle cx="111" cy="86" r="1" fill="#FFFFFF" />

            {/* Glasses */}
            <rect x="84" y="79" width="13" height="11" rx="3" stroke="#74122B" strokeWidth="1.4" fill="none" opacity="0.85" />
            <rect x="103" y="79" width="13" height="11" rx="3" stroke="#74122B" strokeWidth="1.4" fill="none" opacity="0.85" />
            <line x1="97" y1="83" x2="103" y2="83" stroke="#74122B" strokeWidth="1.4" />

            <path d="M94 103 Q100 108 106 103" stroke="#74122B" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M76 72 C84 52 116 48 124 66 C114 60 98 60 84 70 Z" fill="url(#trackHair)" />
          </svg>
        );

      /* =========================================================================
         4. AI TRIAGE POSE: Modern Laptop & AI Sparkle Intelligence
         ========================================================================= */
      case 'ai':
        return (
          <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="aiJacket" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C1533" />
                <stop offset="100%" stopColor="#520B1C" />
              </linearGradient>
              <linearGradient id="aiSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDDFD0" />
                <stop offset="100%" stopColor="#F3C3B1" />
              </linearGradient>
              <linearGradient id="aiHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3D1A24" />
                <stop offset="100%" stopColor="#20060E" />
              </linearGradient>
              <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#FAF4EB" />
              </linearGradient>
            </defs>

            {/* AI Sparkles floating */}
            <g className={animated ? "animate-pulse" : ""}>
              <path d="M38 60 L41 68 L49 71 L41 74 L38 82 L35 74 L27 71 L35 68 Z" fill="#F59F87" opacity="0.85" />
              <path d="M162 48 L164 54 L170 56 L164 58 L162 64 L160 58 L154 56 L160 54 Z" fill="#8C1533" opacity="0.75" />
            </g>

            {/* Torso */}
            <path d="M68 125 C64 155 70 195 75 195 L125 195 C130 195 136 155 132 125 Z" fill="url(#aiJacket)" />
            <path d="M88 125 L100 155 L112 125 Z" fill="#FFFDF8" />
            <path d="M86 125 L100 150 L94 125 Z" fill="#F59F87" />
            <path d="M114 125 L100 150 L106 125 Z" fill="#F59F87" />

            {/* Arms at Keyboard */}
            <path d="M70 132 C62 152 70 172 82 176" stroke="url(#aiJacket)" strokeWidth="11" strokeLinecap="round" />
            <path d="M130 132 C138 152 130 172 118 176" stroke="url(#aiJacket)" strokeWidth="11" strokeLinecap="round" />

            {/* Sleek Laptop Screen & Keyboard */}
            <g transform="translate(62, 144)">
              {/* Screen Base */}
              <polygon points="12,38 64,38 72,48 4,48" fill="#520B1C" stroke="#F59F87" strokeWidth="1.2" />
              {/* Open Screen Lid */}
              <rect x="14" y="0" width="48" height="36" rx="4" fill="#20060E" stroke="#8C1533" strokeWidth="1.6" />
              <rect x="18" y="4" width="40" height="28" rx="2" fill="url(#laptopGrad)" />
              {/* Code / Triage Chart lines on screen */}
              <rect x="22" y="8" width="22" height="3" rx="1.5" fill="#8C1533" />
              <rect x="22" y="14" width="32" height="2.5" rx="1.2" fill="#F59F87" />
              <rect x="22" y="19" width="18" height="2.5" rx="1.2" fill="#8C1533" />
              <rect x="22" y="24" width="28" height="2.5" rx="1.2" fill="#74122B" />
              {/* Campus Voice mini logo on laptop back (subtle glow) */}
              <circle cx="38" cy="18" r="4" fill="#F59F87" opacity="0.3" />
            </g>

            {/* Hands on Keyboard */}
            <circle cx="80" cy="182" r="4.5" fill="url(#aiSkin)" />
            <circle cx="120" cy="182" r="4.5" fill="url(#aiSkin)" />

            {/* Head */}
            <rect x="94" y="112" width="12" height="16" rx="6" fill="url(#aiSkin)" />
            <ellipse cx="100" cy="85" rx="28" ry="32" fill="url(#aiHair)" />
            <path d="M80 82 C80 106 88 116 100 116 C112 116 120 106 120 82 C120 64 112 58 100 58 C88 58 80 64 80 82 Z" fill="url(#aiSkin)" />
            
            <circle cx="87" cy="92" r="4" fill="#F59F87" opacity="0.4" />
            <circle cx="113" cy="92" r="4" fill="#F59F87" opacity="0.4" />
            <ellipse cx="90" cy="83" rx="2.8" ry="3.5" fill="#2B0E17" />
            <circle cx="91" cy="82" r="1" fill="#FFFFFF" />
            <ellipse cx="110" cy="83" rx="2.8" ry="3.5" fill="#2B0E17" />
            <circle cx="111" cy="82" r="1" fill="#FFFFFF" />

            {/* Glasses */}
            <rect x="84" y="77" width="13" height="11" rx="3" stroke="#74122B" strokeWidth="1.4" fill="none" opacity="0.85" />
            <rect x="103" y="77" width="13" height="11" rx="3" stroke="#74122B" strokeWidth="1.4" fill="none" opacity="0.85" />
            <line x1="97" y1="81" x2="103" y2="81" stroke="#74122B" strokeWidth="1.4" />

            <path d="M94 100 Q100 106 106 100" stroke="#74122B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M76 72 C84 52 116 48 124 66 C114 60 98 60 84 70 Z" fill="url(#aiHair)" />
          </svg>
        );

      /* =========================================================================
         5. PRIVACY POSE: Standing beside a glowing cryptographic security shield
         ========================================================================= */
      case 'privacy':
        return (
          <svg viewBox="0 0 220 230" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="privJacket" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C1533" />
                <stop offset="100%" stopColor="#520B1C" />
              </linearGradient>
              <linearGradient id="privSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDDFD0" />
                <stop offset="100%" stopColor="#F3C3B1" />
              </linearGradient>
              <linearGradient id="privHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3D1A24" />
                <stop offset="100%" stopColor="#20060E" />
              </linearGradient>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59F87" />
                <stop offset="100%" stopColor="#8C1533" />
              </linearGradient>
            </defs>

            {/* Giant Cryptographic Security Shield beside character */}
            <g transform="translate(132, 85)">
              <path d="M0 6 C20 0 46 0 66 6 C66 42 52 70 33 84 C14 70 0 42 0 6 Z" fill="url(#shieldGrad)" />
              <path d="M6 11 C22 6 44 6 60 11 C60 38 48 62 33 74 C18 62 6 38 6 11 Z" fill="#1B060D" opacity="0.85" />
              {/* Lock Emblem */}
              <rect x="23" y="36" width="20" height="16" rx="4" fill="#F59F87" />
              <path d="M27 36 L27 28 C27 24 39 24 39 28 L39 36" stroke="#F59F87" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <circle cx="33" cy="43" r="2.5" fill="#520B1C" />
              <line x1="33" y1="44" x2="33" y2="48" stroke="#520B1C" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Torso */}
            <path d="M58 135 C54 165 60 205 65 205 L115 205 C120 205 126 165 122 135 Z" fill="url(#privJacket)" />
            <path d="M78 135 L90 165 L102 135 Z" fill="#FFFDF8" />
            <path d="M76 135 L90 160 L84 135 Z" fill="#F59F87" />
            <path d="M104 135 L90 160 L96 135 Z" fill="#F59F87" />

            {/* Left Arm: Resting confidently on hip */}
            <path d="M60 140 C45 160 52 178 62 180" stroke="url(#privJacket)" strokeWidth="11" strokeLinecap="round" />
            <circle cx="64" cy="180" r="5" fill="url(#privSkin)" />

            {/* Right Arm: Confidently touching/supporting the shield */}
            <path d="M120 140 C136 150 142 142 144 132" stroke="url(#privJacket)" strokeWidth="11" strokeLinecap="round" />
            <circle cx="146" cy="128" r="5" fill="url(#privSkin)" />

            {/* Head */}
            <rect x="84" y="122" width="12" height="16" rx="6" fill="url(#privSkin)" />
            <ellipse cx="90" cy="95" rx="28" ry="32" fill="url(#privHair)" />
            <path d="M70 92 C70 116 78 126 90 126 C102 126 110 116 110 92 C110 74 102 68 90 68 C78 68 70 74 70 92 Z" fill="url(#privSkin)" />
            
            <circle cx="77" cy="102" r="4" fill="#F59F87" opacity="0.4" />
            <circle cx="103" cy="102" r="4" fill="#F59F87" opacity="0.4" />
            <ellipse cx="80" cy="93" rx="2.8" ry="3.5" fill="#2B0E17" />
            <circle cx="81" cy="92" r="1" fill="#FFFFFF" />
            <ellipse cx="100" cy="93" rx="2.8" ry="3.5" fill="#2B0E17" />
            <circle cx="101" cy="92" r="1" fill="#FFFFFF" />

            {/* Glasses */}
            <rect x="74" y="87" width="13" height="11" rx="3" stroke="#74122B" strokeWidth="1.4" fill="none" opacity="0.85" />
            <rect x="93" y="87" width="13" height="11" rx="3" stroke="#74122B" strokeWidth="1.4" fill="none" opacity="0.85" />
            <line x1="87" y1="91" x2="93" y2="91" stroke="#74122B" strokeWidth="1.4" />

            {/* Confident reassuring smile */}
            <path d="M84 110 Q90 116 96 110" stroke="#74122B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M66 82 C74 62 106 58 114 76 C104 70 88 70 74 80 Z" fill="url(#privHair)" />
          </svg>
        );

      /* =========================================================================
         6. AVATAR POSE: Circular profile badge for Chatbot widget & small UI items
         ========================================================================= */
      case 'avatar':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="avBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8C1533" />
                <stop offset="100%" stopColor="#520B1C" />
              </linearGradient>
              <linearGradient id="avSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDDFD0" />
                <stop offset="100%" stopColor="#F3C3B1" />
              </linearGradient>
              <linearGradient id="avHair" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3D1A24" />
                <stop offset="100%" stopColor="#20060E" />
              </linearGradient>
            </defs>

            {/* Circle Background */}
            <circle cx="50" cy="50" r="48" fill="url(#avBg)" />
            <circle cx="50" cy="50" r="46" fill="#FAF6EE" className="dark:fill-[#20060E]" />

            {/* Jacket Collar */}
            <path d="M28 88 C32 75 42 70 50 70 C58 70 68 75 72 88 Z" fill="#8C1533" />
            <path d="M42 70 L50 82 L58 70 Z" fill="#FFFDF8" />
            <path d="M40 70 L50 80 L46 70 Z" fill="#F59F87" />
            <path d="M60 70 L50 80 L54 70 Z" fill="#F59F87" />

            {/* Neck */}
            <rect x="46" y="58" width="8" height="12" rx="4" fill="url(#avSkin)" />

            {/* Head & Face */}
            <ellipse cx="50" cy="42" rx="18" ry="20" fill="url(#avHair)" />
            <path d="M37 40 C37 54 42 60 50 60 C58 60 63 54 63 40 C63 28 58 24 50 24 C42 24 37 28 37 40 Z" fill="url(#avSkin)" />

            {/* Blush */}
            <circle cx="41" cy="47" r="2.5" fill="#F59F87" opacity="0.5" />
            <circle cx="59" cy="47" r="2.5" fill="#F59F87" opacity="0.5" />

            {/* Eyes */}
            <ellipse cx="44" cy="41" rx="1.8" ry="2.4" fill="#2B0E17" />
            <circle cx="44.6" cy="40.3" r="0.8" fill="#FFFFFF" />
            <ellipse cx="56" cy="41" rx="1.8" ry="2.4" fill="#2B0E17" />
            <circle cx="56.6" cy="40.3" r="0.8" fill="#FFFFFF" />

            {/* Sleek Glasses */}
            <rect x="39.5" y="36.5" width="9" height="8" rx="2" stroke="#74122B" strokeWidth="1" fill="none" opacity="0.85" />
            <rect x="51.5" y="36.5" width="9" height="8" rx="2" stroke="#74122B" strokeWidth="1" fill="none" opacity="0.85" />
            <line x1="48.5" y1="39.5" x2="51.5" y2="39.5" stroke="#74122B" strokeWidth="1" />

            {/* Smile */}
            <path d="M46 51 Q50 54 54 51" stroke="#74122B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Hair Bangs */}
            <path d="M35 34 C40 20 60 18 65 30 C58 26 48 26 39 33 Z" fill="url(#avHair)" />
          </svg>
        );
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-300 ${selectedSize} ${className} ${
        isHovered ? 'scale-105 -translate-y-1' : ''
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {renderCharacterSVG()}
    </div>
  );
};

export default CampusGuide;
