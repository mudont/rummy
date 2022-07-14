import { BoxMap, UICard } from "components/CardPile/interfaces";

import update from "immutability-helper";
import * as R from "ramda";

function removeCardFromSrc(
  hand: BoxMap,
  pile: BoxMap,
  deck: BoxMap,
  item: UICard,
  isSrcHand: boolean
): [BoxMap, BoxMap, BoxMap] {
  if (isSrcHand) {
    hand = update(hand, { $unset: [`${item.id}`] });
  } else if (item.isDeck) {
    deck = update(deck, { $unset: [`${item.id}`] });
  } else {
    pile = update(pile, { $unset: [`${item.id}`] });
  }
  return [hand, pile, deck];
}

function addCardToTgt(
  hand: BoxMap,
  pile: BoxMap,
  deck: BoxMap,
  item: UICard,
  isTgtHand: boolean
): [BoxMap, BoxMap, BoxMap] {
  const newObj = { [`${item.id}`]: item };
  if (item.isHand) {
    hand = update(hand, { $merge: newObj });
  } else if (item.isDeck) {
    deck = update(deck, { $merge: newObj });
  } else {
    pile = update(pile, { $merge: newObj });
  }

  return [hand, pile, deck];
}

const MIN_USEFUL_CARD_WIDTH = 20;
function reorgCardsToHand(boxes: BoxMap) {
  const sortedEntries = Object.entries(boxes).sort((a, b) =>
    a[1].left < b[1].left ? -1 : 1
  );
  let i = 0;
  sortedEntries.forEach((item) => {
    const [k, v] = item;
    //console.log(`changeing ${k}${JSON.stringify(v)}`);
    boxes[k].left = i * MIN_USEFUL_CARD_WIDTH;
    boxes[k].z = i;
    boxes[k].angle = 0;
    boxes[k].top = 10;
    boxes[k].isHand = true;
    boxes[k].isDeck = false;
    i++;
  });
  //console.log(boxes);
  return boxes;
}

export const moveCard = (
  h: BoxMap,
  p: BoxMap,
  d: BoxMap,
  item: UICard,
  isTargetHand: boolean,
  isTargetDeck: boolean,
  left: number,
  top: number
): [BoxMap, BoxMap, BoxMap] => {
  let newItem = { ...item };
  const nCardsInPile = Object.keys(p).length;
  const nCardsInHand = Object.keys(h).length;
  console.log(
    `moveBox hand: ${nCardsInHand} cards. pile ${nCardsInPile} cards/`
  );
  if (item.isHand === isTargetHand && item.isDeck === isTargetDeck) {
    console.log(`source same as target ${item.isHand} === ${isTargetHand}`);
    // same list
    newItem.top = top;
    newItem.left = left;
  } else {
    console.log(
      `source NOT same as target ${item.isHand} !== ${isTargetHand} | ${item.isDeck} !== ${isTargetDeck}`
    );

    const keys: string[] = Object.keys(isTargetHand ? h : isTargetDeck ? d : p);
    const vals: UICard[] = Object.values(
      isTargetHand ? h : isTargetDeck ? d : p
    );
    const srcVals: UICard[] = Object.values(
      item.isHand ? h : item.isDeck ? d : p
    );
    const topSrcCard = srcVals[srcVals.length - 1];
    if (item.isHand) {
      // Player discarding a card
      if (nCardsInHand <= 13) {
        console.log(`Attempt to discard when No excess cards`);
        return [h, p, d];
      }
    } else if (item.isDeck) {
      // Trying to get from top of deck
      if (nCardsInHand > 13) {
        console.log(`Attempt to pick up extra card`);
        return [h, p, d];
      }
      if (item.id !== topSrcCard.id) {
        console.log(`Attempt to pick up non-top card`);
        return [h, p, d];
      }
    } else {
      // Player trying to pick up a discarded card
      if (nCardsInHand > 13) {
        console.log(`Attempt to pick up extra card`);
        return [h, p, d];
      }
      if (item.id !== topSrcCard.id) {
        console.log(`Attempt to pick up non-top card`);
        return [h, p, d];
      }
    }

    const maxZ = Math.max(...R.map(R.prop("z"), vals));
    const lastIdx = Math.max(...R.map(parseInt, keys));
    const lastItem = (isTargetHand ? h : p)[lastIdx];
    newItem.id = lastIdx + 1;
    newItem.top = lastItem.top;
    newItem.left = isTargetHand ? left : lastItem.left + 10;
    newItem.z = maxZ + 1;
    newItem.isDeck = false;
  }
  [h, p, d] = removeCardFromSrc(h, p, d, item, item.isHand);
  newItem.isHand = isTargetHand;
  newItem.classes += " bounce-short";
  [h, p, d] = addCardToTgt(h, p, d, newItem, isTargetHand);

  // console.log(`moveBox ${item.id} ${updateId} ${left} ${top}`);

  if (isTargetHand) {
    reorgCardsToHand(h);
  }

  return [h, p, d];
};

export default moveCard;
