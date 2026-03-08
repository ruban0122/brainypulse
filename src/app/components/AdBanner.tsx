'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
    adSlot: string;
    adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    className?: string;
    showLabel?: boolean;
}

export default function AdBanner({
    adSlot,
    adFormat = 'auto',
    className = '',
    showLabel = false,
}: AdBannerProps) {
    const insRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        // Each time this component mounts, push a fresh ad request.
        // We check that the <ins> hasn't already been filled by AdSense
        // (AdSense sets data-adsbygoogle-status="done" when it fills a slot).
        const el = insRef.current;
        if (!el) return;

        // If AdSense already processed this exact element, skip
        if (el.getAttribute('data-adsbygoogle-status')) return;

        try {
            // @ts-expect-error — adsbygoogle is injected by the AdSense script tag in layout.tsx
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.warn('[AdBanner] AdSense push failed:', err);
        }
    // Re-run whenever the slot changes (e.g. navigating between tests)
    }, [adSlot]);

    return (
        <div className={`w-full overflow-hidden ${className}`}>
            {showLabel && (
                <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-medium select-none">
                    Advertisement
                </p>
            )}
            <ins
                ref={insRef}
                className="adsbygoogle block"
                style={{ display: 'block', minHeight: '100px' }}
                data-ad-client="ca-pub-9880823545934880"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true"
            />
        </div>
    );
}
