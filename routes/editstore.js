import express from "express";
import { ObjectId } from "mongodb";
import { getStoreById } from "../data/stores.js";

const router = express.Router();

router.route("/:id").get(async (req, res) => {
  const storeId = req.params.id;

  try {
    if (!ObjectId.isValid(storeId)) {
      throw "invalid object ID";
    }
  } catch (e) {
    return res.status(400).render("error", { error: e });
  }
  const store = await getStoreById(storeId);
  console.log(storeId);
  const contact_information = store.contact_information;
  const store_location = store.store_location;
  return res.render("editstore", {
    title: "Edit Store",
    storeId: storeId,
    name: store.name,
    address: store_location.streetAddress,
    city: store_location.city,
    state: store_location.state,
    zipCode: store_location.zip,
    email: contact_information.email,
    phoneNumber: contact_information.phone,
  });
});

export default router;
