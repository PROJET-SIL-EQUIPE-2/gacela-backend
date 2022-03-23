let Request = require("supertest");
Request = Request('http://localhost:3000/api/signup');


// TEST locataire registration
describe("POST: Locataire signup", () => {
    it('should return 400 bad request when no password is supplied', (done) => {
        Request
            .post('/locataire')
            .send({
                name: "locataire1",
                family_name: "locataire1",
                email: "locataire1@nexcode.dz",
                // password: "password", // Password is required
                phone_number: "0777123082",
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body.errors[0].msg === "\"password\" is required").toBe(true);
                done();
            })
    });

    it('should return 400 bad request when no email is supplied', (done) => {
        Request
            .post('/locataire')
            .send({
                name: "locataire1",
                family_name: "locataire1",
                // email: "locataire1@nexcode.dz",// Required
                password: "password",
                phone_number: "0777123082",
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body.errors[0].msg === "\"email\" is required").toBe(true);
                done();
            })
    });

    it('should return 201 resource created when everything is ok', (done) => {
        Request
            .post('/locataire')
            .field('name', 'locataire1')
            .field('family_name','locataire1')
            .field('email', 'validateme@nexcode.dz')
            .field('password', 'password')
            .field('phone_number','0777123082')
            .attach('personal_photo', 'spec/test_files/test.jpg')
            .attach('photo_identity', 'spec/test_files/test.jpg')
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res.body.success === true).toBe(true)
                expect(res.body.data.msg === "Locataire registered").toBe(true);
                done();
            })

        Request
            .post('/locataire')
            .field('name', 'locataire1')
            .field('family_name','locataire1')
            .field('email', 'rejectme@nexcode.dz')
            .field('password', 'password')
            .field('phone_number','0777123082')
            .attach('personal_photo', 'spec/test_files/test.jpg')
            .attach('photo_identity', 'spec/test_files/test.jpg')
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res.body.success === true).toBe(true)
                expect(res.body.data.msg === "Locataire registered").toBe(true);
                done();
            })

    });

    it('should return 400 bad request when no photos uploaded', (done) => {
        Request
            .post('/locataire')
            .field('name', 'locataire2')
            .field('family_name','locataire2')
            .field('email', 'locataire2@nexcode.dz')
            .field('password', 'password')
            .field('phone_number','0777123082')
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res.body.success === false).toBe(true)
                expect(res.body.errors[0].msg === "Photos must be provided").toBe(true);
                done();
            })
    });

    it('should return 400 bad request locataire already exists', (done) => {
        Request
            .post('/locataire')
            .send({
                name: "locataire1",
                family_name: "locataire1",
                email: "validateme@nexcode.dz",
                password: "password",
                phone_number: "0777123082",
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body.errors[0].msg === "Locataire already exists").toBe(true);
                done();
            })
    });

})

// TEST locataire validation
describe('POST: Locataire validation', () => {
    it('should return 400 bad request when no email is provided',(done)=>{
        Request
            .post("/locataire/validate")
            .send({
                // no email
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err){
                    done();
                }
                expect(res.body.errors[0].msg === "\"email\" is required").toBe(true)
                done();
            })
    });

    it("should return 400 bad request when no locataire exists with this email", (done) => {
        Request
            .post("/locataire/validate")
            .send({
                email: "nolocataire@nexcode.dz"
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err){
                    done();
                }
                expect(res.body.errors[0].msg === "Locataire doesn't exists").toBe(true)
                done();
            })
    });

    it("should return 200 OK when locataire is validated", (done) => {
        Request
            .post("/locataire/validate")
            .send({
                email: "validateme@nexcode.dz"
            })
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err){
                    done();
                }
                expect(res.body.success === true).toBe(true)
                expect(res.body.data.validated === true).toBe(true)
                done();
            })
    });

    it("should return 400 when locataire is already validated", (done) => {
        Request
            .post("/locataire/validate")
            .send({
                email: "validateme@nexcode.dz"
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err){
                    done();
                }
                expect(res.body.errors[0].msg === "Locataire is already validated").toBe(true)
                done();
            })
    });

})

