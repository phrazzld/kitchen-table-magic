# Kitchen Table Magic

Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/). [Magic: The Gathering](https://magic.wizards.com) card data supplied by the [Scryfall API](https://scryfall.com/docs/api).

## Setup

Clone **Kitchen Table Magic** into your development environment:

```
git clone git@github.com:phrazzld/kitchen-table-magic.git
```

Hop into the project directory:

```
cd kitchen-table-magic
```

[Get Yarn installed](https://classic.yarnpkg.com/en/docs/install), then use Yarn to install Kitchen Table Magic's dependencies:

```
yarn install
```

[Now get Node installed](https://nodejs.org/en/download/). Node will be used to run the api server on your own machine.

[You'll also need MongoDB](https://www.mongodb.com/download-center/community?jmp=docs). Once MongoDB is done installing, start up a local database daemon:

```
mongod
```

Then, startup a local api server:

```
yarn serve
```

Finally, start the app locally:

```
yarn start
```

Now you should be able to visit Kitchen Table Magic running locally on your machine at "localhost:3000" in your browser!

## License

[MIT](https://opensource.org/licenses/MIT)
