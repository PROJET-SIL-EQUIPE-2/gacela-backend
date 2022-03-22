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
                expect(res.body.accountType == "Locataire").toBe(true);

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

                expect(res.body.errors.length > 0).toBe(true);
                done();
            });
    });

    it('returns 401 Unauthorized when using wrong credentials', (done) => {
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

                expect(res.body.errors.length > 0).toBe(true);
                done();
            });
    });
});