---
title: Gérer les cas limites
type: guide
order: 106
---

> Cette page présume que vous connaissez déjà les bases sur les [Composants](components.html). Lisez cette section en premier si vous découvrez les composants.

<p class="tip">Toutes les fonctionnalités sur cette page documentent la gestion de cas limites, c'est-à-dire des situations peu ordinaires qui requièrent parfois de contourner légèrement les règles de Vue. Notez cependant qu'elles ont toutes des inconvénients ou des situations où elles peuvent s'avérer dangereuses. Celles-si sont décrites dans chaque cas, donc gardez-les en tête quand vous décidez d'utiliser chaque fonctionnalité.</p>

## Élément et accès au composant

Dans la plupart des cas, il vaut mieux éviter d'accéder à d'autres instances de composant ou de manipuler manuellement des éléments du DOM. Cependant, il y a des cas où cela peut être approprié.

### Accéder à l'instance racine

Dans chaque sous-composant d'une nouvelle instance de Vue (`new Vue`), on peut accéder à cette instance racine via la propriété `$root`. Par exemple, dans cette instance racine :

```js
// l'instance Vue racine
new Vue({
  data: {
    foo: 1
  },
  computed: {
    bar: function () { /* ... */ }
  },
  methods: {
    baz: function () { /* ... */ }
  }
})
```

Tous les sous-composants pourront accéder à cette instance et l'utiliser comme un espace de stockage global :

```js
// Récupérer une donnée de la racine
this.$root.foo

// Affecter une donnée de la racine
this.$root.foo = 2

// Accéder aux propriétés calculées de la racine
this.$root.bar

// Appeler des méthodes de la racine
this.$root.baz()
```

<p class="tip">Cela peut être pratique pour des démos ou des applications très petites avec une poignée de composants. Cependant, ce pattern se prête mal aux applications de moyenne à grande échelle, c'est pourquoi nous recommandons fortement d'utiliser <a href="https://github.com/vuejs/vuex">Vuex</a> pour gérer l'état dans la plupart des cas.</p>

### Accéder à l'instance de composant parente

Comme `$root`, la propriété `$parent` peut être utilisée pour accéder à l'instance parente à partir d'un enfant. Il peut être tentant de l'utiliser par fainéantise plutôt que de passer les données via une prop.

<p class="tip">Dans la plupart des cas, accéder au parent rend votre application plus difficile à déboguer et à comprendre, surtout si vous mutez des données dans le parent. En regardant ce composant plus tard, il sera très difficile de découvrir d'où vient cette mutation.</p>

Il y a des cas cependant où cela _pourrait_ être approprié, notamment dans des bibliothèques de composants liés entre eux. Par exemple, dans des composants abstraits qui interagissent avec des APIs JavaScript plutôt que de produire du HTML, tels que ces composants Google Maps :

```html
<google-map>
  <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
</google-map>
```

