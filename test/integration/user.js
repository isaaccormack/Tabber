const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiString = require('chai-string');
// const {server} = require('../../dist/index');
var dbModule = require("../../dist/database/dbclient");
var appModule = require("../../dist/index");
const expect = chai.expect;

chai.use(chaiHttp).use(chaiString);

console.log("server")
// server().then(s => {
//     console.log(s)

// console.log()
// console.log("done server")

// // need to async await server

// let s
// try {
//     // s = server()
// } catch(err) {
//     console.log(err)
// }

let app

describe('Again, hello world', () => {
    before((done) => {
        // const dbPromise = promisify(dbModule.initDb);
        // await dbPromise();
        // could just use done here to make this async
        dbModule.initDb((err) => {
            if (err) throw err

            app = appModule.startApp()
            done()
        })

    });
    after((done) => {
        app.close()
        done()
    });
    
    it('should not be empty', (done) => {
        chai.request(app)
        .get('/')
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.text).to.containIgnoreSpaces('Hello World!');
            done();
        });
    });
});


