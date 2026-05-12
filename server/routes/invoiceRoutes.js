const express = require("express");

const router = express.Router();

const {

 createInvoice,
 getUserInvoices,
 getWorkerInvoices

} = require(
 "../controllers/invoiceController"
);

const {
 verifyToken
} = require(
 "../middleware/authMiddleware"
);

/*
CREATE
*/
router.post(
 "/create",
 verifyToken,
 createInvoice
);

/*
USER INVOICES
*/
router.get(
 "/user",
 verifyToken,
 getUserInvoices
);

/*
WORKER INVOICES
*/
router.get(
 "/worker",
 verifyToken,
 getWorkerInvoices
);

module.exports = router;