Le composant `<google-map>` peut définir une propriété `map` à laquelle tous les sous-composants ont besoin d'accéder. Dans ce cas, `<google-map-markers>` peut vouloir accéder à cette carte avec quelque-chose comme `this.$parent.getMap`, afin d'ajouter des marqueurs dessus. Vous pouvez voir ce pattern [en démonstration ici](https://jsfiddle.net/chrisvfritz/ttzutdxh/).

Gardez en tête, toutefois, que les composants conçus avec ce pattern sont toujours intrinsèquement fragiles. Par exemple, imaginons que nous ajoutons un nouveau composant `<google-map-region>` et que lorsque `<google-map-markers>` apparaît à l'intérieur, il affiche uniquement les marqueurs de cette région :

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

Alors, à l'intérieur de `<google-map-markers>`, vous pourriez vous retrouver à devoir recourir à des bricolages comme ceci:

```js
var map = this.$parent.map || this.$parent.$parent.map
```

Cela a rapidement dérapé. C'est pourquoi nous recommandons plutôt d'utiliser l'[injection de dépendances](#Dependency-Injection) pour fournir des informations contextuelles à des composants enfants à un niveau de profondeur arbitraire.

### Accéder à des instances de composants enfants et des éléments enfants

Malgré l'existence des props et des événements, parfois vous pouvez toujours avoir besoin d'accéder directement à un composant enfant en JavaScript. Pour y parvenir, vous pouvez assigner un ID référence au composant enfant en utilisant l'attribut `ref`. Par exemple :

```html
<base-input ref="usernameInput"></base-input>
```

Ensuite, dans le composant où vous avez défini cette `ref`, vous pouvez utiliser :

```js
this.$refs.usernameInput
```

pour accéder à l'instance `<base-input>`. Cela peut être utile si vous voulez, par exemple, donner programmatiquement le focus à ce champ depuis le parent. Dans ce cas, le composant `<base-input>` peut de la même façon utiliser une `ref` pour fournir l'accès à des éléments spécifiques à l'intérieur, tels que :

```html
<input ref="input">
```

Et même définir des méthodes à utiliser par le parent :

```js
methods: {
  // utilisé pour mettre le focus sur ce champ à partir du parent
  focus: function () {
    this.$refs.input.focus()
  }
}
```

Et ainsi permettre au composant parent de mettre le focus sur le champ à l'intérieur de `<base-input>` avec :

```js
this.$refs.usernameInput.focus()
```

Quand `ref` est utilisé conjointement avec `v-for`, la ref que vous obtenez sera une `Array` contenant les composants enfants reflétant les données source.

<p class="tip">Les références <code>$refs</code> sont renseignées seulement après le rendu initial du composant, et elles ne sont pas réactives. Il s'agit seulement d'une trappe de sortie pour faire de la manipulation directe d'enfants - vous devriez éviter d'accéder aux <code>$refs</code> depuis l'intérieur de templates ou depuis des propriétés calculées.</p>

### Injection de dépendances

Précédemment, quand nous avons décrit l'[accès à l'instance de composant parente](#Accessing-the-Parent-Component-Instance), nous avons montré un exemple comme ceci :

```html
<google-map>
  <google-map-region v-bind:shape="cityBoundaries">
    <google-map-markers v-bind:places="iceCreamShops"></google-map-markers>
  </google-map-region>
</google-map>
```

Dans ce composant, tous les descendants de `<google-map>` avaient besoin d'accéder à une méthode `getMap`, afin de savoir avec quelle carte interagir. Malheusement, utiliser la propriété `$parent` s'adapte mal avec des composants imbriqués plus profondément. C'est là où l'injection de dépendances peut s'avérer utile, en utilisant deux nouvelles options d'instance : `provide` et `inject`.

Les options `provide` nous permettent de spécifier quelles données/méthodes nous voulons **fournir** aux composants descendants. Dans ce cas, il s'agit de la méthode `getMap` à l'intérieur de `<google-map>`:

```js
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

Ensuite, dans n'importe quel descendant, nous pouvons utiliser l'option `inject` pour récupérer des propriétés spécifiques que nous voulons ajouter à cette instance :

```js
inject: ['getMap']
```

Vous pouvez voir l'[exemple complet ici](https://jsfiddle.net/chrisvfritz/tdv8dt3s/). L'avantage par rapport à `$parent` est que nous pouvons accéder à `getMap` dans _n'importe quel_ composant descendant, sans avoir à exposer l'instance entière de `<google-map>`. Cela nous permet de continuer à développer ce composant de façon plus sûre, sans crainte de devoir changer/supprimer quelque-chose sur lequel repose un composant enfant. L'interface entre ces composants reste clairement définie, tout comme avec les `props`.

En fait, vous pouvez vous représenter l'injection de dépendances comme une sorte de « props à longue distance », sauf que :

* les composants ancêtres n'ont pas besoin de connaître quels descendants utilisent les propriétés qu'ils fournissent
* les composants descendants n'ont pas besoin de savoir d'où proviennent les propriétés injectées

<p class="tip">Cependant, il y a des inconvénents à l'injection de dépendances. Cela vient entériner la manière dont les composants sont actuellement organisés dans votre application, rendant plus difficile le remaniement de code. De plus, les propriétés fournies avec `provide` ne sont pas réactives. Cela a été intentionnellement conçu de cette façon, car les utiliser pour créer un espace de stockage global est tout aussi peu évolutif que <a href="#Accessing-the-Root-Instance">d'utiliser <code>$root</code></a> dans le même but. Si les propriétés que vous voulez partager sont spécifiques à votre application et non génériques, ou si jamais vous voulez mettre à jour des données fournies par des ancêtres, alors c'est un signe que vous avez probablement besoin d'une réelle solution de gestion d'état telle que <a href="https://github.com/vuejs/vuex">Vuex</a> à la place.</p>

Apprenez-en plus sur l'injection de dépendances dans [la documentation de l'API](https://vuejs.org/v2/api/#provide-inject).

## Programmatic Event Listeners

So far, you've seen uses of `$emit`, listened to with `v-on`, but Vue instances also offer other methods in its events interface. We can:

- Listen for an event with `$on(eventName, eventHandler)`
- Listen for an event only once with `$once(eventName, eventHandler)`
- Stop listening for an event with `$off(eventName, eventHandler)`

You normally won't have to use these, but they're available for cases when you need to manually listen for events on a component instance. They can also be useful as a code organization tool. For example, you may often see this pattern for integrating a 3rd-party library:

```js
// Attach the datepicker to an input once
// it's mounted to the DOM.
mounted: function () {
  // Pikaday is a 3rd-party datepicker library
  this.picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })
},
// Right before the component is destroyed,
// also destroy the datepicker.
beforeDestroy: function () {
  this.picker.destroy()
}
```

This has two potential issues:

- It requires saving the `picker` to the component instance, when it's possible that only lifecycle hooks need access to it. This isn't terrible, but it could be considered clutter.
- Our setup code is kept separate from our cleanup code, making it more difficult to programmatically clean up anything we set up.

You could resolve both issues with a programmatic listener:

```js
mounted: function () {
  var picker = new Pikaday({
    field: this.$refs.input,
    format: 'YYYY-MM-DD'
  })

  this.$once('hook:beforeDestroy', function () {
    picker.destroy()
  })
}
```

Using this strategy, we could even use Pikaday with several input elements, with each new instance automatically cleaning up after itself:

```js
mounted: function () {
  this.attachDatepicker('startDateInput')
  this.attachDatepicker('endDateInput')
},
methods: {
  attachDatepicker: function (refName) {
    var picker = new Pikaday({
      field: this.$refs[refName],
      format: 'YYYY-MM-DD'
    })

    this.$once('hook:beforeDestroy', function () {
      picker.destroy()
    })
  }
}
```

See [this fiddle](https://jsfiddle.net/chrisvfritz/1Leb7up8/) for the full code. Note, however, that if you find yourself having to do a lot of setup and cleanup within a single component, the best solution will usually be to create more modular components. In this case, we'd recommend creating a reusable `<input-datepicker>` component.

To learn more about programmatic listeners, check out the API for [Events Instance Methods](https://vuejs.org/v2/api/#Instance-Methods-Events).

<p class="tip">Note that Vue's event system is different from the browser's <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget">EventTarget API</a>. Though they work similarly, <code>$emit</code>, <code>$on</code>, and <code>$off</code> are <strong>not</strong> aliases for <code>dispatchEvent</code>, <code>addEventListener</code>, and <code>removeEventListener</code>.</p>

## Circular References

### Recursive Components

Components can recursively invoke themselves in their own template. However, they can only do so with the `name` option:

``` js
name: 'unique-name-of-my-component'
```

When you register a component globally using `Vue.component`, the global ID is automatically set as the component's `name` option.

``` js
Vue.component('unique-name-of-my-component', {
  // ...
})
```

If you're not careful, recursive components can also lead to infinite loops:

``` js
name: 'stack-overflow',
template: '<div><stack-overflow></stack-overflow></div>'
```

A component like the above will result in a "max stack size exceeded" error, so make sure recursive invocation is conditional (i.e. uses a `v-if` that will eventually be `false`).

### Circular References Between Components

Let's say you're building a file directory tree, like in Finder or File Explorer. You might have a `tree-folder` component with this template:

``` html
<p>
  <span>{{ folder.name }}</span>
  <tree-folder-contents :children="folder.children"/>
