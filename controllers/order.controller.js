const { bd } = require("../models/connect");

class Order {
  // check order
  async viewOrder(req, res) {
    try {
      const { productId } = req.query;
      if (!productId)
        return res.render("error", {
          error: "Не все параметры переданы",
          session: req.session,
        });

      const sql = `SELECT P.*, C.* FROM product P, category C WHERE P.productId = '${productId}' AND P.categoryId = C.categoryId AND P.quantity > 0`;
      const [data] = await bd.query(sql);

      if (!data[0])
        return res.render("error", {
          error: "Товар с таким ID не найден",
          session: req.session,
        });

      res.render("order", { data: data[0], session: req.session });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }

  // create order
  async createOrder(req, res) {
    try {
      const { id } = req.params;
      if (!id)
        return res.render("error", {
          error: "Не все параметры переданы",
          session: req.session,
        });

      const data = req.body;
      const values = [[Object.values(data)]];

      const result = await bd.query(
        "INSERT INTO `order` (`fullName`, `email`, `phone`, `city`, `address`, `comment`) VALUES ?",
        values
      );

      await bd.query(
        "INSERT INTO `orderItems` (`productId`, `orderId`) VALUES (?, ?)",
        [id, result[0].insertId]
      );

      await bd.query(
        "UPDATE `product` SET quantity = quantity - 1 WHERE productId = ?",
        [id]
      );

      res.render("success", {
        text: `Вы успешно купили товар`,
        session: req.session,
      });
    } catch (e) {
      return res.render("error", { session: req.session, error: e.message });
    }
  }
}

exports.orderController = new Order();
