import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";

const indexRouter = Router();
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL },
  },
});

indexRouter.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

indexRouter.post("/submit-form", async (req, res, next) => {
  try {
    const { name, phoneNumber } = z
      .object({
        name: z.string(),
        phoneNumber: z.string().regex(/^\d+$/),
      })
      .parse({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
      });

    const existingContact = await prisma.contact.findUnique({
      where: { phone: phoneNumber },
    });

    if (existingContact) {
      req.flash("error", "Phone number already exists");
      return res.redirect("/#addContactForm");
    }

    await prisma.contact.create({
      data: { name, phone: phoneNumber },
    });

    req.flash("success", "Contact added successfully");
    return res.redirect("/#addContactForm");
  } catch (error) {
    next(error);
  }
});

export default indexRouter;
