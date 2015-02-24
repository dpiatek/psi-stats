# PageSpeed Insight Stats

Track your url's [PageSpeed Insight](https://developers.google.com/speed/pagespeed/insights/) results, see your score and set performance budgets.

## Setup

You will need [node.js](http://nodejs.org/) & [mongoDB](http://www.mongodb.org/).

Set the url to be tracked and the [mongoDB uri](http://mongoosejs.com/docs/connections.html) as [enviroment variables](#config):

```
export PSI_STATS_URL=http://yoursite.com
export PSI_MONGO=mongodb://<dbuser>:<dbpassword>@ds051980.mongolab.com:51980/heroku_app34181227
```

You can then install & start the app:

```
npm install && npm start
```

## Usage

To populate the database with data, you just need to GET the `/update` path of your app. You can test this in the browser.

There is a simple script in `bin` that does exactly this, periodically:

```
node ./bin/update http://yoursite.com
```

It uses [node-cron](https://github.com/ncb000gt/node-cron) and bydefault gets the url twice an hour. You can pass the cron time directly to it:

```
node ./bin/udpate http://yoursite.com --cron-time "* * 6 * * *"
```

## Config

- PSI_STATS_URL (required) - set this to the url you want to track
- PSI_MONGO (required) - the uri for the [mongo database](http://mongoosejs.com/docs/connections.html)
- PSI_STATS_KEY - pass your API key to [psi](https://github.com/addyosmani/psi/)
- PSI_STATS_LOCALE - set locale for psi
- PSI_STATS_STRATEGY - set strategy for psi (it defaults to mobile)

## Development

The front-end uses [browserify](http://browserify.org/) to compile and minify files. Install the dependencies:

```
npm i --development
```

Then use either `npm run-script bundle` to recompile `bundle.js` or `npm run-script bundle-develop` to setup a watch and generate sourcemaps.


## Current limitations

- psi does not follow redirects
- data is shown by url, so if you change the strategy option for psi middleway, this will be bundlded
- only byte sizes and number of resources data is shown
