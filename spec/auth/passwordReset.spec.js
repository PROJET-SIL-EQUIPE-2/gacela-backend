var Request = require("supertest");
Request = Request('http://localhost:3000/api/mobile_passwordReset');


// TEST FORGOT PASSWORD
  describe('POST : Forgot password des locataire', () => {
    it('returns 200 OK when using valid email and the password reset link sent to locataire email account', (done) => {
        Request
            .post('/locataire')
            .send({
                email: 'dou@esi.dz',
            })
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message === 'password reset link sent to your email account').toBe(true);

                done();
            });
    });

 
    it('returns 400 Bad Request when user with given email doesnt exist', (done) => {
        Request
            .post('/locataire')
            .send({
                email: 'id_bouloudene@esi.dz',
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);

                expect(res.body.message === "user with given email doesn't exist").toBe(true);
                done();
            });
    });

    it('returns 400 Bad Request when using invalid email', (done) => {
        Request
            .post('/locataire')
            .send({
                email: 'id_bouloudeneesi.dz',
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);

                expect(res.body.success == false).toBe(true);
                done();
            });
    });
});   

// TEST FOR RESET PASSWORD 

/*  describe('PATCH : Reset password des locataire', () => {
    it('returns 200 OK when token still valid and password is updated', (done) => {
        Request
            .patch('/locataire/1/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9sb2NhdGFpcmUiOjEsImlhdCI6MTY0ODA3NjA3NX0.KkBm3kuy69Oo5gfDck2SU7xFQ7DwPSzt_Ftp4SIkqmg')
            .send({
                password: 'resetreset',
            })
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body.message === "password reset sucessfully.").toBe(true);

                done();
            });
    });


    it('returns 400 Bad Request when using invalid password', (done) => {
        Request
        .patch('/locataire/1/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9sb2NhdGFpcmUiOjEsImlhdCI6MTY0ODA3NjA3NX0.KkBm3kuy69Oo5gfDck2SU7xFQ7DwPSzt_Ftp4SIkqmg')
        .send({
                password: 'reset',
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);

                expect(res.body.success == false).toBe(true);
                done();
            });
    });

    // the link is invalid or expired
    it('returns 400 Bad Request when Locataire doesnt exist', (done) => {
        Request
        .patch('/locataire/17/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9sb2NhdGFpcmUiOjEsImlhdCI6MTY0ODA3NjA3NX0.KkBm3kuy69Oo5gfDck2SU7xFQ7DwPSzt_Ftp4SIkqmg')
        .send({
                password: 'resetreset',
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);

                expect(res.body.success == false).toBe(true);
                done();
            });
    });
    // the token doesnt exist
    it('returns 400 Bad Request when the link is invalid', (done) => {
        Request
        .patch('/locataire/1/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9sb2NhdGFpcmUiOjEsImlhdCI6MTY0ODA3NjA3NX0.KkBm3kuy69Oo5gfDck2SU7xFQ7DwPSzt_Ftp4SIkqm')
        .send({
                password: 'resetreset',
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);

                expect(res.body.success == false).toBe(true);
                done();
            });
    });

    // il depasse 2h
     it('returns 400 Bad Request when the link is expired', (done) => {
        Request
        .patch('/locataire/1/yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9sb2NhdGFpcmUiOjEsImlhdCI6MTY0NzgxMTI3MH0.BXm5rw_evu9avzv1oPX40TUG03DJoVrb7_881jW_ncM')
        .send({
                password: 'resetreset',
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) done(err);

                expect(res.body.success == false).toBe(true);
                done();
            });
    }); 
});  */