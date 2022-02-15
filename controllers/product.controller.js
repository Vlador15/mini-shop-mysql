const { bd } = require("../models/connect");

class Products {
  async getProducts(req, res) {
    try {
      const { link } = req.params;
      const [category, categoryMeta] = await bd.query(
        `SELECT * FROM category WHERE category.path = '${link}' LIMIT 1`
      );

      const [data, dataMeta] = await bd.query(
        `SELECT P.*, C.* FROM product P, category C WHERE P.categoryId = '${category[0].categoryId}' AND C.categoryId = '${category[0].categoryId}'  AND P.quantity > 0`
      );

      console.log(data);

      if (!category[0])
        return res.render("error", {
          error: "Категория не найдена",
          session: req.session,
        });

      return res.render("catalog", {
        data,
        category: category[0],
        session: req.session,
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  async getProduct(req, res) {
    try {
      const { link, id } = req.params;
      const [category] = await bd.query(
        `SELECT * FROM category WHERE category.path = '${link}' LIMIT 1`
      );

      const [data] = await bd.query(
        `SELECT P.*, C.* FROM product P, category C WHERE P.categoryId = C.categoryId AND P.productId = '${id}'`
      );

      if (!category[0])
        return res.render("error", { error: "Категория не найдена" });
      if (!data[0])
        return res.render("error", {
          error: "Товар не найден",
          session: req.session,
        });

      return res.render("view", {
        product: data[0],
        category: category[0],
        session: req.session,
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }
}

exports.productController = new Products();
