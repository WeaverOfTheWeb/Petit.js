let assert  = require("chai").assert;
let FileReader = require('filereader').FileReader;
let Petit = require("../petit");

describe("set the cofiguration", () => {

    it("should return an instance of petit", () => {
        let image = new Petit({});
        assert.ok(image instanceof Petit);
    });

});