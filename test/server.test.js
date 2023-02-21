const app = require('../src/server');
const chai = require("chai");
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { expect } = chai;

describe('GET/tickets', function () {
    it('Should GET all the tickets without query params', (done) => {
        chai.request(app)
            .get('/tickets')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.length(200);
                done();
            });
    });

    it('Should verify that the searchTerm is case insensitive', (done) => {
        chai.request(app)
            .get('/tickets')
            .query({ searchTerm: 'WIX' })
            .end((err1, res1) => {
                chai.request(app)
                    .get('/tickets')
                    .query({ searchTerm: 'wix' })
                    .end((err2, res2) => {
                        expect(res1.body).to.deep.equals(res2.body)
                    });
                done();
            });
    });

    it('Should GET one specific ticket by all params', (done) => {
        chai.request(app)
            .get('/tickets')
            .query({ searchTerm: 'efficient', from: '2018/02/22', to: '2018/03/01' })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array').that.length(1);
                done();
            });
    });

    it('Should return a bad request - searchTerm must not be empty', (done) => {
        chai.request(app)
            .get('/tickets')
            .query({ searchTerm: '' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errors).to.be.an('array').that.length(1);
                expect(res.body.errors[0]).have.property("msg").eql("searchTerm must not be empty");
                done();
            });
    });

    it('Should return a bad request - date must be in a date format', (done) => {
        chai.request(app)
            .get('/tickets')
            .query({ searchTerm: 'wix', from: '2018/2/2' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errors).to.be.an('array').that.length(1);
                expect(res.body.errors[0]).have.property("msg").eql("date must be in a date format");
                done();
            });
    });

    it('Should return a bad request - date must be in a date format', (done) => {
        chai.request(app)
            .get('/tickets')
            .query({ searchTerm: 'wix', to: '2018/2/2' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errors).to.be.an('array').that.length(1);
                expect(res.body.errors[0]).have.property("msg").eql("date must be in a date format");
                done();
            });
    });

    it('Should return a bad request - from date must be before to date', (done) => {
        chai.request(app)
            .get('/tickets')
            .query({ from: '2018/02/10', to: '2018/02/05' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.errors).to.be.an('array').that.length(1);
                expect(res.body.errors[0]).have.property("msg").eql("from date must be before to date");
                done();
            });
    });
});
