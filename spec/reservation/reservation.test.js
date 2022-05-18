let Request = require("supertest");
Request = Request('http://localhost:3000/api/reservations')
;
describe("POST: Create reservation", () => {
    test("Should return 201 ok when car exists and is disponible", (done) => {
        Request
            .post("/create-reservation")
            .send({
                matricule: "11111111",
                locataire: "test@esi.dz",
                departLat: 10,
                departLong: -122,
                destLat: 42,
                destLong: -87
            })
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body.success).toBe(true)
                // let reservation_id = res.body.reservation.reservation_id
                // console.log(reservation_id)
                // Request
                //     .patch("/validate-reservation")
                //     .send({
                //         reservation_id: reservation_id,
                //         locataire_email: "test@esi.dz"
                //     })
                //     .expect(200)
                //     .end((err, res) => {
                //         if (err){
                //             done()
                //         }
                //         expect(res.body.success).toBe(true)
                //         done()
                //     })
                done();
            })
    })

    test("Should return 400 ok when car does not exists or is not disponible", (done) => {
        Request
            .post("/create-reservation")
            .send({
                matricule: "123456789",
                locataire: "locataire1@esi.dz",
                departLat: 10,
                departLong: -122,
                destLat: 42,
                destLong: -87
            })
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body.success).toBe(false)
                done();
            })
    })

})
describe("POST: Validate trajectory", () => {

    test("Should return 200 when a valid reservation exists", (done) => {
        let reservation_id = 30
        Request
            .patch(`/validate-trajet/${reservation_id}`)
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body.success).toBe(true)
                done();
            })
    })

    test("Should return 400 when reservation does not exist", (done) => {
        let reservation_id = 100
        Request
            .patch(`/validate-trajet/${reservation_id}`)
            .expect(400)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body.success).toBe(false)
                done();
            })
    })
})