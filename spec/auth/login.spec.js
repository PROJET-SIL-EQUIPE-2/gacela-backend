const Request = require('supertest');
request = Request('http://localhost:3000/api');

describe('POST : Authentification des locataire', () => {
    it('returns 200 OK when using valid input and credentials', (done) => {
        request
            .post('/mobile_login/locataire')
            .send({
                email: 'in_fatmi@esi.dz',
                password: 'resetreset',
            })
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.success).toBe(true);

                done();
            });
    });

    it('returns 400 Bad Request when not sending either an email or password', (done) => {
        request
            .post('/mobile_login/locataire')
            .send({
                email: 'in_fatmi@esi.dz',
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);

                expect(res.body.success).toBe(false);
                done();
            });
    });

    it('returns 400 when using wrong credentials', (done) => {
        request
            .post('/mobile_login/locataire')
            .send({
                email: 'in_fatmi@esi.dz',
                motdepasse: 'slmcvhmd',
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.success).toBe(false);
                done();
            });
    });

    it('returns 401 Unauthorized when l\'utilisateur non validé', (done) => {
        request
            .post('/mobile_login/locataire')
            .send({
                email: "ia_yalaoui@esi.dz",
                password: "resetreset",
            })
            .expect(401)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);

                expect(res.body.success).toBe(false);
                done();
            });
    });
});


describe('POST : Authentification des Agents de maintenances', () => {
    it('returns 200 OK when using valid input and credentials', (done) => {
        request
            .post('/mobile_login/agent')
            .send({
                email: 'agent1@nexcode.dz',
                password: 'resetreset',
            })
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.success).toBe(true);

                done();
            });
    });

    it('returns 400 Bad Request when not sending either an email or password', (done) => {
        request
            .post('/mobile_login/agent')
            .send({
                email: 'in_fatmi@esi.dz',
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);

                expect(res.body.success).toBe(false);
                done();
            });
    });

    it('returns 400 when using wrong credentials', (done) => {
        request
            .post('/mobile_login/locataire')
            .send({
                email: 'agent1@nexcode.dz',
                motdepasse: 'slmcvhmd',
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.success).toBe(false);
                done();
            });
    });
});