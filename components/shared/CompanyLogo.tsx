'use client'

import React from 'react'

export interface CompanyLogoProps {
  company: string
  companyId?: string
  size?: number
  className?: string
  variant?: 'square' | 'rounded' | 'circle'
}

function normalizeKey(str: string): string {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function CompanyLogo({
  company,
  companyId,
  size = 24,
  className = '',
  variant = 'rounded',
}: CompanyLogoProps) {
  const rawKey = companyId || company || ''
  const key = normalizeKey(rawKey)

  const borderRadiusClass =
    variant === 'circle'
      ? 'rounded-full'
      : variant === 'square'
      ? 'rounded-none'
      : 'rounded-md'

  const renderSvg = () => {
    switch (key) {
      // 1. Amazon
      case 'amazon':
        return (
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-0.5">
            <path d="M4 15.2c4.8 3.2 11.8 3.2 16 0" stroke="#FF9900" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M17.8 14.2l2.6 1.6l-1.6 2.6" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 6.5a4.8 4.8 0 0 1 8.5 0v4.2" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )

      // 2. Microsoft
      case 'microsoft':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1">
            <rect x="2.5" y="2.5" width="8.5" height="8.5" fill="#F25022" rx="0.5" />
            <rect x="13" y="2.5" width="8.5" height="8.5" fill="#7FBA00" rx="0.5" />
            <rect x="2.5" y="13" width="8.5" height="8.5" fill="#00A4EF" rx="0.5" />
            <rect x="13" y="13" width="8.5" height="8.5" fill="#FFB900" rx="0.5" />
          </svg>
        )

      // 3. Google
      case 'google':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <path d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.22-.92 2.25-1.95 2.94v2.44h3.16c1.85-1.7 2.92-4.21 2.92-7.14 0-.42-.03-.84-.23-1.22z" fill="#4285F4" />
            <path d="M12.18 20.45c2.65 0 4.87-.88 6.5-2.39l-3.16-2.45c-.88.59-2 .94-3.34.94-2.57 0-4.75-1.73-5.53-4.07H3.39v2.53a9.98 9.98 0 0 0 8.79 5.44z" fill="#34A853" />
            <path d="M6.65 12.48c-.2-.59-.31-1.22-.31-1.87 0-.65.11-1.28.31-1.87V6.21H3.39a9.99 9.99 0 0 0 0 9.07l3.26-2.8z" fill="#FBBC05" />
            <path d="M12.18 4.75c1.44 0 2.74.5 3.76 1.47l2.82-2.82C17.04 1.83 14.82 1 12.18 1 7.6 1 3.78 3.58 3.39 6.21l3.26 2.53c.78-2.34 2.96-4.07 5.53-4.07z" fill="#EA4335" />
          </svg>
        )

      // 4. Meta
      case 'meta':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#0668E1">
            <path d="M16.7 5.2c-2.3 0-4.3 1.5-4.7 3.6-.4-2.1-2.4-3.6-4.7-3.6C4.4 5.2 2 7.7 2 11.2c0 4.4 3.7 7.6 10 7.6s10-3.2 10-7.6c0-3.5-2.4-6-5.3-6zm-9.4 9.8c-2 0-3.4-1.5-3.4-3.8 0-2.3 1.4-3.8 3.4-3.8 1.9 0 3.3 1.5 3.3 3.8 0 2.3-1.4 3.8-3.3 3.8zm9.4 0c-1.9 0-3.3-1.5-3.3-3.8 0-2.3 1.4-3.8 3.3-3.8 2 0 3.4 1.5 3.4 3.8 0 2.3-1.4 3.8-3.4 3.8z" />
          </svg>
        )

      // 5. Apple
      case 'apple':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#FFFFFF">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.61-.74 1.02-1.77.91-2.8-.88.04-1.95.59-2.58 1.33-.56.64-.99 1.68-.86 2.68 1 .08 2.01-.52 2.53-1.21z" />
          </svg>
        )

      // 6. Netflix
      case 'netflix':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="#E50914">
            <path d="M4 2v20l4-2V4L4 2zm12 0l-4 16h4V2zm0 20l4-2V2h-4v20z" />
          </svg>
        )

      // 7. NVIDIA
      case 'nvidia':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="#76B900">
            <path d="M4.5 12c0-3.6 2.4-6.6 5.8-7.5v2.2C8 7.5 6.7 9.6 6.7 12s1.3 4.5 3.6 5.3v2.2C6.9 18.6 4.5 15.6 4.5 12zm8.5-9v2.1c4.5.9 7.8 4.8 7.8 9.5s-3.3 8.6-7.8 9.5v2.1c5.6-1 9.8-5.8 9.8-11.6s-4.2-10.6-9.8-11.6zm-1.5 5.2v7.6c-2.1-.5-3.6-2.4-3.6-4.6 0-2.2 1.5-4.1 3.6-4.6z" />
          </svg>
        )

      // 8. Adobe
      case 'adobe':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#FF0000">
            <path d="M14.5 3H21v18l-6.5-18zM9.5 3H3v18l6.5-18zm2.5 7.5L16.2 21h-3.4l-1.3-3.2h-3L12 10.5z" />
          </svg>
        )

      // 9. Oracle
      case 'oracle':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#F80000">
            <path d="M16.5 6h-9C4.46 6 2 8.46 2 11.5S4.46 17 7.5 17h9c3.04 0 5.5-2.46 5.5-5.5S19.54 6 16.5 6zm0 8.5h-9c-1.66 0-3-1.34-3-3s1.34-3 3-3h9c1.66 0 3 1.34 3 3s-1.34 3-3 3z" />
          </svg>
        )

      // 10. Uber
      case 'uber':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#FFFFFF">
            <circle cx="12" cy="12" r="9" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            <rect x="8.5" y="8.5" width="7" height="7" fill="#FFFFFF" />
          </svg>
        )

      // 11. Atlassian
      case 'atlassian':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#0052CC">
            <path d="M11.5 2.5a.8.8 0 0 0-1.2.6C9.1 6.8 8 11.5 8.8 15.5c.3 1.7 1.3 3.3 2.7 4.3c.4.3.9 0 .9-.5V2.5zm1 18.9c2.3-.6 4.3-2.6 4.7-5.1c.6-3.8-.5-7.9-2.4-11.4a.8.8 0 0 0-1.3-.1c-1.3 2.6-2 5.6-1.8 8.6c.1 2.8 1.1 5.5 2.6 7.6z" />
          </svg>
        )

      // 12. Salesforce
      case 'salesforce':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="#00A1E0">
            <path d="M19.4 9.2a4.4 4.4 0 0 0-3.8-2.2c-.6 0-1.2.1-1.8.4A6.1 6.1 0 0 0 4.6 10a4.3 4.3 0 0 0-2.6 3.9c0 2.4 2 4.4 4.4 4.4h12.8c2.1 0 3.8-1.7 3.8-3.8c0-2-1.5-3.7-3.6-5.3z" />
          </svg>
        )

      // 13. Walmart
      case 'walmart':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="#FFC220">
            <path d="M12 2a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 3 0v-4A1.5 1.5 0 0 0 12 2zm0 14.5a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 3 0v-4a1.5 1.5 0 0 0-1.5-1.5zM3.5 7.5a1.5 1.5 0 0 0-.5 2l3.5 2a1.5 1.5 0 0 0 1.5-2.6l-3.5-2a1.5 1.5 0 0 0-1-.4zm12.5 7.2a1.5 1.5 0 0 0-.5 2l3.5 2a1.5 1.5 0 0 0 1.5-2.6l-3.5-2a1.5 1.5 0 0 0-1 .6zm-12.5 2.3a1.5 1.5 0 0 0 1 2.5l3.5-2a1.5 1.5 0 0 0-1.5-2.6l-3.5 2a1.5 1.5 0 0 0 .5.1zm14.5-8.8a1.5 1.5 0 0 0-1.5 2.6l3.5 2a1.5 1.5 0 0 0 1.5-2.6l-3.5-2z" />
          </svg>
        )

      // 14. Flipkart
      case 'flipkart':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <path d="M6 3h12v18H6z" fill="#2874F0" rx="2" />
            <path d="M10 8h5M10 12h3M10 16h1.5" stroke="#FFE500" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        )

      // 15. TCS
      case 'tcs':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#60A5FA">
            <path d="M3 6h6v3H6v9H3V6zm7 0h7v3h-2v9h-3V9h-2V6zm8 0h3v12h-3V6z" />
          </svg>
        )

      // 16. Infosys
      case 'infosys':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#38BDF8">
            <path d="M3 6h3v12H3V6zm5 0h3v4.5h3V6h3v12h-3v-4.5h-3V18H8V6zm11 0h3v12h-3V6z" />
          </svg>
        )

      // 17. Wipro
      case 'wipro':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <circle cx="6" cy="12" r="3" fill="#E53935" />
            <circle cx="12" cy="7" r="2.8" fill="#FDD835" />
            <circle cx="18" cy="12" r="3" fill="#43A047" />
            <circle cx="12" cy="17" r="2.8" fill="#1E88E5" />
          </svg>
        )

      // 18. Accenture
      case 'accenture':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1">
            <path d="M4 17l8-8l8 8" stroke="#A100FF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M16 7h4v4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )

      // 19. IBM
      case 'ibm':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="#60A5FA">
            <path d="M2 5h20v2H2zm0 4h20v2H2zm0 4h20v2H2zm0 4h20v2H2z" />
          </svg>
        )

      // 20. Cisco
      case 'cisco':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="#1BA0D7">
            <rect x="2" y="14" width="2" height="6" rx="1" />
            <rect x="6" y="9" width="2" height="11" rx="1" />
            <rect x="11" y="4" width="2" height="16" rx="1" />
            <rect x="16" y="9" width="2" height="11" rx="1" />
            <rect x="20" y="14" width="2" height="6" rx="1" />
          </svg>
        )

      // 21. Intel
      case 'intel':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#0068B5">
            <path d="M12 3a9 9 0 1 0 9 9h-2.5a6.5 6.5 0 1 1-6.5-6.5V3z" />
            <circle cx="12" cy="12" r="3.5" fill="#38BDF8" />
          </svg>
        )

      // 22. Qualcomm
      case 'qualcomm':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#3253DC">
            <circle cx="12" cy="12" r="8" stroke="#38BDF8" strokeWidth="2.4" fill="none" />
            <path d="M15 15l4 4" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )

      // 23. AMD
      case 'amd':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#ED1C24">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zm0 10h8v8h-8v-8z" />
          </svg>
        )

      // 24. Samsung
      case 'samsung':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#1428A0">
            <ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(-15 12 12)" stroke="#38BDF8" strokeWidth="2.2" fill="none" />
            <text x="12" y="14" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">S</text>
          </svg>
        )

      // 25. Goldman Sachs
      case 'goldmansachs':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="#7399C6">
            <rect x="2" y="2" width="20" height="20" rx="2" fill="#1A293E" stroke="#7399C6" strokeWidth="1.5" />
            <text x="12" y="15" fill="#93C5FD" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="serif">GS</text>
          </svg>
        )

      // 26. JPMorgan Chase
      case 'jpmorgan':
      case 'jpmorganchase':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#004B87">
            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="#0E2238" stroke="#60A5FA" strokeWidth="1.8" />
            <text x="12" y="15" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">JPM</text>
          </svg>
        )

      // 27. Morgan Stanley
      case 'morganstanley':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#002B49">
            <path d="M4 18L12 4l8 14H4z" fill="#0B1E33" stroke="#93C5FD" strokeWidth="1.8" />
            <path d="M8 15l4-7l4 7H8z" fill="#93C5FD" />
          </svg>
        )

      // 28. Citadel
      case 'citadel':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#38BDF8">
            <path d="M4 18V8l3-3v13H4zm6 0V4l3-2v16h-3zm6 0V8l3-3v13h-3z" />
          </svg>
        )

      // 29. Bloomberg
      case 'bloomberg':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#4361EE">
            <circle cx="8" cy="8" r="4" fill="#818CF8" />
            <circle cx="16" cy="16" r="4" fill="#818CF8" />
            <path d="M8 8h8v8H8z" fill="#4361EE" />
          </svg>
        )

      // 30. Deloitte
      case 'deloitte':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1">
            <circle cx="18" cy="16" r="3" fill="#86BC25" />
            <text x="8" y="17" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">D</text>
          </svg>
        )

      // 31. PwC
      case 'pwc':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1">
            <rect x="4" y="4" width="7" height="7" fill="#D04A02" />
            <rect x="13" y="4" width="7" height="7" fill="#E0301E" />
            <rect x="4" y="13" width="7" height="7" fill="#EB8C00" />
            <rect x="13" y="13" width="7" height="7" fill="#FFB600" />
          </svg>
        )

      // 32. KPMG
      case 'kpmg':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <rect x="2" y="6" width="4" height="12" fill="#00338D" />
            <rect x="8" y="6" width="4" height="12" fill="#00338D" />
            <rect x="14" y="6" width="4" height="12" fill="#00338D" />
            <rect x="20" y="6" width="2" height="12" fill="#00338D" />
          </svg>
        )

      // 33. PayPal
      case 'paypal':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <path d="M6 3h7.5c3 0 5 1.8 4.5 4.5c-.5 3-2.8 4.5-5.5 4.5H9.5L8 21H5L6 3z" fill="#003087" />
            <path d="M9 7h7c2.5 0 4.2 1.5 3.8 3.8c-.4 2.5-2.3 3.7-4.5 3.7h-2.5L11.5 21H8.5L9 7z" fill="#0079C1" opacity="0.85" />
          </svg>
        )

      // 34. Visa
      case 'visa':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#F7B600">
            <text x="12" y="16" fill="#F7B600" fontSize="11" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily="sans-serif">VISA</text>
          </svg>
        )

      // 35. Mastercard
      case 'mastercard':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <circle cx="8.5" cy="12" r="6" fill="#EB001B" />
            <circle cx="15.5" cy="12" r="6" fill="#F79E1B" opacity="0.85" />
          </svg>
        )

      // 36. Stripe
      case 'stripe':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#635BFF">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 13.5c-2.5 0-3.5-1-3.5-2.2h2c0 .6.5 1 1.5 1s1.5-.4 1.5-1c0-1.2-3.8-1-3.8-3.3c0-1.2 1-2 3-2c2 0 3 .8 3 2h-2c0-.5-.4-.8-1-.8s-1 .3-1 .8c0 1.2 3.8 1 3.8 3.3 0 1.3-1.1 2.2-3 2.2z" />
          </svg>
        )

      // 37. Shopify
      case 'shopify':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#96BF48">
            <path d="M17.5 5.5l-2.5-2h-6l-2.5 2L5 20h14l-1.5-14.5zM12 3a2 2 0 0 1 2 2h-4a2 2 0 0 1 2-2z" />
            <path d="M12 10v6m-2-4l2-2l2 2" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        )

      // 38. Airbnb
      case 'airbnb':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="#FF5A5F">
            <path d="M12 2C8.5 2 6 5.5 6 9.5c0 4.5 4.5 9 6 12.5c1.5-3.5 6-8 6-12.5C18 5.5 15.5 2 12 2zm0 10a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
        )

      // 39. LinkedIn
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#0A66C2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="7.5" cy="8" r="1.5" fill="#FFFFFF" />
            <rect x="6" y="11" width="3" height="7" fill="#FFFFFF" />
            <path d="M11 11h3v1.5c.5-.9 1.6-1.7 3-1.7c2.2 0 3 1.5 3 3.5V18h-3v-4c0-.9-.3-1.6-1.3-1.6c-.9 0-1.7.7-1.7 1.6V18h-3V11z" fill="#FFFFFF" />
          </svg>
        )

      // 40. Databricks
      case 'databricks':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#FF3621">
            <path d="M12 2L3 7l9 5 9-5-9-5zm0 8L3 15l9 5 9-5-9-5zm0 6L3 21l9 5 9-5-9-5z" />
          </svg>
        )

      // 41. Snowflake
      case 'snowflake':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="3.3" y1="7" x2="20.7" y2="17" />
            <line x1="3.3" y1="17" x2="20.7" y2="7" />
            <circle cx="12" cy="12" r="2.5" fill="#29B5E8" />
          </svg>
        )

      // 42. ServiceNow
      case 'servicenow':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1">
            <circle cx="12" cy="12" r="8.5" stroke="#81B5A1" strokeWidth="2.4" fill="none" />
            <circle cx="12" cy="12" r="4" fill="#34D399" />
          </svg>
        )

      // 43. SAP
      case 'sap':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <rect x="2" y="5" width="20" height="14" rx="2" fill="#008FD3" />
            <text x="12" y="15.5" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">SAP</text>
          </svg>
        )

      // 44. Dell
      case 'dell':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <circle cx="12" cy="12" r="9" stroke="#007DB8" strokeWidth="2" fill="none" />
            <text x="12" y="15" fill="#38BDF8" fontSize="7.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">DELL</text>
          </svg>
        )

      // 45. HP
      case 'hp':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <circle cx="12" cy="12" r="9" fill="#0096D6" />
            <text x="12" y="16" fill="#FFFFFF" fontSize="10" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily="sans-serif">hp</text>
          </svg>
        )

      // 46. Cognizant
      case 'cognizant':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="#0033A0">
            <path d="M12 3a9 9 0 0 0-9 9c0 5 4 9 9 9c3.5 0 6.5-2 8-5h-3.5a5.5 5.5 0 1 1 0-8H20A9 9 0 0 0 12 3z" fill="#38BDF8" />
          </svg>
        )

      // 47. Capgemini
      case 'capgemini':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#0070AD">
            <path d="M12 3c-3 4-7 8-7 11a7 7 0 0 0 12 4.5l-2-2.5h-1a3 3 0 0 1-3-3c0-2 2-4 3-6l1-2l1 2c1 2 3 4 3 6a3 3 0 0 1-3 3h-1l-2 2.5A7 7 0 0 0 19 14c0-3-4-7-7-11z" fill="#60A5FA" />
          </svg>
        )

      // 48. HCLTech
      case 'hcltech':
      case 'hcl':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <rect x="2" y="5" width="20" height="14" rx="2" fill="#0055A5" />
            <text x="12" y="15.5" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HCL</text>
          </svg>
        )

      // 49. Tech Mahindra
      case 'techmahindra':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1">
            <circle cx="8" cy="12" r="5" fill="#E31837" />
            <circle cx="16" cy="12" r="5" fill="#8A8A8A" />
          </svg>
        )

      // 50. Zoho
      case 'zoho':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <rect x="3" y="3" width="8.5" height="8.5" fill="#E53935" rx="1.5" />
            <rect x="12.5" y="3" width="8.5" height="8.5" fill="#43A047" rx="1.5" />
            <rect x="3" y="12.5" width="8.5" height="8.5" fill="#1E88E5" rx="1.5" />
            <rect x="12.5" y="12.5" width="8.5" height="8.5" fill="#FDD835" rx="1.5" />
          </svg>
        )

      // 51. Razorpay
      case 'razorpay':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#0C2340">
            <path d="M5 21L15 3h4L9 21H5zm6-7h6l-3 7h-4l1-7z" fill="#3395FF" />
          </svg>
        )

      // 52. Swiggy
      case 'swiggy':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5" fill="#FC8019">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
        )

      // 53. Zomato
      case 'zomato':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <rect x="2" y="4" width="20" height="16" rx="3" fill="#E23744" />
            <text x="12" y="15.5" fill="#FFFFFF" fontSize="7.5" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily="sans-serif">zomato</text>
          </svg>
        )

      // 54. PhonePe
      case 'phonepe':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <circle cx="12" cy="12" r="10" fill="#6739B7" />
            <text x="12" y="16.5" fill="#FFFFFF" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">पे</text>
          </svg>
        )

      // 55. Meesho
      case 'meesho':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <circle cx="12" cy="12" r="10" fill="#F43397" />
            <text x="12" y="16" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">m</text>
          </svg>
        )

      // 56. CRED
      case 'cred':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#D4AF37">
            <path d="M12 2L4 6v6c0 5.5 3.5 10 8 11c4.5-1 8-5.5 8-11V6l-8-4zm0 14a4 4 0 1 1 0-8a4 4 0 0 1 0 8z" fill="none" stroke="#D4AF37" strokeWidth="2" />
          </svg>
        )

      // 57. Groww
      case 'groww':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1">
            <path d="M4 18l5-5l4 4l7-8" stroke="#00D09C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M15 9h5v5" stroke="#00D09C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )

      // 58. HighRadius
      case 'highradius':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <rect x="2" y="4" width="20" height="16" rx="3" fill="#0A1F44" stroke="#2563EB" strokeWidth="1.5" />
            <text x="12" y="15.5" fill="#60A5FA" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HiR</text>
          </svg>
        )

      // 59. ByteDance
      case 'bytedance':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-0.5">
            <rect x="3" y="12" width="3" height="8" rx="1" fill="#325AB4" />
            <rect x="8" y="7" width="3" height="13" rx="1" fill="#00D2D2" />
            <rect x="13" y="4" width="3" height="16" rx="1" fill="#325AB4" />
            <rect x="18" y="10" width="3" height="10" rx="1" fill="#00D2D2" />
          </svg>
        )

      // 60. X (Twitter)
      case 'x':
      case 'twitter':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full p-1" fill="#FFFFFF">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        )

      // Default high-quality clean geometric monogram fallback
      default:
        return (
          <div className="w-full h-full flex items-center justify-center font-bold tracking-tight font-mono select-none text-white text-xs">
            {(rawKey?.[0] || 'C').toUpperCase()}
          </div>
        )
    }
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 overflow-hidden select-none bg-[#111116] border border-white/[0.08] shadow-sm ${borderRadiusClass} ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
      title={company || companyId}
      aria-label={`${company || companyId} logo`}
    >
      {renderSvg()}
    </div>
  )
}

export default CompanyLogo
