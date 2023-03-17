import * as PIXI from "pixi.js";
import { gsap } from "gsap";

import back from "./assets/back.png";

const durationEasyShiftCards = 0.2;
const durationStartAnimationMoveBackInDeck = 1;
const durationStartAnimationMoveUpOutroCards = 1;
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
  let animateCards = false;
  let tweens = [];
  let tweenScaleContainer;
  let tweenSkewContainer;
  let tweenRotationContainer;
  let tweenMoveOutroOfDeck = [];
  let tweensIntroInDeck = [];
  let tweensUpOutroCards = [];
  let tweensMoveCardDeck = [];

  for (let i = 0; i < numberСards; i++) {
    const card = new PIXI.Sprite(loader.resources.back.texture);
    card.anchor.set(0.5);
    card.zIndex = i;
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
        zIndex: card.zIndex,
      });
    }
  }

  function reverseAnimationEasyShiftCards() {
    for (let i = 0; i < tweens.length; i++) {
      tweens[i].reverse();
    }
    tweens = [];
  }

  function startAnimationMoveOutroOfDeck() {
    const topThirdPositionStartAnimationEasyShift =
      cardsPositionStartAnimationEasyShift.slice(
        0,
        Math.ceil(cards.length / 3)
      );

    bottomThird.forEach((element, index) => {
      const tween = gsap.to(element.position, {
        x: topThirdPositionStartAnimationEasyShift[index].x,
        y: topThirdPositionStartAnimationEasyShift[index].y,
        duration: durationStartAnimationMoveBackInDeck,
      });
      tweenMoveOutroOfDeck.push(tween);

      container.swapChildren(element, topThirdSprite[index]);
    });

    middleThird.forEach((element, index) => {
      container.swapChildren(element, topThirdSprite[index]);
    });
  }

  function startAnimationMoveIntroInDeck() {
    bottomThird.forEach((element) => {
      const tween = gsap.to(element.position, {
        x: element.position.x - 350,
        duration: durationStartAnimationMoveBackInDeck,
      });
      tweensIntroInDeck.push(tween);
    });
  }

  function startAnimationMoveUpOutroCards() {
    bottomThird.forEach((element, index) => {
      const tween = gsap.to(element.position, {
        y: topThirdSprite[index].position.y,
        duration: durationStartAnimationMoveUpOutroCards,
      });
      tweensUpOutroCards.push(tween);
    });
  }

  function startAnimationMoveCardDeck() {


    const bottomThirdPositionStartAnimationEasyShift =
      cardsPositionStartAnimationEasyShift.slice(
        Math.ceil((cards.length / 3) * 2),
        cards.length
      );
    const middleThirdPositionStartAnimationEasyShift =
      cardsPositionStartAnimationEasyShift.slice(
        Math.ceil(cards.length / 3),
        Math.ceil((cards.length / 3) * 2)
      );

      middleThird.forEach((element, index) => {
        const tween = gsap.to(element.position, {
          x: bottomThirdPositionStartAnimationEasyShift[index].x,
          y: bottomThirdPositionStartAnimationEasyShift[index].y,
          duration: durationStartAnimationMoveUpOutroCards,
        });
        tweensMoveCardDeck.push(tween);
      });
      topThirdSprite.forEach((element, index) => {
        const tween = gsap.to(element.position, {
          x: middleThirdPositionStartAnimationEasyShift[index].x,
          y: middleThirdPositionStartAnimationEasyShift[index].y,
          duration: durationStartAnimationMoveUpOutroCards,
        });
        tweensMoveCardDeck.push(tween);
      });
  }

  app.stage.addChild(container);

  const topThirdSprite = cards.slice(0, Math.ceil(cards.length / 3));
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

    console.log(
      "***cardsPositionStartAnimationEasyShift: ",
      cardsPositionStartAnimationEasyShift
    );
  });

  document.getElementById("start_test_anim").addEventListener("click", () => {
    startAnimationMoveIntroInDeck();
  });

  document.getElementById("return_test_anim").addEventListener("click", () => {
    startAnimationMoveUpOutroCards();
  });
  document.getElementById("return_test_anim1").addEventListener("click", () => {
    startAnimationMoveCardDeck();
  });
  document.getElementById("return_test_anim2").addEventListener("click", () => {
    startAnimationMoveOutroOfDeck();
  });
});

loader.load();