</p>
```

Then a `tree-folder-contents` component with this template:

``` html
<ul>
  <li v-for="child in children">
    <tree-folder v-if="child.children" :folder="child"/>
    <span v-else>{{ child.name }}</span>
  </li>
</ul>
```

When you look closely, you'll see that these components will actually be each other's descendent _and_ ancestor in the render tree - a paradox! When registering components globally with `Vue.component`, this paradox is resolved for you automatically. If that's you, you can stop reading here.

However, if you're requiring/importing components using a __module system__, e.g. via Webpack or Browserify, you'll get an error:

```
Failed to mount component: template or render function not defined.
```

To explain what's happening, let's call our components A and B. The module system sees that it needs A, but first A needs B, but B needs A, but A needs B, etc. It's stuck in a loop, not knowing how to fully resolve either component without first resolving the other. To fix this, we need to give the module system a point at which it can say, "A needs B _eventually_, but there's no need to resolve B first."

In our case, let's make that point the `tree-folder` component. We know the child that creates the paradox is the `tree-folder-contents` component, so we'll wait until the `beforeCreate` lifecycle hook to register it:

``` js
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}
```

Or alternatively, you could use Webpack's asynchronous `import` when you register the component locally:

``` js
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```

Problem solved!

## Alternate Template Definitions

### Inline Templates

When the `inline-template` special attribute is present on a child component, the component will use its inner content as its template, rather than treating it as distributed content. This allows more flexible template-authoring.

``` html
<my-component inline-template>
  <div>
    <p>These are compiled as the component's own template.</p>
    <p>Not parent's transclusion content.</p>
  </div>
