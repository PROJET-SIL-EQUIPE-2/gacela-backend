var admin = require("firebase-admin");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()


/**
 * @desc Send a notification to specific agent defined with the id
 * @required @param agent_id agent id
 * @required @param title    title for the notificatio
 * @required @param body     body of the notification
 * @returns  notify the agent else send an error
 */
const sendNotification = async (agent_id, title, body) => {
  // notification data
  const payload = {
    notification: {
      title,
      body,
    }
  };
  // options
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  }

  try {

    // get agent notification token
    const amToken = await prisma.notificationsAMToken.findUnique({
      where: {
        id: Number(agent_id)
      }
    });

    if (!amToken)
      return {
        code: 400,
        data: {
          success: false,
          errors: [{ msg: "agent token doesn't exist" }]
        }
      }

    // send the notification to the user
    const response = await admin.messaging().sendToDevice(amToken.token, payload, options)
    return {
      code: 200,
      data: {
        success: true,
        data: {
          response
        }
      }
    }
  } catch (e) {
    console.error(e);
    return {
      code: 500,
      data: {
        success: false,
        data: {
          errors: [{ msg: "Server error..." }]
        }
      }
    }
  }
}

/**
 * @desc Save or update fcm token
 * @required @param agent_id    agent id
 * @required @param token       FCM token generated from mobile client
 * @returns  save the token to the database else returns an error
 */
const saveToken = async (agent_id, token) => {
  try {
    // check if the user exist
    const agent = await prisma.agentsMaintenance.findUnique({
      where: {
        agent_id: agent_id
      }
    })

    if (!agent)
      return {
        code: 400,
        data: {
          success: false,
          errors: [{ msg: "Agent doesn't exist" }]
        }
      }

    // update the notification or insert it
    const notifToken = await prisma.notificationsAMToken.upsert({
      where: {
        id: agent_id,
      },
      update: {
        token,
      },
      create: {
        agent_id,
        token
      },
    })

    if (!notifToken)
      return {
        code: 400,
        data: {
          success: false,
          errors: [{ msg: "can't update token" }]
        }
      }

    // notification saved successfuly
    return {
      code: 200,
      data: {
        success: true,
        data: {
          token: notifToken,
        }
      }
    }

  } catch (e) {
    console.error(e);
    return {
      code: 500,
      data: {
        success: false,
        errors: [{ msg: "server errors" }]
      }
    }
  }
}

module.exports = {
  sendNotification,
  saveToken,
}