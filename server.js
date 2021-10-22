const express = require('express');
const {graphqlHTTP} = require("express-graphql");
const schema=require('./schema')

// init app
const app=express()


// create server
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: true
}))

const PORT=process.env.PORT || 5000

app.listen(PORT,()=> console.log(`server started in ${PORT}`))