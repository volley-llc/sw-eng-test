/* eslint-disable no-console */
import Ajv from "ajv";
import express from "express";

import customersIn from "./customers.json";
import prospectsIn from "./prospects.json";

/**
 * AJV validator.
 */
const ajv = new Ajv({ coerceTypes: true });

// eslint-disable-next-line max-len
ajv.addFormat("email", /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i)

const emailValidator = ajv.compile<string>({ type: "string", format: "email" });
const numericValidator = ajv.compile<number>({ type: "number" });

const userCreateValidator = ajv.compile({
    $id: "https://fakeapi.com/schemas/createCustomer.json",
    type: "object",
    required: [
        "firstName",
        "lastName",
        "email",
        "prospectId",
    ],
    properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        prospectId: { type: ["number", "null"] },
    },
    additionalProperties: false,
});

const prospectCreateValidator = ajv.compile({
    $id: "https://fakeapi.com/schemas/createProspect.json",
    type: "object",
    properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
    },
    additionalProperties: false,
    required: [
        "firstName",
        "lastName",
        "email",
    ],
});

const prospectUpdateValidator = ajv.compile({
    $id: "https://fakeapi.com/schemas/updateProspect.json",
    type: "object",
    properties: {
        id: { type: "number" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        customerId: { type: "number" },
    },
    required: [
        "id",
    ],
    additionalProperties: false,
});

/**
 * Express app.
 */
const app = express();

// Wire up JSON middleware.
app.use(express.json());

function errorHandlingMiddleware(
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
) {
    res.status(500).json(err);
}

// Send 500 on unhandled errors
app.use(errorHandlingMiddleware);

/**
 * Data model for the prospect records.
 */
interface Prospect {
    id: number;
    customerId: number | null;
    firstName: string;
    lastName: string;
    email: string;
}

/**
 * Data model for the customer records.
 */
interface Customer {
    id: number;
    prospectId: number | null;
    firstName: string;
    lastName: string;
    email: string;
}

/*
 * Create a new customer record.
 */
interface CustomerDto {
    prospectId: number | null;
    firstName: string;
    lastName: string;
    email: string;
}

/*
 * Create a new prospect record.
 */
interface ProspectDto {
    firstName: string;
    lastName: string;
    email: string;
}

/*
 * Update a new prospect record.
 */
interface ProspectUpdateDto {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    customerId?: number;
}

/**
 * Properly typed "database" of our customer records.
 */
const customers = customersIn as Customer[];

/**
 * Properly typed "database" of our customer records.
 */
const prospects = prospectsIn as Prospect[];

/**
 * Endpoint for querying for prospects in the database.
 */
app.get("/prospects", (req, res) => {
    const { email } = req.query;
    if (email !== undefined) {
        if (!emailValidator(email)) {
            res.status(400)
                .json({ error: "Invalid email filter supplied" });
            return;
        }
        const filtered = prospects.filter((prospect) => !email || email === prospect.email);
        res.json(filtered);
    } else {
        res.json(prospects);
    }
});

/**
 * Endpoint for querying for customers in the database.
 */
app.get("/customers", (req, res) => {
    const { email, prospectId } = req.query;

    let filtered = customers;

    if (email !== undefined) {
        if (!emailValidator(email)) {
            res.status(400)
                .json({ error: "Invalid email filter supplied" });
            return;
        }

        filtered = filtered.filter((customer) => (!email || email === customer.email));
    }

    if (prospectId !== undefined) {
        if (typeof prospectId === "string") {
            if (!numericValidator(prospectId)) {
                res.status(400)
                    .json({ error: "Invalid prospectId filter supplied" });
                return;
            }

            filtered = filtered.filter((customer) => parseInt(prospectId, 10) === customer.prospectId);
        } else {
            res.status(400)
                .json({ error: "Invalid prospectId filter supplied" });
            return;
        }
    }

    res.json(filtered);
});

/**
 * Endpoint for creating a customer in the database.
 */
app.post("/customers", (req, res) => {
    if (!userCreateValidator(req.body)) {
        res.status(400)
            .json({ error: "Invalid customer create record body" });
        return;
    }

    const customerDto = req.body as CustomerDto;

    const ids = customers.map((c) => c.id);
    const id = Math.max(...ids) + 1;

    const customerRecord = {
        id,
        ...customerDto,
    };

    const { prospectId } = customerDto;
    if (prospectId !== null) {
        const prospectIndex = prospects.findIndex((p) => p.id === prospectId);
        if (prospectIndex === -1) {
            res.status(400)
                .json({ error: "Invalid prospectId specified" });
            return;
        }
    }

    const { email } = customerDto;
    const match = customers.find((c) => email === c.email);
    if (match) {
        res.status(409)
            .json({ error: "A customer with that email already exists" });
        return;
    }

    customers.push(customerRecord);
    console.log(`New customer created with ID: ${id}`);
    res.status(201)
        .json(customerRecord);
});

/**
 * Endpoint for creating a prospect in the database.
 */
app.post("/prospects", (req, res) => {
    if (!prospectCreateValidator(req.body)) {
        res.status(400)
            .json({ error: "Invalid prospect create record body" });
        return;
    }

    const prospectDto = req.body as ProspectDto;

    const { email } = prospectDto;
    const match = prospects.find((p) => email === p.email);
    if (match) {
        res.status(409)
            .json({ error: "A prospect with that email already exists" });
        return;
    }

    const ids = prospects.map((p) => p.id);
    const id = Math.max(...ids) + 1;

    const prospectRecord: Prospect = {
        id,
        customerId: null,
        ...prospectDto,
    };

    prospects.push(prospectRecord);

    console.log(`New prospect created with ID: ${id}`);

    res.status(201)
        .json(prospectRecord);
});

/**
 * Endpoint for updating a prospect in the database.
 */
app.put("/prospects", (req, res) => {
    if (!prospectUpdateValidator(req.body)) {
        res.status(400)
            .json({ error: "Invalid prospect update record body" });
        return;
    }

    const prospectDto = req.body as ProspectUpdateDto;

    const target = prospects.find((p) => prospectDto.id === p.id);
    if (target === undefined) {
        res.status(404)
            .json({ error: "No prospect with that id exists" });
        return;
    }

    const targetIndex = prospects.findIndex((p) => prospectDto.id === p.id);

    if (prospectDto.customerId) {
        const customer = customers.find((c) => prospectDto.customerId === c.id);
        if (customer === undefined) {
            res.status(400)
                .json({ error: "No customer with that id exists" });
            return;
        }
    }

    const prospectRecord = Object.assign(target, prospectDto);

    prospects[targetIndex] = prospectRecord;

    console.log(`Prospect [${target.id}] updated`);

    res.status(200)
        .json(prospectRecord);
});

app.listen(8000, () => {
    console.log("Fake API server running on port 8000");
});
