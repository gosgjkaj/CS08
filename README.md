# School of Chemistry Database


##Setting up the project

1. Install and run a redis server:
    1. `sudo apt-get install redis-server`
    2. `redis-server --daemonize yes`
2. `cd myApp`
3. Run sapper:
    1. `cd sapper`
    2. Install npm dependencies: `npm install`
    3. Run: `npm run dev`
    4. Verify it's running by going to `http://localhost:3000`
4. Start the Prisma server
    1. Install prisma: `npm install -g prisma`
    2. Make sure docker is set up (follow the [instructions on their website](https://www.docker.com/products/docker-desktop))
    3. `cd db`
    4. Install npm dependencies: `npm install`
    5. Start docker: `docker-compose up -d`
        1. If working with `Docker Desktop` on Windows 10 PRO use `endpoint: http://localhost:4466` in prisma.yml. If  using Toolbox or prisma doesn't connect use `endpoint: http://192.168.99.100:4466`
    6. Deploy and generate prisma: `prisma deploy; prisma generate`
    7. Install database dependencies: `npm install`
    7. Start the GraphQL server: `node index.js`
    8. Verify prisma is running by going to `http://localhost:4000` (you should see a GraphQL playground)
        1. You can now also go to `http://localhost:4466` to access the internal prisma GraphQL playground
        2. You can access the prisma admin panel at `http://localhost:4466/_admin`



## Running the test

This is the guideline to run the test on Cypress
More information please check:
https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements



1. Install cypress:
    1. `cd <projet>/app/sapper `
    2. `npm install cypress –save-dev`

2. Open Cypress:
    `./node_modules/.bin/cypress open`
    Then cypress is open

    If you cannot open it, try a direct download:
    https://download.cypress.io/desktop
    unzip the file to local pc
    and double click the Cypress application to run

3. Run the test:
    Before running the test, please run the project in the background
    1. Click on the test.
    2. Google Chrome Browser will jump out and do the test automatically
    3. Names of test cases show on the left of the browser.

4. Read error messages:
	After running all tests cases, check the fail test by clicking it on the left, the screen shot of this test will show on the right. 
