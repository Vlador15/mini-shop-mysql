const { bd } = require("../models/connect");

class Main {
  async mainPage(req, res) {
    try {
      console.log(req.session);
      res.render("main", { session: req.session });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async aboutPage(req, res) {
    try {
      res.render("about", { session: req.session });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async contactsPage(req, res) {
    try {
      res.render("contacts", { session: req.session });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async loginPage(req, res) {
    try {
      res.render("login", { session: req.session });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async logout(req, res) {
    try {
      req.session.isAdmin = false;
      req.session.auth = false;
      req.session.user = false;

      res.redirect("/");
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async login(req, res) {
    try {
      const { phone, password } = req.body;
      if (!phone || !password)
        return res.render("error", {
          error: "Не все параметры переданы",
          session: req.session,
        });

      const [data] = await bd.query(
        `SELECT * FROM user WHERE phone = '${phone}' AND password = '${password}'`
      );

      if (!data[0]) return res.redirect("/login");

      req.session.user = data[0];
      req.session.auth = true;
      req.session.isAdmin = false;
      if (data[0].isAdmin) req.session.isAdmin = true;

      res.redirect("/profile");
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async profile(req, res) {
    try {
      if (!req.session.user) res.redirect("/");
      res.render("profile", { session: req.session });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }
}

exports.mainController = new Main();
