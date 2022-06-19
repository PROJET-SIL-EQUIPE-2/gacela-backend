const { Client } = require('pg')
const pathlib = require("path");
const fs = require("fs");
const html_to_pdf = require('html-pdf-node');
const reportHtml = `
<html lang="en">
    <head>
        <title>
            Payment Report
        </title>
        <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              font-family: Monospace,serif;
            }
    
            .logo {
              margin: 1rem;
              margin-left: auto;
            }
    
            .center {
              /*margin: 0 auto;
              */
              position: absolute;
              left: 40%;
              top: 30%;
              border: 2px solid green;
              padding: 1rem;
            }
    
            .title {
              font-size: 1.5rem;
              font-weight: bold;
              margin: 0.5rem;
            }
    
            .costs {
              margin: 0.5rem;
            }
        </style>
    </head>
    <body>
        <div class="logo">
          LOGO
        </div>
        <div class="center">
          <div class="title">
            Payment Report
          </div>
          <div class="costs">
            Admins salary: {{adminsSalary}}}
          </div>
          <div class="costs">
            Decideurs salary: {{decideursSalary}}
          </div>
          <div class="costs">
            Agents salary: {{agentsSalary}}
          </div>
          <div class="costs">
            Couts maintenance: {{maintenanceCost}}
          </div>
          <div class="costs">
            Balance: {{balance}}
          </div>
        </div>
    </body>
</html>
`
const yearlyReport = async (year, res) => {
    const client = new Client()
    await client.connect()
    console.log(year)
    const totalReservationsMoney = await client.query(`SELECT SUM(real_price) AS TOTAL FROM learn.public."Paiment" WHERE EXTRACT(YEAR FROM date_paiment) = ${year};`)
    const adminsTotalSalary = await client.query(`SELECT 12 * SUM(salary) as total FROM learn.public."Admins" a`)
    const decidersTotalSalary = await client.query(`SELECT 12 * SUM(salary) as total FROM learn.public."Decideurs"`)
    const agentsTotalSalary = await client.query(`SELECT 12 * SUM(salary) as total FROM learn.public."AgentsMaintenance"`)
    const maintainsCost = await client.query(`SELECT 12 * SUM(cost) as total FROM learn.public."Vehicules"`)
    console.log(totalReservationsMoney.rows[0]);
    const benefit = totalReservationsMoney.rows[0].total
                    - adminsTotalSalary.rows[0].total
                    - decidersTotalSalary.rows[0].total
                    - agentsTotalSalary.rows[0].total
                    - maintainsCost.rows[0].total

    await client.end()

    let options = { format: 'A4' };
    const file = { content: `
    <html lang="en">
        <head>
            <title>
                Payment Report
            </title>
            <style>
                body {
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                font-family: Monospace,serif;
            }

                .logo {
                margin: 1rem;
                margin-left: auto;
            }

                .center {
                /*margin: 0 auto;
                */
                position: absolute;
                left: 40%;
                top: 30%;
                border: 2px solid green;
                padding: 1rem;
            }

                .title {
                font-size: 1.5rem;
                font-weight: bold;
                margin: 0.5rem;
            }

                .costs {
                margin: 0.5rem;
            }
            </style>
        </head>
        <body>
        <div class="logo">
            LOGO
        </div>
        <div class="center">
            <div class="title">
                Payment Report
            </div>
            <div class="costs">
                Total reservations: ${totalReservationsMoney.rows[0].total}
            </div>
            <div class="costs">
                Admins salary: ${adminsTotalSalary.rows[0].total}
            </div>
            <div class="costs">
                Decideurs salary: ${decidersTotalSalary.rows[0].total}
            </div>
            <div class="costs">
                Agents salary: ${agentsTotalSalary.rows[0].total}
            </div>
            <div class="costs">
                Couts maintenance: ${maintainsCost.rows[0].total}
            </div>
            <div class="costs">
                Balance: ${benefit}
            </div>
        </div>
        </body>
        </html>
        `};
    const reportFileName = `payment-report-${new Date().toISOString()}.pdf`
    const path = pathlib.join("reports", "payments", reportFileName)
    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
        fs.createWriteStream(path).write(pdfBuffer, (err) => {
            if (err){
                return res.status(500).json({status: false, data: "Could not generate report"})
            }
            return res.status(200).json({
                success: true,
                data: {
                    year: year,
                    totalReservationsMoney: totalReservationsMoney.rows[0].total,
                    adminsTotalSalary: adminsTotalSalary.rows[0].total,
                    decidersTotalSalary: decidersTotalSalary.rows[0].total,
                    agentsTotalSalary: agentsTotalSalary.rows[0].total,
                    maintainsCost: maintainsCost.rows[0].total,
                    benefit,
                    currency: "dzd",
                    path
                }
            })
        })
    })
        .catch(e => {
            return {
                code: 500,
                data: "Could not generate report"
            }
        });


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