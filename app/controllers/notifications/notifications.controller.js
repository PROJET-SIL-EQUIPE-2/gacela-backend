const Joi = require("joi");

const notificationsService = require("../../services/notifications/notifications.service")

const validateNotificationBody = (data) => {
  const validationSchema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    agent_id: Joi.number().required(),
  });
  return validationSchema.validate(data)
}

const validateTokenRequest = (data) => {
  const validationSchema = Joi.object({
    agent_id: Joi.number().required(),
    token: Joi.string().required(),
  });
  return validationSchema.validate(data)
}


/**
 * @desc Send a notification to specific agent defined with the id
 * @type  PUBLIC
 * @route POST /api/notifications
 * @required @body_param agent_id agent id
 * @required @body_param title    title for the notificatio
 * @required @body_param body     body of the notification
 * @returns  notify the agent else send an error
 */
const sendNotification = async (req, res) => {
  const { error } = validateNotificationBody(req.body);
  if (error) {
    // Bad request
    return res.status(400).json({
      errors: [{ msg: error.details[0].message }]
    });
  }

  const { agent_id, title, body } = req.body;

  const { code, data } = await notificationsService.sendNotification(agent_id, title, body);

  return res.status(code).json(data)
}


/**
 * @desc  Save user FCM token
 * @type  PRIVATE
 * @route PUT /api/notifications
 * @desc  Save or update fcm token
 * @required @body_param agent_id    agent id
 * @required @body_param token       FCM token generated from mobile client
 * @returns  save the token to the database else returns an error
 */
const saveToken = async (req, res) => {
  const { error } = validateTokenRequest(req.body);
  if (error) {
    // Bad request
    return res.status(400).json({
      success: false,
      errors: [{ msg: error.details[0].message }]
    });
  }

  const { agent_id, token } = req.body

  const { code, data } = await notificationsService.saveToken(agent_id, token);

  return res.status(code).json(data)
}

module.exports = { sendNotification, saveToken }