// TEST locataire rejection
describe('POST: Locataire rejection', () => {
    it('should return 400 bad request when no email is provided',(done)=>{
        Request
            .post("/locataire/reject")
            .send({
                // no email
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err){
                    done();
                }
                expect(res.body.errors[0].msg === "\"email\" is required").toBe(true)
                done();
            })
    });
    it("should return 400 bad request when no locataire exists with this email", (done) => {
        Request
            .post("/locataire/reject")
            .send({
                email: "nolocataire@nexcode.dz",
                justificatif: "Une justification par l admin"
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err){
                    done();
                }
                expect(res.body.errors[0].msg === "Locataire doesn't exists").toBe(true)
                done();
            })
    });

    it("should return 400 when locataire is already validated", (done) => {
        Request
            .post("/locataire/reject")
            .send({
                email: "validateme@nexcode.dz",
                justificatif: "Une justification par l admin"
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err){
                    done();
                }
                expect(res.body.errors[0].msg === "Locataire is already validated").toBe(true)
                done();
            })
    });

    it("should return 200 OK when rejected", (done) => {
        Request
            .post("/locataire/reject")
            .send({
                email: "rejectme@nexcode.dz",
                justificatif: "Une justification par l admin"
            })
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err){
                    done();
                }
                expect(res.body.success === true).toBe(true)
                done();
            })
    });

})

// TEST AM signup
describe('POST : AM signup', () => {
    it('should return 400 bad request when no password or other required fields supplied', (done) => {
        Request
            .post('/agent')
            .send({
                name: "agent",
                family_name: "agent",
                email: "agent@nexcode.dz",
                phone_number: "077766556665",
                // Password is required
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res.body.errors[0].msg === "\"password\" is required").toBe(true);
                done();
            });
    });


    it('should returns 201 resource created when everything is ok', (done) => {
        Request
            .post('/agent')
            .send({
                name: "agent",
                family_name: "agent",
                email: "agent@nexcode.dz",
                phone_number: "077766556665",
                password: "password"
            })
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                console.log(res.body);
                expect(res.body.success === true).toBe(true)
                expect(res.body.data.msg === "New agent added").toBe(true);
                done();
            });
    })


    it('should return 400 Bad request, Agent already exists', (done) => {
        Request
            .post('/agent')
            .send({
                name: "agent",
                family_name: "agent",
                email: "agent@nexcode.dz",
                phone_number: "077766556665",
                password: "password"
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                console.log(res.body);
                expect(res.body.errors[0].msg === "Agent already exists").toBe(true);
                done();
            });
    })
});

// TEST admin registration

describe('POST : Admin registration', () => {
    it('should return 400 Bad request when no password or other required fields supplied', (done) => {
        Request
            .post('/admin')
            .send({
                name: "admin",
                family_name: "admin",
                email: "admin@nexcode.dz",
                phone_number: "077766556665",
                // Password is required
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    // return;
                }
                expect(res.body.errors[0].msg === "\"password\" is required").toBe(true);
                done();
            });
    });


    it('should returns 201 resource created when everything is ok', (done) => {
        Request
            .post('/admin')
            .send({
                name: "admin",
                family_name: "admin",
                email: "admin@nexcode.dz",
                password: "password"
            })
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err){
                    done(err);
                }
                expect(res.body.success === true).toBe(true)
                expect(res.body.data.msg === "Admin added").toBe(true);
                done();
            });
    });
    it('should return 400 Bad request when admin already exists', (done) => {
        Request
            .post('/admin')
            .send({
                name: "admin",
                family_name: "admin",
                email: "admin@nexcode.dz",
                password: "password"
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    // return;
                }
                expect(res.body.errors[0].msg === "Admin already exists").toBe(true);
                done();
            });
    });
});

// TEST decideur registration

describe('POST : Decideur signup', () => {
    it('should return 400 Bad request when no password or other required fields supplied', (done) => {
        Request
            .post('/decideur')
            .send({
                name: "decideur",
                family_name: "decideur",
                email: "decideu@nexcode.dz",
                phone_number: "077766556665",
                // Password is required
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res.body.errors[0].msg === "\"password\" is required").toBe(true);
                done();
            });
    });


    it('should returns 201 resource created when everything is ok', (done) => {
        Request
            .post('/decideur')
            .send({
                name: "decideur",
                family_name: "decideur",
                email: "decideur@nexcode.dz",
                phone_number: "077766556665",
                password: "password"
            })
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res.body.success === true).toBe(true)
                expect(res.body.data.msg === "Decideur added").toBe(true);
                done();
            });
    })

    it('should return 400 Bad request when decideur already exists', (done) => {
        Request
            .post('/decideur')
            .send({
                name: "decideur",
                family_name: "decideur",
                email: "decideur@nexcode.dz",
                phone_number: "077766556665",
                password: "password"
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                    return;
                }
                expect(res.body.errors[0].msg === "Decideur already exists").toBe(true);
                done();
            });
    });
});