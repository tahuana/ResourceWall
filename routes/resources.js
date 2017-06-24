"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.post("/", (req, res) => {
    const newResource = {
      // id: , //needs to be randomly generated
      user_id: req.session.user.id,
      'URL': req.body.URL,
      title: req.body.title,
      description: req.body.description
    }

    const addResource = (data) => {
      knex('resources')
        .insert(data)
        .returning('id')
        .then( (results) => {

          res.status(200).send(results);
        })
        .catch( (err) => {
          throw err;
        })
    }
    addResource(newResource);
  });


  router.get("/", (req, res) => {

    knex('resources')
      //query to return an array of all resources
      .join('users', 'users.id', '=', 'resources.user_id')
      .select('resources.id AS resource_id', 'resources.URL', 'resources.title', 'resources.description',
        'user_id', 'users.user_name', 'users.avatar_URL')
      //loop through array of resources and add the a ratings property to each, containing an array of all ratings
      .then( (results) => {
        let promises = [];
        for (let resource of results) {
          //push each query (which returns a promise) to the empty promise array
          promises.push(knex('ratings')
            .select()
            .where('resource_id', resource.resource_id)
            .then((ratings) => {
              resource['ratings'] = ratings;
              //value to be added to promise array
              return resource;
            }));
        }
        //when all promises are complete, return promises array
        return Promise.all(promises);
      })
      .then((results) => {
        let promises = [];
        for (let resource of results) {
          promises.push(knex('likes')
            .select()
            .where('resource_id', resource.resource_id)
            .then((likes) => {
              //console.log(results);
              resource['likes'] = likes;
              return resource;
            }));
        }
        return Promise.all(promises);
      })
      .then((results) => {
        res.status(200).send(results);
      })
      .catch( (err) => {
        throw err;
      })

  });

  return router;
}
