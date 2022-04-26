const mqtt = require('mqtt');

const client = mqtt.connect("mqtt://test.mosquitto.org:1883")

client.on("connect", () => {
    console.log("Connected")
})

const send = (message) => {
    const topic = "device/reservation/code";
    console.log(client.connected)
    client.publish(topic, message, { retain: true });
}

const setStatus = (message) => {
    const topic = "device/status";
    client.publish(topic, message, { retain: true });
}



module.exports = {
    send,
    setStatus
}