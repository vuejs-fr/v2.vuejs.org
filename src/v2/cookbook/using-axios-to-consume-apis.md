---
title: Utiliser Axios pour consommer des API
type: cookbook
order: 9
---

## Base Example

<p>Cette page est en cours de traduction. Pour nous aider, vous pouvez participer sur <a href="https://github.com/vuejs-fr/vuejs.org" target="_blank">le dépôt GitHub dédié de Vuejs-FR</a>.</p><p>Lors de la création d'une application Web, il est fréquent que vous souhaitiez utiliser et afficher les données provenant d'une API. Il existe plusieurs manières de le faire, mais une approche très populaire consiste à utiliser [axios](https://github.com/axios/axios), un client HTTP basé sur les Promesses.</p>

Dans cet exercice, nous allons utiliser l'[API CoinDesk](https://www.coindesk.com/api/) pour afficher les prix en Bitcoins qui sont mis à jour toutes les minutes. Premièrement, nous devons installer axios avec npm/yarn ou à partir d'un lien CDN.

Il existe plusieures manières de demander des informations à une API, mais il est préférable de d'abord savoir à quoi ressemble la structure des données qu'elle renvoit afin de savoir ce qu'elle va afficher. Pour ce faire, nous allons appeler le point de terminaison de l'API et afficher le résultat afin que nous puissions voir sa structure et son contenu. Nous pouvons voir dans la documentation de l'API de CoinDesk que l'appel doit être effectué à l'adresse `https://api.coindesk.com/v1/bpi/currentprice.json`. Nous allons donc commencer par créer une propriété de données qui hébergera nos informations, puis nous récupérerons les données et les attribuerons à l'aide du point de cycle de vie `mounted`:

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.info = response))
  }
})
```

```html
<div id="app">
  {{ info }}
</div>
```

Et nous obtenons ceci :

<p data-height="350" data-theme-id="32763" data-slug-hash="80043dfdb7b90f138f5585ade1a5286f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Premiere Étape Axios et Vue" class="codepen">Voir l'exemple <a href="https://codepen.io/team/Vue/pen/80043dfdb7b90f138f5585ade1a5286f/">Premiere Étape Axios et Vue</a> par Vue (<a href="https://codepen.io/Vue">@Vue</a>) sur <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Parfait ! Nous avons des données. Mais cela semble assez désordonné pour le moment, alors affichons-les correctement et ajoutons un traitement d'erreur si les choses ne fonctionnent pas comme prévu ou s'il faut plus de temps que prévu pour obtenir les informations.

## Exemple concret: utilisation des données

### Affichage des données d'une API

Il est assez courant que les informations dont nous avons besoin se trouvent dans la réponse. Nous devrons parcourir ce que nous venons de stocker pour y accéder correctement. Dans notre cas, nous pouvons voir que les informations de prix dont nous avons besoin sont stockées dans `response.data.bpi`. Si nous l'utilisons, notre sortie sera :

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
```

<p data-height="200" data-theme-id="32763" data-slug-hash="6100b10f1b4ac2961208643560ba7d11" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Deuxième Étape Axios et Vue" class="codepen">Voir l'exemple <a href="https://codepen.io/team/Vue/pen/6100b10f1b4ac2961208643560ba7d11/">Premiere Étape Axios et Vue</a> par Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

C’est beaucoup plus facile à afficher; nous pouvons donc mettre à jour notre code HTML pour n’afficher que les informations dont nous avons besoin à partir des données reçues, et nous allons créer un [filtre](../api/#Vue-filter) pour vous assurer que la décimale se trouve également à la place appropriée.

```html
<div id="app">
  <h1>Prix Bitcoin Index</h1>
  <div
    v-for="currency in info"
    class="currency"
  >
    {{ currency.description }}:
    <span class="lighten">
      <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
    </span>
  </div>
</div>
```

```js
filters: {
  currencydecimal (value) {
    return value.toFixed(2)
  }
},
```

<p data-height="300" data-theme-id="32763" data-slug-hash="9d59319c09eaccfaf35d9e9f11990f0f" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Troisieme Étape Axios et Vue" class="codepen">Voir l'exemple <a href="https://codepen.io/team/Vue/pen/9d59319c09eaccfaf35d9e9f11990f0f/">Troisieme Étape Axios et Vue</a> par Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Travailler avec les erreurs

Certaines fois, nous pouvons ne pas recevoir de données de l'API. Il peut y avoir de nombreuses raisons qu'un appel puisse échoué. Par exemple :  

* L'API est hors-service.
* Le requête a mal été réalisée.
* L'API ne nous donne pas les informations dans un format attendu.

Quand nous créons cette requête, nous devrions vérifier pour de telles circonstances et nous informer dans tous les cas pour savoir comment gérerce problème. Dans un appelle aios, nous allons le faire en utilisant `catch`.

```js
axios
  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  .then(response => (this.info = response.data.bpi))
  .catch(error => console.log(error))
```

This will let us know if something failed during the API request, but what if the data is mangled or the API is down? Right now the user will just see nothing. We might want to build a loader for this case, and then tell the user if we're not able to get the data at all.

```js
new Vue({
  el: '#app',
  data () {
    return {
      info: null,
      loading: true,
      errored: false
    }
  },
  filters: {
    currencydecimal (value) {
      return value.toFixed(2)
    }
  },
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => {
        this.info = response.data.bpi
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  }
})
```

```html
<div id="app">
  <h1>Bitcoin Price Index</h1>

  <section v-if="errored">
    <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
  </section>

  <section v-else>
    <div v-if="loading">Loading...</div>

    <div
      v-else
      v-for="currency in info"
      class="currency"
    >
      {{ currency.description }}:
      <span class="lighten">
        <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
      </span>
    </div>

  </section>
</div>
```

You can hit the rerun button on this pen to see the loading status briefly while we gather data from the API:

<p data-height="300" data-theme-id="32763" data-slug-hash="6c01922c9af3883890fd7393e8147ec4" data-default-tab="result" data-user="Vue" data-embed-version="2" data-pen-title="Fourth Step Axios and Vue" class="codepen">See the Pen <a href="https://codepen.io/team/Vue/pen/6c01922c9af3883890fd7393e8147ec4/">Fourth Step Axios and Vue</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

This can be even further improved with the use of components for different sections and more distinct error reporting, depending on the API you're using and the complexity of your application.

## Alternative Patterns

### Fetch API

The [Fetch API](https://developers.google.com/web/updates/2015/03/introduction-to-fetch) is a powerful native API for these types of requests. You may have heard that one of the benefits of the Fetch API is that you don't need to load an external resource in order to use it, which is true! Except... that it's not fully supported yet, so you will still need to use a polyfill. There are also some gotchas when working with this API, which is why many prefer to use axios for now. This may very well change in the future though.

If you're interested in using the Fetch API, there are some [very good articles](https://scotch.io/@bedakb/lets-build-type-ahead-component-with-vuejs-2-and-fetch-api) explaining how to do so.

## Wrapping Up

There are many ways to work with Vue and axios beyond consuming and displaying an API. You can also communicate with Serverless Functions, post/edit/delete from an API where you have write access, and many other benefits. Due to the straightforward integration of these two libraries, it's become a very common choice for developers who need to integrate HTTP clients into their workflow.
