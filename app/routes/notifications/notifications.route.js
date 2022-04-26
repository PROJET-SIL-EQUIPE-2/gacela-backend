const router = require("express").Router()

const { sendNotification, saveToken } = require("../../controllers/notifications/notifications.controller")


/**
 * @desc Send a notification to specific agent defined with the id
 * @type  PUBLIC
 * @route POST /api/notifications
 * @required @body_param agent_id agent id
 * @required @body_param title    title for the notificatio
 * @required @body_param body     body of the notification
 * @returns  notify the agent else send an error
 */
router.post("/", sendNotification)

/**
 * @desc  Save user FCM token
 * @type  PRIVATE
 * @route PUT /api/notifications
 * @desc  Save or update fcm token
 * @required @body_param agent_id    agent id
 * @required @body_param token       FCM token generated from mobile client
 * @returns  save the token to the database else returns an error
 */
router.put("/save-token", saveToken)

module.exports = router