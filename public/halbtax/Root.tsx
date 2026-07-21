import React from 'react';
import {Composition, Series} from 'remotion';
import {Scene01Shampoo} from './Scene01Shampoo';
import {Scene02Route} from './Scene02Route';
import {Scene03Shelf} from './Scene03Shelf';
import {
  Scene04Counting,
  Scene05OneBottle,
  Scene06TwoBottles,
  Scene07TwoBottlesUnit,
  Scene08ThreeBottles,
  Scene09ThreeBottlesUnit,
  Scene10Table,
} from './Scenes04to10';

const FPS = 30;
const SIZE = 1080; // 1:1

const LOOP = 180; // 6s – Szenen 1+2
const STATIC = 150; // 5s – restliche Szenen

// Alle Szenen nacheinander als ein Video
export const FullSequence: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={LOOP}><Scene01Shampoo /></Series.Sequence>
    <Series.Sequence durationInFrames={LOOP}><Scene02Route /></Series.Sequence>
    <Series.Sequence durationInFrames={STATIC}><Scene03Shelf /></Series.Sequence>
    <Series.Sequence durationInFrames={STATIC}><Scene04Counting /></Series.Sequence>
    <Series.Sequence durationInFrames={STATIC}><Scene05OneBottle /></Series.Sequence>
    <Series.Sequence durationInFrames={STATIC}><Scene06TwoBottles /></Series.Sequence>
    <Series.Sequence durationInFrames={STATIC}><Scene07TwoBottlesUnit /></Series.Sequence>
    <Series.Sequence durationInFrames={STATIC}><Scene08ThreeBottles /></Series.Sequence>
    <Series.Sequence durationInFrames={STATIC}><Scene09ThreeBottlesUnit /></Series.Sequence>
    <Series.Sequence durationInFrames={STATIC}><Scene10Table /></Series.Sequence>
  </Series>
);

export const RemotionRoot: React.FC = () => {
  const common = {fps: FPS, width: SIZE, height: SIZE};
  return (
    <>
      <Composition id="FullSequence" component={FullSequence} durationInFrames={2 * LOOP + 8 * STATIC} {...common} />
      <Composition id="Szene01-Shampoo" component={Scene01Shampoo} durationInFrames={LOOP} {...common} />
      <Composition id="Szene02-Weg" component={Scene02Route} durationInFrames={LOOP} {...common} />
      <Composition id="Szene03-Regal" component={Scene03Shelf} durationInFrames={STATIC} {...common} />
      <Composition id="Szene04-Zaehlen" component={Scene04Counting} durationInFrames={STATIC} {...common} />
      <Composition id="Szene05-EineFlasche" component={Scene05OneBottle} durationInFrames={STATIC} {...common} />
      <Composition id="Szene06-ZweiFlaschen" component={Scene06TwoBottles} durationInFrames={STATIC} {...common} />
      <Composition id="Szene07-ZweiFlaschenStueckpreis" component={Scene07TwoBottlesUnit} durationInFrames={STATIC} {...common} />
      <Composition id="Szene08-DreiFlaschen" component={Scene08ThreeBottles} durationInFrames={STATIC} {...common} />
      <Composition id="Szene09-DreiFlaschenStueckpreis" component={Scene09ThreeBottlesUnit} durationInFrames={STATIC} {...common} />
      <Composition id="Szene10-Tabelle" component={Scene10Table} durationInFrames={STATIC} {...common} />
    </>
  );
};
