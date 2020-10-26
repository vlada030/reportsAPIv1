const {expect} = require('chai');
const sinon = require('sinon');
const errorHandler = require('../middleware/errorHandler');

describe('Check error handler middleware fn for different types of errors', function() {
    it('check if a CAST ERROR occurs', function() {

        let err = {name: 'CastError'};
        let res = {
            statusCode: 500,
            success: false,
            error: 'Server error',
            status: function(code) {
                this.statusCode = code;
                return this;
            },

            json: function(data) {
                this.success = data.success;
                this.error = data.error;
            }
        };

        errorHandler(err, {}, res, () => {});
        expect(res).to.have.property('statusCode', 404);
        expect(res.success).to.be.false;
        expect(res.error).to.have.string('Resource not found with id of');

    })

    it('check for DUPLICATE VALUES entered', function() {

        let err = {code: 11000};
        let res = {
            statusCode: 500,
            success: false,
            error: 'Server error',
            status: function(code) {
                this.statusCode = code;
                return this;
            },

            json: function(data) {
                this.success = data.success;
                this.error = data.error;
            }
        };

        errorHandler(err, {}, res, () => {});
        expect(res).to.have.property('statusCode', 400);
        expect(res.success).to.be.false;
        expect(res.error).to.have.string('Duplicate field value entered.');

    })

    it('check for VALIDATION errors', function() {

        let err = {name: 'ValidationError'};
        let res = {
            statusCode: 500,
            success: false,
            error: 'Server error',
            status: function(code) {
                this.statusCode = code;
                return this;
            },

            json: function(data) {
                this.success = data.success;
                this.error = data.error;
            }
        };

        sinon.stub(Object, 'values');
        Object.values.returns([{message: 'Greska'}]);

        errorHandler(err, {}, res, () => {});
        expect(res).to.have.property('statusCode', 400);
        expect(res.success).to.be.false;
        expect(res.error).to.have.string('Greska');
        Object.values.restore();

    })

    it('check for LIMIT FILE SIZE of input avatar image', function() {

        let err = {code: 'LIMIT_FILE_SIZE'};
        let res = {
            statusCode: 500,
            success: false,
            error: 'Server error',
            status: function(code) {
                this.statusCode = code;
                return this;
            },

            json: function(data) {
                this.success = data.success;
                this.error = data.error;
            }
        };

        errorHandler(err, {}, res, () => {});
        expect(res).to.have.property('statusCode', 400);
        expect(res.success).to.be.false;
        expect(res.error).to.have.string('Maksimalna veličina avatar slike je');

    })

})