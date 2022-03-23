let Request = require("supertest");
Request = Request('http://localhost:3000/api/signup');


// TEST locataire signup

// TEST locataire validation

// TEST locataire rejection

// TEST AM signup
describe('POST : AM signup', () => {
    it('should return 400 OK when no password or other required fields supplied', (done) => {
        Request
            .post('/agent')
            .send({
                name: "agent1",
                family_name: "agent2",
                email: "agent1@nexcode.dz",
                phone_number: "077766556665",
                // Password is required
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.errors[0].msg === "\"password\" is required").toBe(true);
            });
    });


    it('should returns 201 resource created when everything is ok', (done) => {
        Request
            .post('/agent')
            .send({
                name: "agent1",
                family_name: "agent2",
                email: "agent1@nexcode.dz",
                phone_number: "077766556665",
                password: "password"
            })
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                console.log(res.body);
                expect(res.body.success === true).toBe(true)
                expect(res.body.data.msg === "New agent added").toBe(true);
                done();
            });
    })
});

// TEST admin registration

describe('POST : Admin registration', () => {
    it('should return 400 OK when no password or other required fields supplied', (done) => {
        Request
            .post('/admin')
            .send({
                name: "agent1",
                family_name: "agent2",
                email: "agent1@nexcode.dz",
                phone_number: "077766556665",
                // Password is required
            })
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.errors[0].msg === "\"password\" is required").toBe(true);

                done();
            });
    });


    it('should returns 201 resource created when everything is ok', (done) => {
        Request
            .post('/admin')
            .send({
                name: "admin1",
                family_name: "admin1",
                email: "admin1@nexcode.dz",
                password: "password"
            })
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.success === true).toBe(true)
                expect(res.body.data.msg === "Admin added").toBe(true);
                done();
            });
    })
});

// TEST decideur registration

describe('POST : AM signup', () => {
    it('should return 400 OK when no password or other required fields supplied', (done) => {
        Request
            .post('/decideur')
            .send({
                name: "decideur1",
                family_name: "decideur1",
                email: "decideur1@nexcode.dz",
                phone_number: "077766556665",
                // Password is required
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body.errors[0].msg === "\"password\" is required").toBe(true);
            });
    });


    it('should returns 201 resource created when everything is ok', (done) => {
        Request
            .post('/decideur')
            .send({
                name: "decideur1",
                family_name: "decideur1",
                email: "decideur1@nexcode.dz",
                phone_number: "077766556665",
                password: "password"
            })
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.success === true).toBe(true)
                expect(res.body.data.msg === "Decideur added").toBe(true);
                done();
            });
    })
});