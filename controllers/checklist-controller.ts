import { Request, Response } from 'express';
const authorize = require("../utils/authorize");

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/* Get all checklist for the user */
async function getChecklist(req: Request, res: Response):Promise<Response> {
    const decode = authorize(req, res);
    if (!decode) { return };
    const { profile_id } = decode;

    const checklistData = await prisma.checklist.findMany({
        where: {
            user_ProfileId: profile_id
        }
    })

    return res.status(200).json(checklistData);
}

/* Get a single checklist item by ID */
async function getChecklistItem(req: Request, res: Response):Promise<Response> {
    const decode = authorize(req, res);
    if (!decode) { return };
    const { profile_id } = decode;

    const { itemId } = req.params;

    const itemData = await prisma.checklist.findUnique({
        where: {
            id: Number(itemId),
            user_ProfileId: profile_id
        }
    })

    return res.status(200).json(itemData);
}


/* Post new checklist item */
async function createNewItem(req: Request, res: Response):Promise<Response> {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };
    const { profile_id } = decode;

    // Validating request
    const { title, description, isDaily, priority } = req.body;

    if (!title || !String(isDaily) || !priority) {
        return res.status(400).json({ message: "Must have all required fields" })
    }

    // Save it into database
    await prisma.checklist.create({
        data: {
            title, description, isDaily, priority, user_ProfileId: profile_id,

        }
    })

    return res.status(201).json({ message: "New checklist item created." })
}


/* Edit new checklist item */
async function editItem(req: Request, res: Response):Promise<Response> {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };
    const { profile_id } = decode;
    const id: number = Number(req.params.itemId);

    // Validating request
    const { title, description, isDaily, priority } = req.body;

    if (!title || !description || !(isDaily === true || isDaily === false) || !priority) {
        return res.status(400).json({ message: "Must have all fields" })
    }

    // Check if item exist
    const currentData = await prisma.checklist.findFirst({
        where: { id }
    });

    // If the item doesn't exist
    if (!currentData) {
        return res.status(400).json({ message: `Unable to find item with ID: ${id}` });
    }

    // If item exists
    await prisma.checklist.update({
        where: {
            id
        },
        data: {
            title, description, isDaily, priority, user_ProfileId: profile_id
        }
    })

    return res.status(200).json({ message: "Successfully updated" })
}

/* Patch when the item is checked/unchecked */
async function isChecked(req: Request, res: Response):Promise<Response> {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };
    const { profile_id } = decode;
    const id = Number(req.params.itemId);

    const { checked } = req.body;

    // Check if item exist
    const currentData = await prisma.checklist.findFirst({
        where: { id, user_ProfileId: profile_id }
    });

    // If the item doesn't exist
    if (!currentData) {
        return res.status(400).json({ message: `Unable to find your item with ID: ${id}` });
    }

    await prisma.checklist.update({
        where: { id },
        data: { isChecked: checked }
    })

    return res.status(200).json({ message: "Successfully updated" })
}


/* Delete checklist item */
async function deleteItem(req: Request, res: Response):Promise<Response> {
    // Authorization 
    const decode = authorize(req, res);
    if (!decode) { return };
    const { profile_id } = decode;
    const id: number = Number(req.params.itemId);

    // Check if item exist
    const currentData = await prisma.checklist.findFirst({
        where: { id, user_ProfileId: profile_id }
    });

    // If the item doesn't exist
    if (!currentData) {
        return res.status(400).json({ message: `Unable to find your item with ID: ${id}` });
    }

    // Delete item
    await prisma.checklist.delete({
        where: { id }
    })

    return res.sendStatus(204);
}


module.exports = {
    getChecklist,
    getChecklistItem,
    createNewItem,
    editItem,
    isChecked,
    deleteItem
}