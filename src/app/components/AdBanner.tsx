'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
    /** AdSense data-ad-slot value — find this in your AdSense dashboard under Ads > By ad unit */
    adSlot: string;
    /** Ad format: 'auto' for responsive, 'rectangle', 'horizontal', 'vertical' */
    adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
    /** Class name for the outer wrapper — use for controlling layout/spacing */
    className?: string;
    /** Optional label shown above the ad */
    showLabel?: boolean;
}

/**
 * AdBanner — Renders a Google AdSense ad unit.
 *
 * SETUP:
 * 1. Replace 'YOUR_PUBLISHER_ID' in layout.tsx with your actual ca-pub-XXXXXXXXXXXXXXXX
 * 2. Replace the adSlot prop with your actual ad unit slot IDs from AdSense dashboard
 * 3. Set data-ad-test="on" to test without real ads during development
 *
 * USAGE:
 * <AdBanner adSlot="1234567890" adFormat="auto" />
 * <AdBanner adSlot="0987654321" adFormat="rectangle" className="my-8" showLabel />
 */
export default function AdBanner({
    adSlot,
    adFormat = 'auto',
    className = '',
    showLabel = false,
}: AdBannerProps) {
    const adRef = useRef<HTMLModElement>(null);
    const pushed = useRef(false);

    useEffect(() => {
        // Prevent double-push in strict mode / fast refresh
        if (pushed.current) return;
        pushed.current = true;

        try {
            // @ts-expect-error — adsbygoogle is injected by the AdSense script
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            // Silently fail in environments where AdSense isn't loaded (e.g., localhost)
            console.warn('[AdBanner] AdSense push failed:', err);
        }
    }, []);

    return (
        <div className={`w-full overflow-hidden ${className}`}>
            {showLabel && (
                <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-medium select-none">
                    Advertisement
                </p>
            )}
            <ins
                ref={adRef}
                className="adsbygoogle block"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-9880823545934880"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true"
            // Remove the line below after testing — it enables test ads during development:
            // data-ad-test="on"
            />
        </div>
    );
}
