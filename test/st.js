"use strict";
var assert = require('assert'),
    sinon = require('sinon'),
    chai = require('chai'),
    sinonChai = require('sinon-chai'),
    expect = chai.expect,
    should = chai.should();
chai.use(sinonChai);
///////////////////////////////////////////////////////////

function once(fn) {
    var returnValue, called = false;
    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }
        return returnValue;
    };
}

var testObject = {
    foo: function() {
        return 42;
    }
};

///////////////////////////////////////////////////////////

describe(':: bdd', function () {
    console.log('describe1\n');

    before(function() {
        console.log('before1\n');
    });

    after(function() {
        console.log('after1\n');
    });

    before(function() {
        console.log('before2\n');
    });

    after(function() {
        console.log('after2\n');
    });

    beforeEach(function() {
        console.log('beforeEach1'); //\n
    });

    afterEach(function() {
        console.log('afterEach1\n');
    });

    beforeEach(function() {
        console.log('beforeEach2'); //\n
    });

    afterEach(function() {
        console.log('afterEach2\n');
    });

    it(':: it1', function () {
        console.log('it1\n');
    });

    it(':: it2', function () {
        console.log('it2\n');
    });

    it(':: it3', function () {
        console.log('it3\n');
    });

    describe(':: describe2', function () {

        console.log('   describe2\n');

        before(function() {
            console.log('   2.before1\n');
        });

        after(function() {
            console.log('   2.after1\n');
        });

        beforeEach(function() {
            console.log('   2.beforeEach1'); //\n
        });

        afterEach(function() {
            console.log('   2.afterEach1\n');
        });

        it(':: it1', function () {
            console.log('   2.it1\n');
        });

        it(':: it2', function () {
            console.log('   2.it2\n');
        });

    });
});

///////////////////////////////////////////////////////////

describe(':: spies', function() {

    it(":: calls the original function", function () {
        var callback = sinon.spy();
        var proxy = once(callback);

        proxy();

        assert(callback.called);
        // equivalent
        sinon.assert.called(callback);
        expect(callback).to.be.called;
        callback.should.have.been.called;
    });

    it(":: calls original function with right this and args", function () {
        var callback = sinon.spy();
        var proxy = once(callback);
        var obj = {};

        proxy.call(obj, 1, 2, 3);

        assert(callback.calledOn(obj));
        assert(callback.calledWith(1, 2, 3));

        //equivalent
        expect(callback).to.have.been.calledOn(obj);
        callback.should.have.been.calledWith(1, 2, 3);
    });

    it(':: spy on existing function', function () {
        function foo() { return 42; }

        var spy = sinon.spy(foo);

        assert.equal(spy(), 42);
        assert(spy.called);
        assert(spy.returned(42));

        //equivalent
        expect(spy()).to.equal(42);
        spy().should.equal(42);
        expect(spy).to.be.called;
        spy.should.have.been.called;
        expect(spy).to.have.returned(42);
        spy.should.have.returned(42);

        // matchers
        assert(spy.returned(sinon.match.number));

        //equivalent
        expect(spy()).to.be.a('number');
        spy().should.be.a('number');
    });

    it(':: spy on existing failed function', function () {
        function foo() { throw new Error(); }

        var spy = sinon.spy(foo);
        try {
            spy();
        }catch(e){}

        assert(spy.threw());
        //equivalent
        expect(spy).threw;
        spy.should.have.thrown;
    });

    it(':: spy on existing method', function () {
        var spy = sinon.spy(testObject, 'foo');

        assert.equal(testObject.foo(), 42);
        assert(testObject.foo.called);

        testObject.foo.restore();
    });
});

///////////////////////////////////////////////////////////

describe(':: stubs', function () {

    it(":: returns the return value from the original function", function () {
        var callback = sinon.stub().returns(42);
        var proxy = once(callback);

        assert.equal(proxy(), 42);
    });

    it(':: stub existing method', function () {
        var stub = sinon.stub(testObject, "foo").returns(43);

        assert.equal(testObject.foo(), 43);

        assert(testObject.foo.called);

        testObject.foo.restore();
    });

    it(':: stub existing method fully', function () {
        var stub = sinon.stub(testObject, "foo", function(){ return 45; });

        assert.equal(testObject.foo(), 45);

        assert(testObject.foo.called);

        testObject.foo.restore();
    });

});

///////////////////////////////////////////////////////////

describe(':: mocks (expectations)', function () {

    it(":: returns the return value from the original function", function () {
        var myAPI = { method: function () {} };
        var mock = sinon.mock(myAPI);
        mock.expects("method").once().returns(42);

        var proxy = once(myAPI.method);

        assert.equal(proxy(), 42);
        mock.verify();
    });

});

///////////////////////////////////////////////////////////

describe(':: sandbox', function () {

    describe(':: without sandbox', function () {

        afterEach(function() {
            testObject.foo.restore();
        });

        it(':: stub existing method', function () {
            sinon.stub(testObject, "foo").returns(42);
            assert.equal(testObject.foo(), 42);
        });

        it(':: stub existing method', function () {
            sinon.stub(testObject, "foo").returns(43);
            assert.equal(testObject.foo(), 43);
        });
    });

    describe(':: with sandbox', function () {

        var sandbox;
        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
        });

        it(':: stub existing method', function () {
            sandbox.stub(testObject, "foo").returns(43);
            assert.equal(testObject.foo(), 43);
        });

        it(':: stub existing method', function () {
            sandbox.stub(testObject, "foo").returns(43);
            assert.equal(testObject.foo(), 43);
        });
    });

});

///////////////////////////////////////////////////////////