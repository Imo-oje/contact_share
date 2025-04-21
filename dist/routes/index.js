"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = require("express");
const zod_1 = require("zod");
const indexRouter = (0, express_1.Router)();
const prisma = new client_1.PrismaClient({
    datasources: {
        db: { url: `${process.env.DATABASE_URL}` },
    },
});
indexRouter.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});
indexRouter.post("/submit-form", async (req, res, next) => {
    try {
        const { name, phoneNumber } = zod_1.z
            .object({
            name: zod_1.z.string(),
            phoneNumber: zod_1.z.string().regex(/^\d+$/),
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = indexRouter;
