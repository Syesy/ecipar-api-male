const express = require("express");
const bodyParser = require("body-parser");
const Dish = require("./models/Dish");
const Allergen = require("./models/Allergen");
const AllergenDish = require("./models/AllergenDish");
const PORT = 3000;
function sequelize2plainObject(sequelizeObject) {
  return JSON.parse(JSON.stringify(sequelizeObject));
}
const app = express();
app.use(bodyParser.json());

app.get("/allergens", async (req, res) => {
  const allergens = await Allergen.findAll();
  return res.json(allergens);
});
app.post("/allergens", async (req, res) => {
  const newAllergen = await Allergen.create({
    name: req.body.name
  });
  return res.json(newAllergen);
});
app.get("/dishes", async (req, res) => {
  const dishes = await Dish.findAll();
  for (const dishIndex in dishes) {
    let dish = dishes[dishIndex];
    const allergens = [];
    const allergensDish = await AllergenDish.findAll({
      where: {
        dishId: dish.id
      }
    });
    for (const allergenDish of allergensDish) {
      const allergen = await Allergen.findOne({
        where: {
          id: allergenDish.allergenId
        }
      });

      allergens.push(allergen);
    }
    console.log("------------BEFORE-------------");
    console.log(dishes[dishIndex]);
    dishes[dishIndex] = sequelize2plainObject(dish);
    console.log("------------AFTER-------------");
    console.log(dishes[dishIndex]);
    dishes[dishIndex].allergens = allergens;
  }

  return res.json(dishes);
});
app.post("/dishes", async (req, res) => {
  let newDish = await Dish.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  });

  const allergens = [];

  for (const allergenId of req.body.allergens) {
    const allergen = await Allergen.findOne({
      where: {
        id: allergenId
      }
    });

    if (!allergen) continue;

    allergens.push(allergen);

    await AllergenDish.create({
      allergenId: allergenId,
      dishId: newDish.id
    });
  }
  newDish = sequelize2plainObject(newDish);
  newDish.allergens = allergens;

  return res.json(newDish);
});

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
