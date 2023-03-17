import * as PIXI from "pixi.js";
import { gsap } from "gsap";

import back from "./assets/back.png";

const durationEasyShiftCards = 0.2;
const numberСards = 36;

let topThirdPosition;
let middleThirdPosition;
let bottomThirdPosition;

const loader = PIXI.Loader.shared;
loader.add("back", back);

const app = new PIXI.Application({ background: "#1099bb" });
globalThis.__PIXI_APP__ = app;
document.body.appendChild(app.view);

loader.onComplete.add(() => {
  const container = new PIXI.Container();

  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;

  let cards = [];
  let cardsPositionStartAnimationEasyShift = [];
  let topThirdPositionStartAnimationEasyShift;
  let middleThirdPositionStartAnimationEasyShift;
  let bottomThirdPositionStartAnimationEasyShift;
  let animateCards = false;
  let tweens = [];
  let tweenScaleContainer;
  let tweenSkewContainer;
  let tweenRotationContainer;

  for (let i = 0; i < numberСards; i++) {
    const card = new PIXI.Sprite(loader.resources.back.texture);
    card.anchor.set(0.5);
    cards.push(card);
    container.addChild(card);
  }

  topThirdPosition = [
    ...cards.slice(0, Math.ceil(cards.length / 3)).map((card) => card.position),
  ];
  middleThirdPosition = [
    ...cards
      .slice(Math.ceil(cards.length / 3), Math.ceil((cards.length / 3) * 2))
      .map((card) => card.position),
  ];
  bottomThirdPosition = [
    ...cards
      .slice(Math.ceil((cards.length / 3) * 2), cards.length)
      .map((card) => card.position),
  ];

  function startAnimationRotationContainer() {
    tweenRotationContainer = gsap.to(container, {
      rotation: 0.3,
      duration: durationEasyShiftCards,
    });
  }

  function reverseAnimationRotationContainer() {
    tweenRotationContainer.reverse();
  }

  function startAnimationScaleContainer() {
    tweenScaleContainer = gsap.to(container.scale, {
      x: 0.6,
      y: 1,
      duration: durationEasyShiftCards,
    });
  }

  function reverseAnimationScaleContainer() {
    tweenScaleContainer.reverse();
  }

  function startAnimationSkewContainer() {
    tweenSkewContainer = gsap.to(container.skew, {
      x: 0,
      y: -0.4,
      duration: durationEasyShiftCards,
    });
  }

  function reverseAnimationSkewContainer() {
    tweenSkewContainer.reverse();
  }

  function startAnimationEasyShiftCards() {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardX = 2 * i;
      const cardY = 0.7 * i;
      const tween = gsap.to(card.position, {
        x: card.position.x + cardX,
        y: card.position.y + cardY,
        duration: durationEasyShiftCards,
      });
      tweens.push(tween);

      cardsPositionStartAnimationEasyShift.push({
        x: cardX,
        y: cardY,
      });
    }
  }

  function reverseAnimationEasyShiftCards() {
    for (let i = 0; i < tweens.length; i++) {
      tweens[i].reverse();
    }
    tweens = [];
  }

  app.stage.addChild(container);

  const topThird = cards.slice(0, Math.ceil(cards.length / 3));
  const middleThird = cards.slice(
    Math.ceil(cards.length / 3),
    Math.ceil((cards.length / 3) * 2)
  );
  const bottomThird = cards.slice(
    Math.ceil((cards.length / 3) * 2),
    cards.length
  );

  document
    .getElementById("start_cards_unfold")
    .addEventListener("click", () => {
      if (animateCards) return;
      animateCards = true;
      startAnimationScaleContainer();
      startAnimationEasyShiftCards();
      startAnimationSkewContainer();
      startAnimationRotationContainer();
    });

  document.getElementById("start_cards_fold").addEventListener("click", () => {
    if (!animateCards) return;
    animateCards = false;
    reverseAnimationEasyShiftCards();
    reverseAnimationScaleContainer();
    reverseAnimationSkewContainer();
    reverseAnimationRotationContainer();
  });

  document.getElementById("start_test_anim").addEventListener("click", () => {
    bottomThird.forEach((element) => {
      element.position.x -= 350;
    });
  });

  document.getElementById("return_test_anim").addEventListener("click", () => {
    topThirdPosition = [
      ...cards
        .slice(0, Math.ceil(cards.length / 3))
        .map((card) => card.position),
    ];
    middleThirdPosition = [
      ...cards
        .slice(Math.ceil(cards.length / 3), Math.ceil((cards.length / 3) * 2))
        .map((card) => card.position),
    ];
    bottomThirdPosition = [
      ...cards
        .slice(Math.ceil((cards.length / 3) * 2), cards.length)
        .map((card) => card.position),
    ];

    bottomThird.forEach((element, index) => {
      element.position.y = topThird[index].position.y;
    });
  });
  document.getElementById("return_test_anim1").addEventListener("click", () => {
    middleThird.forEach((element, index) => {
      element.position.x = bottomThirdPosition[index].x;
      element.position.y = bottomThirdPosition[index].y;
    });
  });
  document
    .getElementById("return_test_anim2")
    .addEventListener("click", () => {});
});

loader.load();
