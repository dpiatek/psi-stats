# psi-stats

An app to track your url's [PageSpeed Insight](https://developers.google.com/speed/pagespeed/insights/) results, see your score and set performance budgets.

Demo: [http://psi-stats-example.herokuapp.com/](http://psi-stats-example.herokuapp.com/)

**Note:**
This is still very much in an experimental stage. I'm trying to make the app easily deployable and reusuable as well presentening the data in a useful and insightful way, with the right balance of good defaults and configuration.

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

## Results range

Params can be passed in the url to tweak the range and limit of results:

```
your-psi-stats-server.com?limit=20&daysAgo=5
```

Would return only the first 20 results from the last five days (ascending).

## Development

The front-end uses [browserify](http://browserify.org/) to compile and minify files. Install the dependencies:

```
npm i --development
```

Then use either `npm run-script bundle` to recompile `bundle.js` or `npm run-script bundle-develop` to setup a watch and generate sourcemaps.


## Known issues

- psi does not follow redirects
- data is shown by url, so if you change the strategy option for psi haflway, this will not be reflected in any way in the UI
- only byte sizes and number of resources data is shown - other stuff contributing to the score it not
- the UI only shows pretty charts right now, but it would be nice if it would encourage insight better (show thresholds for example)
