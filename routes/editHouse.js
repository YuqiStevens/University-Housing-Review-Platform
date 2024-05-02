import express from "express";
import { ObjectId } from "mongodb";
import { getHouseById } from "../data/house.js";

const router = express.Router();


router.route("/:id").get(async (req, res) => {
  const houseId = req.params.id;

    try {
      if (!ObjectId.isValid(houseId)) {
        throw "invalid object ID";
      }
    } catch (e) {
      return res.status(400).render("error", { error: e });
    }

    const house = await getHouseById(houseId);
    console.log(houseId);

    //const contact_information = house.contact_information;
    const house_location = house.store_location;

    return res.render("editstore", {
      title: "Edit Store",
      houseId: houseId,
      name: house.name,
      address: house_location.streetAddress,
      city: house_location.city,
      state: house_location.state,
      zipCode: house_location.zip,
      //email: contact_information.email,
      //phoneNumber: contact_information.phone,
    });
});


export default router;
