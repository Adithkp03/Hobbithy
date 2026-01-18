import { Helmet } from 'react-helmet-async';

export default function SEO({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    schema
}) {
    const siteTitle = 'Hobbithy Tracker';
    const fullTitle = title ? `${title} | ${siteTitle}` : 'Hobbithy Tracker - Build Better Habits Daily';
    const metaDescription = description || 'Hobbithy is the world\'s first resilient habit tracker. Build habits that survive your bad days with Adaptive Goal Technology.';
    const siteUrl = url || 'https://hobbithy-tracker.vercel.app'; // Updated to actual Vercel domain
    const metaImage = image || '/og-image.jpg'; // Ensure this exists or use a remote URL

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={siteUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* JSON-LD Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
}
