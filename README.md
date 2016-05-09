# NextChest

My repository for Riot Games API Challenge 2016

Title: NextChest
Created by: Kiritoc

Working App: <http://nextchest-kirdox.rhcloud.com/>

> NextChest is a website designed by a summoner for summoners.<br>
> It aims to provide a simple to way to look at the next available chests for a specific summoner.

> This app was created in order to help chest hunters meanwhile training my development skills.<br>
> The app is using a cache (Redis) in order to decrease response times as well as the total number of requests made.
Furthermore a queuing system was implemented to be sure to not exceed the rate limit of the Riot API.

## Project structure ##
### API ###
All part related to the Riot API and https requests are inside the *api* folder.<br>
The *lol.js* file is the main file which reads available operations then build a LolClient object. This object can be used to send get requests to the Riot API.

### Core ###
The *core* folder contains two files:
* *cache.js* file : Configure then use the redis cache file
* *server.js* file: Configure the basis of the server (The most interesting part is in the *app.js* file)

### Lib ###
The *lib* folder contains some utils methods, do not be bored !

### i18n ###
As NextChest is translated in two languages (EN/FR). The *locales* folder contains the i18n files.

### Routes ###
The *routes* folder contains all available routes on NextChest which are a lot ! (One form page and one result page ^^)<br>
The most attractive part should be the *stats.js* file.

### Views ###
The only thing a "simple" user wants to see is a result. That's why you will find a lot of projects with some folder like this one.
It contains the pages which the user will see results appear. As NextChest is using Jade (a template engine), you will found *jade* files instead of *html* files.

### The app ###
The *app.js* is the heart of NextChest. Its launching by the *core/server.js* and it runs all the parts together.

## Thanks to ##

Thanks to the following 3rd party projects that were used for NextChest.
* [node.js](https://nodejs.org/)
* [express](http://expressjs.com/)
* [async](https://github.com/caolan/async)
* [glob](https://github.com/isaacs/node-glob)
* [i18n](https://github.com/mashpie/i18n-node)
* [cache-manager](https://github.com/BryanDonovan/node-cache-manager)
* [cache-manager-redis](https://github.com/dial-once/node-cache-manager-redis)
* [cookie-parser](https://github.com/expressjs/cookie-parser)
* [include](https://github.com/anthonynichols/node-include)
* [jade](http://jade-lang.com/)
* [less-middleware](https://github.com/emberfeather/less.js-middleware)
* [serve-favicon](https://github.com/expressjs/serve-favicon)
* [underscore](http://underscorejs.org/)
* [intellij](https://www.jetbrains.com/idea/)
* [openshift](https://www.openshift.com/)

And big thanks to [StackOverflow](http://stackoverflow.com/) and [RiotGames contest](https://developer.riotgames.com/) !
