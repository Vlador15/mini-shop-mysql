const { bd } = require("../models/connect");
const moment = require("moment");

class Admin {
  async orders(req, res) {
    try {
      const [data] = await bd.query(
        "SELECT O.*, I.*, P.* FROM `order` O, orderItems I, product P WHERE O.orderId = I.orderId AND I.productId = P.productId"
      );

      let result = data.map((x) => {
        x.date = moment(x.date).format("DD.MM.YYYY, hh:mm:ss");
        return x;
      });

      res.render("admin-orders", { session: req.session, data: result });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      await bd.query("DELETE FROM `order` WHERE `orderId` = ?", [[id]]);
      await bd.query("DELETE FROM `orderItems` WHERE `orderId` = ?", [[id]]);

      res.render("success", {
        session: req.session,
        text: "Заказ успешно удален",
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async createProductPage(req, res) {
    try {
      let [category] = await bd.query("SELECT * FROM `category`");
      let result = category.map((x) => ({ id: x.categoryId, name: x.name }));

      res.render("admin-create-product", {
        session: req.session,
        categories: result,
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async createProduct(req, res) {
    try {
      const data = req.body;
      const values = [[Object.values(data)]];

      await bd.query(
        "INSERT INTO product (`categoryId`, `title`, `price`, `photo`, `quantity`, `description`) VALUES ?",
        values
      );

      res.render("success", {
        session: req.session,
        text: "Вы успешно добавили продукт",
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async createCategoryPage(req, res) {
    try {
      res.render("admin-create-category", {
        session: req.session,
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async createCategory(req, res) {
    try {
      const data = req.body;
      const values = [[Object.values(data)]];

      await bd.query("INSERT INTO category (`name`, `path`) VALUES ?", values);

      res.render("success", {
        session: req.session,
        text: "Вы успешно добавили категорию",
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async categoriesPage(req, res) {
    try {
      let [categories] = await bd.query("SELECT * FROM `category`");

      res.render("admin-categories", {
        session: req.session,
        categories,
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async products(req, res) {
    try {
      const { id } = req.params;
      const [products] = await bd.query(
        `SELECT * FROM product WHERE categoryId = ${id}`
      );
      let [category] = await bd.query(
        `SELECT * FROM category WHERE categoryId = ${id}`
      );

      res.render("admin-products", {
        session: req.session,
        category: category[0],
        products,
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      await bd.query("DELETE FROM product WHERE `productId` = ?", [[id]]);

      res.render("success", {
        session: req.session,
        text: "Вы успешно удалили товар",
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }
}

exports.adminController = new Admin();
