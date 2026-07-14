"use client";

import { useEffect, useState } from "react";
import { Play } from "@untitledui/icons";

const slides = [
    {
        title: "Zweistellige Zahlen auf Deutsch sprechen",
        visual: <p className="text-display-lg font-black text-primary">34</p>,
    },
    {
        title: "Wir sprechen die Zahl rückwärts",
        visual: (
            <div className="flex items-end gap-10">
                <div className="text-center"><p className="text-sm font-semibold text-tertiary">Zehner</p><p className="text-display-xl font-black text-primary">3</p><p className="text-lg font-bold text-primary">dreissig</p></div>
                <div className="text-center"><p className="text-sm font-semibold text-tertiary">Einer zuerst</p><p className="text-display-xl font-black text-brand-primary">4</p><p className="text-lg font-bold text-brand-primary">vier</p></div>
            </div>
        ),
    },
    {
        title: "Die Regel",
        visual: <p className="text-display-md font-black text-primary"><span className="text-brand-primary">Einer</span> + «und» + Zehner</p>,
    },
    {
        title: "Beispiel: 34",
        visual: (
            <div className="flex flex-col items-center gap-3 text-xl font-bold text-primary">
                <p><span className="text-brand-primary">4</span> → vier</p>
                <p>+ und</p>
                <p>+ 30 → dreissig</p>
                <p className="mt-2 text-display-sm font-black">vierunddreissig</p>
            </div>
        ),
    },
    {
        title: "Weitere Beispiele",
        visual: <div className="grid grid-cols-2 gap-x-14 gap-y-4 text-xl font-black text-primary"><p>21 = einundzwanzig</p><p>56 = sechsundfünfzig</p><p>78 = achtundsiebzig</p><p>99 = neunundneunzig</p></div>,
    },
    {
        title: "Achtung bei der Eins",
        visual: <div className="text-center"><p className="text-xl font-bold text-primary">21, 31, 41, …</p><p className="mt-5 text-display-sm font-black text-primary"><span className="text-brand-primary">ein</span>undzwanzig</p><p className="mt-2 text-lg font-semibold text-tertiary">nicht «einsundzwanzig»</p></div>,
    },
];

export const NumberSpeechExplainer = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const slide = slides[activeSlide];

    useEffect(() => {
        if (!playing) return;
        const audio = new Audio(`/api/audio/explainers/a-01-04-01/${activeSlide + 1}`);
        const updateProgress = () => {
            const withinSlide = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.currentTime / audio.duration : 0;
            setProgress((activeSlide + withinSlide) / slides.length);
        };
        const finish = () => {
            setProgress((activeSlide + 1) / slides.length);
            window.setTimeout(() => {
                if (activeSlide < slides.length - 1) setActiveSlide((current) => current + 1);
                else { setActiveSlide(0); setPlaying(false); setProgress(0); }
            }, 900);
        };
        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", finish, { once: true });
        void audio.play().catch(finish);
        return () => { audio.pause(); audio.removeEventListener("timeupdate", updateProgress); audio.removeEventListener("ended", finish); };
    }, [activeSlide, playing]);

    return (
        <section className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg bg-primary ring-2 ring-border-primary ring-inset">
            <p className="absolute top-5 left-5 text-xs font-bold text-primary">alltagsmathematik.ch</p>
            <nav className="absolute top-5 right-5 flex items-center gap-1.5 text-xs font-medium text-tertiary"><span>Zahlen und Variablen</span><span>›</span><span>Zahlen benennen und schreiben</span></nav>
            <div className="flex size-full flex-col items-center justify-center gap-9 px-12 pt-14 pb-12 text-center">
                <h2 className="max-w-2xl text-display-sm font-black text-primary">{slide.title}</h2>
                {slide.visual}
                {!playing && activeSlide === 0 && <button type="button" onClick={() => setPlaying(true)} aria-label="Präsentation starten" className="flex h-10 w-32 items-center justify-center rounded-sm bg-brand-solid text-white"><Play className="size-5" /></button>}
            </div>
            {playing && <div className="absolute right-10 bottom-6 left-10 h-1 bg-secondary" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}><div className="h-full bg-brand-solid" style={{ width: `${progress * 100}%` }} /></div>}
        </section>
    );
};
