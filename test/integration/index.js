const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiString = require('chai-string');
const {server} = require('../../dist/index');
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

// let s

// describe('Hello world', () => {
//     before((done) => {
//         server().then(ser => {
//             s = ser
//             done()
//         })
//     });
    
//     it('should say "Hello World!"', (done) => {
//         chai.request(s)
//         .get('/')
//         .end((err, res) => {
//             expect(res).to.have.status(200);
//             expect(res.text).to.containIgnoreSpaces('Hello World!');
//             done();
//         });
//     });
// });


