'use client';

import { useCallback, useRef } from 'react';

export function useSoundEffects() {
    const ctxRef = useRef<AudioContext | null>(null);

    const getCtx = useCallback((): AudioContext => {
        if (!ctxRef.current) {
            ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        }
        return ctxRef.current;
    }, []);

    const isEnabled = useCallback((): boolean => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('mw_sound') !== 'off';
    }, []);

    /** Pleasant two-note ascending ding for correct answers */
    const playCorrect = useCallback(() => {
        if (!isEnabled()) return;
        try {
            const ac = getCtx();
            const notes = [523.25, 783.99]; // C5, G5
            notes.forEach((freq, i) => {
                const osc = ac.createOscillator();
                const gain = ac.createGain();
                osc.connect(gain);
                gain.connect(ac.destination);
                osc.type = 'sine';
                osc.frequency.value = freq;
                const t = ac.currentTime + i * 0.12;
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
                osc.start(t);
                osc.stop(t + 0.5);
            });
        } catch (_) { /* audio blocked */ }
    }, [isEnabled, getCtx]);

    /** Low descending buzz for wrong answers */
    const playWrong = useCallback(() => {
        if (!isEnabled()) return;
        try {
            const ac = getCtx();
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(220, ac.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ac.currentTime + 0.35);
            gain.gain.setValueAtTime(0.18, ac.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);
            osc.start(ac.currentTime);
            osc.stop(ac.currentTime + 0.4);
        } catch (_) { /* audio blocked */ }
    }, [isEnabled, getCtx]);

    /** Four-note fanfare for high score / quiz completion */
    const playFanfare = useCallback(() => {
        if (!isEnabled()) return;
        try {
            const ac = getCtx();
            const melody = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
            melody.forEach((freq, i) => {
                const osc = ac.createOscillator();
                const gain = ac.createGain();
                osc.connect(gain);
                gain.connect(ac.destination);
                osc.type = 'sine';
                osc.frequency.value = freq;
                const t = ac.currentTime + i * 0.13;
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
                osc.start(t);
                osc.stop(t + 0.55);
            });
        } catch (_) { /* audio blocked */ }
    }, [isEnabled, getCtx]);

    /** Soft click tick (for timer urgency) */
    const playTick = useCallback(() => {
        if (!isEnabled()) return;
        try {
            const ac = getCtx();
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.type = 'sine';
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.06, ac.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
            osc.start(ac.currentTime);
            osc.stop(ac.currentTime + 0.07);
        } catch (_) { /* audio blocked */ }
    }, [isEnabled, getCtx]);

    /** Streak combo — rising arpeggio */
    const playStreak = useCallback(() => {
        if (!isEnabled()) return;
        try {
            const ac = getCtx();
            const notes = [440, 554, 659]; // A4, C#5, E5
            notes.forEach((freq, i) => {
                const osc = ac.createOscillator();
                const gain = ac.createGain();
                osc.connect(gain);
                gain.connect(ac.destination);
                osc.type = 'triangle';
                osc.frequency.value = freq;
                const t = ac.currentTime + i * 0.07;
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.25, t + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                osc.start(t);
                osc.stop(t + 0.35);
            });
        } catch (_) { /* audio blocked */ }
    }, [isEnabled, getCtx]);

    return { playCorrect, playWrong, playFanfare, playTick, playStreak, isEnabled };
}
