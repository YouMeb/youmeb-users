#!/bin/sh

cd test/app
npm install
npm link ../../
node ../../node_modules/youmeb-cli/bin/youmeb.js sequelize:migrate
cd ../../

NODE_ENV=$NODE_ENV node ./node_modules/mocha/bin/mocha test/*.test.js -t 10000
