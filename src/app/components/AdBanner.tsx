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

export default function AdBanner({
    adSlot,
    adFormat = 'auto',
    className = '',
    showLabel = false,
}: AdBannerProps) {
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
                className="adsbygoogle block"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-9880823545934880"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true"
            />
        </div>
    );
}
