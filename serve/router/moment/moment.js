const express = require('express')
const router = express.Router()
const moment_handler = require('../../router_handler/moment/moment_handler')

router.get('/getMoment', moment_handler.getMoments)


module.exports = router