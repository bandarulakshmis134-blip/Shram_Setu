const express = require("express");

const router = express.Router();

const {

 createInvoice,
 getUserInvoices,
 getWorkerInvoices,
 getInvoiceByRequestId

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

/*
GET INVOICE BY REQUEST ID
*/
router.get(
 "/request/:requestId",
 verifyToken,
 getInvoiceByRequestId
);

module.exports = router;