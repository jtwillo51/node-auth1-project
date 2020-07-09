const express = require("express");
const db = require("./users-model");
const bcrypt = require("bcryptjs");


const router = express.Router();

const authErr = { message: "You shall not pass!" };

router.post("/api/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await db.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        message: "Username not available",
      });
    }

    const newUser = await db.add({
      username,
      password: await bcrypt.hash(password, 13),
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/api/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await db.findBy({ username }).first();

    if (!user) {
      return res.status(401).json(authErr);
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json(authErr);
    }

    req.session.user = user;

    res.json({
      message: `Welcome ${user.username}`,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/api/users", async (req, res, next) => {
  try {
    res.json(await db.find());
  } catch (err) {
    next(err);
  }
});

module.exports = router;
