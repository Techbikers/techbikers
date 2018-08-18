Techbikers Website Backend
==========================

This is the backend for the Techbikers.com website. 

For the frontend, go to https://github.com/Techbikers/client

The aim is to build this into more 
of a platform that allows Techbikers to scale as a charitable organisation
and for Chapters (different branches of Techbikers) around the world to
organise their own rides.

The main components to the site at the moment (and the priorities) are:

* Front facing site. The primary audience are potential donors to riders.
* Rider registration and payment of fee.


Installation
------------

Ensure you have installed:

* Python (2.7.X) 
* pip
* MySQL

Check out and go to the repo.

Run [./bootstrap.sh](./bootstrap.sh)

This will perform all the tasks neccesary to get you up and running:

* Install python dependencies
* Set up the database (create tables and insert dummy data)
* Create a Django Admin account (this will prompt you to provide a username, email and password)

Hopefully it will all work! You might need to run the above with sudo.

Running the server
------------------

Run the following command from the project root:

* `npm run start-server` 

The server will start running on port 8000. You can access it at http://localhost:8000

To edit data using Django Admin, go to http://localhost:8000/admin/ and log in using the credentials you provided while boostrapping the DB. 

Documentation
-------------

### API

The API documentation is defined using [Swagger](https://swagger.io/docs/specification/about/), at [./docs/swagger.json](./docs/swagger.json).

You can view the docs and test the API at 
* https://techbikers.restlet.io/ or
* https://techbikers.api-docs.io/

### Database scheme

The database ERD is available as:
- An image: [./docs/db/techbikers.schema.png](./docs/db/techbikers.schema.png)
- A http://draw.io diagram: [./docs/db/techbikers.schema.xml](./docs/db/techbikers.schema.xml)

Running tests
-------------

You can test the API by running:
* `npm run test-live-api` (against the live site ) or 
* `npm run test-local-api` (against your local instance)

Make sure the server is running before running the latter.

*NOTE:* For now, only the tests which don't require authentication pass. The POSTs/PUTs which do require authentication, are waiting for a change in Auth0 config. 

Contributing
------------

Want to contribute? Great! Get in touch tech@techbikers.com

1. Fork it.
2. Create a branch (`git checkout -b my_branch`)
3. Commit your changes (`git commit -am "Added something cool!"`)
4. Push to the branch (`git push origin my_branch`)
5. Open a [Pull Request](https://github.com/Techbikers/techbikers/compare/)
6. Go for a ride on your bike and wait.