</my-component>
```

<p class="tip">However, <code>inline-template</code> makes the scope of your templates harder to reason about. As a best practice, prefer defining templates inside the component using the <code>template</code> option or in a <code>&lt;template&gt;</code> element in a <code>.vue</code> file.</p>

### X-Templates

Another way to define templates is inside of a script element with the type `text/x-template`, then referencing the template by an id. For example:

``` html
<script type="text/x-template" id="hello-world-template">
  <p>Hello hello hello</p>
</script>
```

``` js
Vue.component('hello-world', {
  template: '#hello-world-template'
})
```

<p class="tip">These can be useful for demos with large templates or in extremely small applications, but should otherwise be avoided, because they separate templates from the rest of the component definition.</p>

## Controlling Updates

Thanks to Vue's Reactivity system, it always knows when to update (if you use it correctly). There are edge cases, however, when you might want to force an update, despite the fact that no reactive data has changed. Then there are other cases when you might want to prevent unnecessary updates.

### Forcing an Update

<p class="tip">If you find yourself needing to force an update in Vue, in 99.99% of cases, you've made a mistake somewhere.</p>

You may not have accounted for change detection caveats [with arrays](https://vuejs.org/v2/guide/list.html#Caveats) or [objects](https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats), or you may be relying on state that isn't tracked by Vue's reactivity system, e.g. with `data`.

However, if you've ruled out the above and find yourself in this extremely rare situation of having to manually force an update, you can do so with [`$forceUpdate`](../api/#vm-forceUpdate).

### Cheap Static Components with `v-once`

Rendering plain HTML elements is very fast in Vue, but sometimes you might have a component that contains **a lot** of static content. In these cases, you can ensure that it's only evaluated once and then cached by adding the `v-once` directive to the root element, like this:

``` js
Vue.component('terms-of-service', {
  template: `
    <div v-once>
      <h1>Terms of Service</h1>
      ... a lot of static content ...
    </div>
  `
})
```

<p class="tip">Once again, try not to overuse this pattern. While convenient in those rare cases when you have to render a lot of static content, it's simply not necessary unless you actually notice slow rendering -- plus, it could cause a lot of confusion later. For example, imagine another developer who's not familiar with <code>v-once</code> or simply misses it in the template. They might spend hours trying to figure out why the template isn't updating correctly.</p>
