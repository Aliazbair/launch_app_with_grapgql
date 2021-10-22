const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");

// launch Type
const launchType = new GraphQLObjectType({
  name: "launch",
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    is_tentative: { type: GraphQLBoolean },
    rocket: { type: RocketType },
  }),
});

// create rocket type
const RocketType = new GraphQLObjectType({
  name: "Rocket",
  fields: () => ({
    rocket_id: { type: GraphQLInt },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString },
  }),
});

// create Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    launches: {
      type: new GraphQLList(launchType),
      resolve(parent, args) {
        return axios
          .get("https://api.spacexdata.com/v3/launches")
          .then((res) => res.data);
      },
    },
    launch: {
      type: launchType,
      args: {
        flight_number: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return axios
          .get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
          .then((res) => res.data);
      },
    },

    // rocket query
    Rockets: {
      type: new GraphQLList(RocketType),
     async resolve(parent,args){
          const {data}=await axios.get("https://api.spacexdata.com/v3/rockets")
        //   const data=rocket.data
          return data
      }
    },
    Rocket:{
       type:RocketType,
       args:{
           id:{type:GraphQLInt}
       } ,
      async resolve(parent, args){
                 const { data } = await axios.get(
                   `https://api.spacexdata.com/v3/rockets/${args.id}`
                 );
                 //   const data=rocket.data
                 return data;
       }
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
