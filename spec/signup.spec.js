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
            .field('email', 'locataire1@nexcode.dz')
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
                email: "locataire1@nexcode.dz",
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
    it('',()=>{

    })
})

// TEST locataire rejection
describe('POST: Locataire rejection', () => {
    it('',()=>{

    })
})

// TEST AM signup
describe('POST : AM signup', () => {
    it('should return 400 bad request when no password or other required fields supplied', (done) => {
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
                name: "agent2",
                family_name: "agent2",
                email: "agent2@nexcode.dz",
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
                name: "agent1",
                family_name: "agent2",
                email: "agent1@nexcode.dz",
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
                name: "admin1",
                family_name: "admin1",
                email: "admin1@nexcode.dz",
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
                name: "admin2",
                family_name: "admin2",
                email: "admin2@nexcode.dz",
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
                name: "admin1",
                family_name: "admin1",
                email: "admin1@nexcode.dz",
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
                name: "decideur2",
                family_name: "decideur2",
                email: "decideur2@nexcode.dz",
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
                name: "decideur1",
                family_name: "decideur1",
                email: "decideur1@nexcode.dz",
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