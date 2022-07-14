# Rummy project

## Current state of development

- the `client` dir has react-dnd code. The essential features are
  demonstrated there,
- `lib/cards.ts` in this repo has a fairly good Rummy engine
- Prisma schema OK

## Next To Do

- DB update whenever Game state changes
- Load game from DB
- GraphQl layer
  - server queries/subscriptions/mutations
  - client side graphql
- Build out the React UI
  - Buttons for Drop/Show
  - Chat
  - When game is over, allow option of
    - (Syndicate) continue with new deal (turn changes) . accumulate points
    - (standard) Finish the game

## SVGs

Got zipfile from [here](https://www.me.uk/cards/makeadeck.cgi)

unzip to a folder
make sure svg-to-react npm package is globally installed

```sh
# run svgtoreact. flip the two letter card names
for i in ??.svg;do orig=`echo $i|sed "s/.svg//"`; new=`echo $orig|rev`; svgtoreact $orig $new ;done
# rename .js to .tsx
for i in ??.js;do j=`echo $i|sed "s/.js//"`; mv $i $j.tsx;done
# Fix types
sed -i ''  's/(props)/(props: any)/g' *.tsx
# Generate map entries for cardsMap.ts

for i in  ??.tsx;do j=`echo $i|sed -e "s/.tsx//"`;echo $j: c.$j,;done
# Make index.tsx for importing cards
for i in  ??.tsx;do j=`echo $i|sed -e "s/.tsx//"`;echo "export {default as $j} from './$j'";done > index.tsx
```

## Other Card game

Sri said he would like to provide a spec for a card game to play with his family online. For now, let us implement Rummy.

[Typescript code for backend modeling](https://github.com/mitch-b/typedeck/)

## Drag and Drop

[react-dnd](https://react-dnd.github.io/react-dnd/examples) Runnable exmaples in the documentation.

The animation library Framer motion includes drag n drop

## Animation libraries

[Framer Motion](https://github.com/framer/motion) seems to be the best React lib
[Examples](https://www.framer.com/docs/examples/) include Drag and Drop

[flip toolkit](https://github.dev/aholachek/react-flip-toolkit)

https://github.com/chenglou/react-motion

[GSAP](https://github.com/greensock/GSAP) is a good animation library. Can be used to card dealing etc. GSAP has a nice [React tutorial](https://greensock.com/react/) and an [Advanced one](https://greensock.com/react-advanced)

It is used by [this Card react repo](https://github.com/listingslab/react-playing-cards). It has SVG card images, but no DnD.

[This old React repo](https://github.com/wmaillard/react-playing-cards) has [working demo](http://aws-website-playingcards-cqzb8.s3-website-us-east-1.amazonaws.com/) that seems do a good chunk of what we would want. shows a bunch of cards in a couple of different arrangements, and DnD works.

[A simple React program](https://github.com/AryanJ-NYC/react-playing-card) to show a card

## Rummy Design

### Low level UI design thoughts

Probably use react-dnd to add DnD to the animated Card example in [this Card react repo](https://github.com/listingslab/react-playing-cards)

### User point of view

- MUT User creates a new Game, becomes owner of game.
- screen shows all current players (around a table).
- MUT They can be dragged to different positions. Dropped players will be grayed out
- MUT Until game starts, Any logged in user can request to join by visiting /game/{game_id}
- number of decks can chosen subject to: n x (52+2) > numPlayers \* 13 + 15
- MUT Owner of Game start the game, resulting in cards being dealt
- Each user see their cards face up
- The open card is face up also. It must be highlighted in some way
- Turn is set to player1.
- The game iterates as follows.
  - Turn player must do one of
    - MUT Drop
    - MUT Show. if he rejects,
      the user is out with 80 points(verify this rule)
    - MUT draw from deck or open card , and discard one of his cards, which
    - MUT pass?
    - Turn incremented circularly
    - If pile runs out, shuffle all but top open card and make them the new pile . Do dropped cards go into this pile?
  - Game ends when either
    - one player left, or
    - someone Shows and owner accepts.
  - MUT Allow game to be restarted with points being accumulated.

A chat window for users to comment.

Owner can undo the most recent game iteration

### Server side

#### Mutations

- create game
- request to join game
- accept in game
- start game
- move player at table
- drop/show/exch open card/exch with pile
- deal cards
- Next iteration of game

#### Subscription

- After each mutation, send game state. Each player should see their own cards and the open card, and the previously discarded pile

#### Queries

- Players can request game state any time
- List my games

### Database

Game

- id
- description
- owner User
- numJokersPerDeck
- gamePlayers GamePlayer[]
- moves Move[]
- turnPlayer User
- pile Card[]
- openCards Card[]

GamePlayer

- gameId \*
- userId \*
- status pending/accepted
- tablePosition
- points
- hand Card[]

Move

- id
- gameId
- player GamePlayer
- action
- isPrivate (Eg; reordering cards. Move doesn't affect game and cannot be undone by owner)

Card

- Suit
- Rank

### Code design

A service layer module implements all the the server side functionality
on top of Prisma

### React UI pieces needed

- Card SVGs are now in the components tree.
- Rotate an element with CSS in React: style={{transform: `rotate(45deg)`}}
- bonus if we can show the open cards pile in a disordered way and allow them to be draged around. wmaillard/react-playing-cards is very good but it is old tech
  [This react-dnd example](https://react-dnd.github.io/react-dnd/examples/drag-around/custom-drag-layer) is promising.
- Draggable list .
  react-beautiful-dnd is list based, but react-dnd is more flaxible there is another called react-draggable or something
- Show SVG cards as list items
- animate movement of Cards
- show cards as overlapping

- bonus if we can show the open cards pile in a disordered way and allow them to be draged around. wmaillard/react-playing-cards is very good but it is old

## Concepts to understand

- [] DragLeyer for preview
- [] [GQL local for state mgmt](https://www.apollographql.com/blog/apollo-client/caching/dispatch-this-using-apollo-client-3-as-a-state-management-solution/)
