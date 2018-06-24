---
title: Component Registration (EN)
type: guide
order: 101
---

> This page assumes you've already read the [Components Basics](components.html). Read that first if you are new to components.

## Les noms de composant

<p>Cette page est en cours de traduction. Pour nous aider, vous pouvez participer sur <a href="https://github.com/vuejs-fr/vuejs.org" target="_blank">le dépôt GitHub dédié de Vuejs-FR</a>.</p><p>Lors de la création de composant, il faudra toujours spécifier un nom. Par exemple, la declaration se fera comme suit: </p>

```js
Vue.component('my-component-name', { /* ... */ })
```

Le nom du composant est le premier argument de `Vue.component`.

Le nom que vous donnez à un composant peut dépendre de l'endroit où vous avez l'intention de l'utiliser. Lorsque vous utilisez un composant directement dans le DOM (par opposition à un modèle de chaîne ou un [composant monofichiers](single-file-components.html)), nous vous recommandons fortement de suivre [les règles du W3C](https://www.w3.org/TR/custom-elements/#concepts) pour les noms de balises personnalisés (tout en minuscules, contenir un trait d'union). Cela vous permet d'éviter les conflits avec les éléments HTML actuels et futurs.

Vous pouvez voir d'autres recommandations pour les noms de composants dans le [Guide des Conventions](../style-guide/#Base-component-names-strongly-recommended).

### Les cas de nom

Vous avez deux options pour définir vos noms de composant:

#### Avec kebab-case

```js
Vue.component('my-component-name', { /* ... */ })
```

Lors de la définition d'un composant avec kebab-case, vous devez également utiliser kebab-case lors du référencement de l'élément, comme ceci `<my-component-name>`.

#### Avec PascalCase

```js
Vue.component('MyComponentName', { /* ... */ })
```

Lors de la définition d'un composant avec PascalCase, vous pouvez utiliser l'un ou l'autre cas lors du référencement de l'élément. Cela signifie que `<my-component-name>` et `<MyComponentName>` sont acceptable. A noter, cependant, que seuls les noms en kebab-case sont directement valides dans le DOM (c.-à-d. la forme non-chaine).

## Création Globale

Jusque là, nous avons crée des composants seulement avec la manière suivante: `Vue.component`: 

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

Ces composants sont **enregistrés globalement**. Cela signifie qu'ils peuvent être utilisés dans le template de n'importe quelle instance Vue (`new Vue`) créée après. Par exemple: 

```js
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })

new Vue({ el: '#app' })
```

```html
<div id="app">
  <component-a></component-a>
  <component-b></component-b>
  <component-c></component-c>
</div>
```

Cela s'applique même à tous les sous-composants, ce qui signifie que ces trois composants seront également disponibles _l'un dans l'autre_.

## Création Locale

La création globale n'est souvent pas idéale. Par exemple, si vous utilisez un système de build comme Webpack, la création glabale de composants fait que même si vous arrêtez d'utiliser un composant, il peut toujours être inclus dans votre build final. Cela augmente inutilement la quantité de JavaScript que vos utilisateurs doivent télécharger.

Dans ce cas, vous pouvez définir vos composants en tant qu'objets JavaScript simples:

```js
var ComponentA = { /* ... */ }
var ComponentB = { /* ... */ }
var ComponentC = { /* ... */ }
```

Puis définissez les composants que vous souhaitez utiliser dans l'option `components`: 

```js
new Vue({
  el: '#app'
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB
  }
})
```

Pour chaque propriété de l'objet `components`, la clé sera le nom de l'élément personnalisé, tandis que la valeur contiendra l'objet d'options du composant.

Notez que **les composants crées localement ne sont _pas_ disponibles dans les sous-composants**. Par exemple, si vous voulez que `ComponentA` soit disponible dans `ComponentB`, vous devez utiliser:

```js
var ComponentA = { /* ... */ }

var ComponentB = {
  components: {
    'component-a': ComponentA
  },
  // ...
}
```

Ou si vous utilisez des modules ES2015, tels que Babel et Webpack, cela pourrait plus ressembler à:

```js
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  },
  // ...
}
```

Notez que dans ES2015+, placer un nom de variable comme `ComponentA` dans un objet est un raccourci à `ComponentA: ComponentA`, signifiant que le nom de la variable est à la fois:

- le nom de l'élément personnalisé à utiliser dans le template, et
- le nom de la variable contenant les options du composant

## Module Systems

If you're not using a module system with `import`/`require`, you can probably skip this section for now. If you are, we have some special instructions and tips just for you.

### Local Registration in a Module System

If you're still here, then it's likely you're using a module system, such as with Babel and Webpack. In these cases, we recommend creating a `components` directory, with each component in its own file.

Then you'll need to import each component you'd like to use, before you locally register it. For example, in a hypothetical `ComponentB.js` or `ComponentB.vue` file:

```js
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```

Now both `ComponentA` and `ComponentC` can be used inside `ComponentB`'s template.

### Automatic Global Registration of Base Components

Many of your components will be relatively generic, possibly only wrapping an element like an input or a button. We sometimes refer to these as [base components](../style-guide/#Base-component-names-strongly-recommended) and they tend to be used very frequently across your components.

The result is that many components may include long lists of base components:

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'

export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

Just to support relatively little markup in a template:

```html
<BaseInput
  v-model="searchText"
  @keydown.enter="search"
/>
<BaseButton @click="search">
  <BaseIcon name="search"/>
</BaseButton>
```

Fortunately, if you're using Webpack (or [Vue CLI 3+](https://github.com/vuejs/vue-cli), which uses Webpack internally), you can use `require.context` to globally register only these very common base components. Here's an example of the code you might use to globally import base components in your app's entry file (e.g. `src/main.js`):

```js
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  // The relative path of the components folder
  './components',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Strip the leading `'./` and extension from the filename
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )

  // Register component globally
  Vue.component(
    componentName,
    // Look for the component options on `.default`, which will
    // exist if the component was exported with `export default`,
    // otherwise fall back to module's root.
    componentConfig.default || componentConfig
  )
})
```

Remember that **global registration must take place before the root Vue instance is created (with `new Vue`)**. [Here's an example](https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js) of this pattern in a real project context.
