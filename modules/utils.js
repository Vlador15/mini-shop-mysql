var moment = require("moment");

function verification(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

function checkSession(req, res, next) {
  if (!req.session.user) req.session.user = undefined;
  if (!req.session.products) req.session.products = [];
  if (!req.session.order) req.session.order = [];
  if (!req.session.messages) {
    req.session.messages = [];
  }
  return next();
}

function checkAdmin(req, res, next) {
  if (!req.session.isAdmin) return res.redirect("/");
  return next();
}

function date() {
  return `${moment(Date.now() + 3600000 * 3).format("DD.MM.YYYY : HH:mm:ss")}`;
}

function dateMessage() {
  return `${moment(Date.now() + 3600000 * 3).format("DD.MM.YYYY : HH:mm:ss")}`;
}

function spaces(string) {
  if (typeof string !== "string") string = string.toString();
  return string
    .split("")
    .reverse()
    .join("")
    .match(/[0-9]{1,3}/g)
    .join(" ")
    .split("")
    .reverse()
    .join("");
}

function rand(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

module.exports = {
  verification,
  checkSession,
  checkAdmin,
  date,
  spaces,
  dateMessage,
  rand,
};
