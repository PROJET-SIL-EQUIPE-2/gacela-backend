const { Client } = require('pg')

const yearlyReport = async (year) => {
    const client = new Client()
    await client.connect()
    console.log(year)
    const res = await client.query(`SELECT SUM(real_price) AS TOTAL FROM learn.public."Paiment" WHERE EXTRACT(YEAR FROM date_paiment) = ${year};`)
    await client.end()
    return {
        code: 200,
        data: {
            success: true,
            data: {
                year: year,
                ...res.rows[0],
                currency: "dzd"
            }
        }
    }
}


const monthlyReport = async (year, month) => {
    const client = new Client()
    await client.connect()

    const res = await client.query(`SELECT SUM(real_price) AS TOTAL FROM learn.public."Paiment" WHERE EXTRACT(YEAR FROM date_paiment) = ${year} AND EXTRACT(MONTH FROM date_paiment) = ${month};`)
    await client.end()
    return {
        code: 200,
        data: {
            success: true,
            data: {
                year: year,
                month: month,
                ...res.rows[0],
                currency: "dzd"

            }
        }
    }
}

const dailyReport = async (year, month, day) => {
    const client = new Client()
    await client.connect()
    console.log(day)

    const res = await client.query(`SELECT SUM(real_price) AS TOTAL FROM learn.public."Paiment" WHERE EXTRACT(YEAR FROM date_paiment) = ${year} AND EXTRACT(MONTH FROM date_paiment) = ${month} AND EXTRACT(DAY FROM date_paiment) = ${day};`)
    await client.end()
    return {
        code: 200,
        data: {
            success: true,
            data: {
                year: year,
                month: month,
                day: day,
                ...res.rows[0],
                currency: "dzd"

            }
        }
    }
}

module.exports = {
    yearlyReport,
    dailyReport,
    monthlyReport
}