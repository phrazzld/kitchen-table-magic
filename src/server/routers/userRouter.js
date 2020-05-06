const express = require("express");
const passport = require("../auth.js");
const validator = require("email-validator");
const User = require("../schemas/User.js");
const Card = require("../schemas/Card.js");
const scryfall = require("../apis/scryfall.js");

const userRouter = express.Router();

userRouter
  .route("/login")
  .post(
    passport.authenticate("local", { failureRedirect: "/loggedIn" }),
    (req, res) => {
      res.send("logged in");
    }
  );

userRouter.route("/register").post(async (req, res) => {
  const { email, password } = req.body;
  if (!validator.validate(email)) {
    return res.sendStatus(400);
  }
  const newUser = new User({ email, password });
  try {
    const emailInUse = await User.findOne({ email: newUser.email })
      .select("_id")
      .lean();
    if (emailInUse) {
      console.log("user attempted to create account with existing email.");
      return res.sendStatus(401);
    }
    await newUser.save();
    // await passport.authenticate('local');
    console.log(`new user created with email: ${newUser.email}`);
    await passport.authenticate("local");
    await req.logIn(newUser, (err) => {
      if (err) throw err;
    });
    // return false;
    return res.sendStatus(200);
  } catch (err) {
    console.erorr(err);
    return res.sendStatus(500);
  }
});

userRouter.route("/loggedIn").get((req, res) => {
  if (req.user) {
    return res.json({ loggedIn: true, email: req.user.email });
  }
  return res.json({ loggedIn: false, email: "" });
});

userRouter
  .route("/api/decks")
  .get(passport.isAuthenticated, (req, res) => {
    console.log("Fetching all decks.")
    res.json(req.user.decks);
  })
  .post(passport.isAuthenticated, async (req, res) => {
    const { cards, name } = req.body;
    const deckList = [];

    console.log(`Creating deck with name: ${name}`);

    // check for existence of a deck with the same name
    const deckIndex = req.user.decks.findIndex((deck) => deck.name === name);

    if (deckIndex === -1) {
      // verify integrity of list of cards
      for (let i = 0; i < cards.length; i++) {
        if (parseInt(cards[i][0])) {
          deckList.push({ quantity: parseInt(cards[i][0]), name: cards[i][1] });
        }
      }

      let newDeck = {
        name: name,
        cards: [],
      };

      const addToDeck = (quantity, cardId) => {
        console.log(quantity);
        for (let i = 0; i < quantity; i++) {
          newDeck.cards.push(cardId);
        }
      };

      // check for each card's existence in local database
      for (let i = 0; i < deckList.length; i++) {
        let card = deckList[i];
        const cardExistsLocally = await Card.findOne({ name: card.name })
          .select("_id")
          .lean();
        if (cardExistsLocally) {
          console.log(`Card with name "${card.name}" exists locally.`);
          addToDeck(deckList[i].quantity, cardExistsLocally._id);
        } else {
          try {
            console.log(`Fetching card with name "${card.name}".`);
            const cardData = new Card(await scryfall.fetch(card.name));
            await cardData.save();
            addToDeck(deckList[i].quantity, cardData._id);
          } catch (err) {
            console.error(err);
            return res.sendStatus(500);
          }
        }
      }
      req.user.decks.push(newDeck);
      try {
        await req.user.save();
        return res.json(newDeck);
      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      // req.user.decks=[];
      // req.user.save();

    }

    return res.sendStatus(400);
  });

userRouter
  .route("/api/decks/:id")
  .get(passport.isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const deckIndex = req.user.decks.findIndex(
      (deck) => deck._id.toString() === id
    );

    try {
      console.log("populating deck");

      const cardsInDeck = await Card.find({
        _id: { $in: req.user.decks[deckIndex].cards },
      }).lean();

      const cards = req.user.decks[deckIndex].cards.map((card) => {
        return cardsInDeck.find(
          (cardData) => card.toString() === cardData._id.toString()
        );
      });

      res.json({ name: req.user.decks[deckIndex].name, cards });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });

module.exports = userRouter;
