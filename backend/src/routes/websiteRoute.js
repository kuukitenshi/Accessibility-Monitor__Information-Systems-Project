const express = require('express');
const router = express.Router();
const websiteController = require('../controller/websiteController');

router.get('/', websiteController.website_list);

router.get('/:id', websiteController.website_get);

router.post('/', websiteController.website_create);

router.delete('/:id', websiteController.website_delete);

router.post('/:id/evaluate', websiteController.website_evaluation);

router.get('/:id/report', websiteController.website_report);

module.exports = router;
