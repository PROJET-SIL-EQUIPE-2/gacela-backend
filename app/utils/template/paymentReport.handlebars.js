const html = `
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