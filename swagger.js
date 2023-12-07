const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition : {
        openapi:'3.0.0',
        info:{
            title:"Bitmoney API",
            version:'0.2.0'
        }
    },
    apis:['./index.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;