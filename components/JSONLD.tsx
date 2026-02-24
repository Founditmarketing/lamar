import React from 'react';
import { useLanguage } from './LanguageContext';

export const JSONLD: React.FC = () => {
    const { language, t } = useLanguage();

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "BankOrCreditUnion",
        "name": "Lamar National Bank",
        "url": "https://lamarnational.bank",
        "logo": "https://lamarnational.bank/logo.png",
        "foundingDate": "1933",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "200 S Main St",
            "addressLocality": "Paris",
            "addressRegion": "TX",
            "postalCode": "75460",
            "addressCountry": "US"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-903-785-0701",
            "contactType": "customer service"
        },
        "sameAs": [
            "https://www.facebook.com/lamarnationalbank",
            "https://twitter.com/lamarnational",
            "https://www.instagram.com/lamarnationalbank",
            "https://www.linkedin.com/company/lamar-national-bank"
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": t('faq.q1'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('faq.a1')
                }
            },
            {
                "@type": "Question",
                "name": t('faq.q2'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('faq.a2')
                }
            },
            {
                "@type": "Question",
                "name": t('faq.q3'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('faq.a3')
                }
            },
            {
                "@type": "Question",
                "name": t('faq.q4'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('faq.a4')
                }
            },
            {
                "@type": "Question",
                "name": t('faq.q5'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('faq.a5')
                }
            },
            {
                "@type": "Question",
                "name": t('faq.q6'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('faq.a6')
                }
            }
        ]
    };

    return (
        <>
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(faqSchema)}
            </script>
        </>
    );
};
