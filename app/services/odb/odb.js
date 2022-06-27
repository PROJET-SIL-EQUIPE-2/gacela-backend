const mqtt = require('mqtt');

const client = mqtt.connect(process.env.MQTT_SERVER)

client.on("connect", () => {
    console.log("Connected to MQTT")
})

const send = (message) => {
    const topic = "device/reservation/code";
    console.log(client.connected)
    client.publish(topic, message, { retain: true });
}

const setStatus = (message) => {
    console.log(client.connected)
    const topic = "device/status";
    console.log("Sending to: ", topic," a message ", message)
    client.publish(topic, message);
}

const lockCar = () => {

}

const unlockCar = () => {

}

module.exports = {
    client,
    send,
    setStatus
}