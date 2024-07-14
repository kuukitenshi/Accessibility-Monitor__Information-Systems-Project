const express = require('express');
const router = express.Router();
const webpageController = require('../controller/webpageController');

router.get('/', webpageController.webpage_list);

router.get('/:id', webpageController.webpage_get);

router.post('/', webpageController.webpage_create);

router.delete('/:id', webpageController.webpage_delete);

module.exports = router;
