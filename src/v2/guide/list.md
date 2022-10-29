---
title: Rendu de liste
type: guide
order: 8
---

<div class="vueschool"><a href="https://vueschool.io/lessons/vuejs-loops?friend=vuejs" target="_blank" rel="sponsored noopener" title="Cours Vue.js gratuit sur les rendus de liste">Regarder le cours gratuit sur Vue School (EN)</a></div>

## Associer un tableau à des éléments avec `v-for`

Nous pouvons utiliser la directive `v-for` pour faire le rendu d'une liste d'éléments en nous basant sur un tableau. La directive `v-for` utilise une syntaxe spécifique de la forme `item in items`, où `items` représente le tableau source des données et où `item` est un **alias** représentant l'élément du tableau en cours d'itération :

``` html
<ul id="example-1">
  <li v-for="item in items" :key="item.message">
    {{ item.message }}
  </li>
</ul>
```

``` js
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

Résultat :

{% raw %}
<ul id="example-1" class="demo">
  <li v-for="item in items" :key="item.message">
    {{item.message}}
  </li>
</ul>
<script>
var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
</script>
{% endraw %}

À l'intérieur des structures `v-for`, nous avons un accès complet aux propriétés de la portée parente. `v-for` supporte également un second argument optionnel représentant l'index de l'élément courant.

``` html
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

``` js
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

Résultat :

{% raw%}
<ul id="example-2" class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
<script>
var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
</script>
{% endraw %}

Vous pouvez également utiliser `of` en tant que mot-clé à la place de `in` pour être plus proche de la syntaxe JavaScript concernant l'utilisation des itérateurs :

``` html
<div v-for="item of items"></div>
```

## `v-for` avec l'objet

Vous pouvez aussi utiliser `v-for` pour itérer sur les propriétés d'un objet.

``` html
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
```

``` js
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
```

Résultat :

{% raw %}
<ul id="v-for-object" class="demo">
  <li v-for="value in object">
    {{ value }}
  </li>
</ul>
<script>
new Vue({
  el: '#v-for-object',
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
</script>
{% endraw %}

Vous pouvez également fournir un deuxième argument représentant le nom de la propriété courante (c.-à-d. la clé) :

``` html
<div v-for="(value, name) in object">
  {{ name }}: {{ value }}
</div>
```

{% raw %}
<div id="v-for-object-value-name" class="demo">
  <div v-for="(value, name) in object">
    {{ name }}: {{ value }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-value-name',
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
</script>
{% endraw %}

Et un autre pour l'index :

``` html
<div v-for="(value, name, index) in object">
  {{ index }}. {{ name }}: {{ value }}
</div>
```

{% raw %}
<div id="v-for-object-value-name-index" class="demo">
  <div v-for="(value, name, index) in object">
    {{ index }}. {{ name }}: {{ value }}
  </div>
</div>
<script>
new Vue({
  el: '#v-for-object-value-name-index',
  data: {
    object: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
})
</script>
{% endraw %}

<p class="tip">Quand vous itérez sur un objet, l'ordre est basé sur l'ordre d'énumération de `Object.keys()` et il **n'**y a **aucune** garantie de cohérence à travers toutes les implémentations des moteurs JavaScript.</p>

## Maintien d'état

Quand Vue met à jour une liste d'éléments rendus avec `v-for`, il utilise par défaut une stratégie de « modification localisée » (*in-place patch*). Si l'ordre des éléments d'un tableau dans `data` a changé, plutôt que de déplacer les éléments du DOM pour concorder avec le nouvel ordre des éléments, Vue va simplement modifier chaque élément déjà en place et s'assurer que cela reflète ce qui aurait dû être rendu à cet index en particulier. C'est un comportement similaire au `track-by="$index"` de Vue 1.x.

Ce mode par défaut est performant, mais adapté seulement **lorsque le résultat du rendu de votre liste ne dépend pas de l'état d'un composant enfant ou de l'état temporaire du DOM (par ex. : les valeurs de champs d'un formulaire)**.

Pour expliquer à Vue comment suivre l'identité de chaque nœud, afin que les éléments existants puissent être réutilisés et réordonnés, vous devez fournir un attribut unique `key` pour chaque élément :

``` html
<div v-for="item in items" :key="item.id">
  <!-- contenu -->
</div>
```

Il est recommandé de fournir une `key` avec `v-for` chaque fois que possible, à moins que le contenu itéré du DOM soit simple ou que vous utilisiez intentionnellement le comportement de base pour un gain de performance.

Comme c'est un mécanisme générique pour Vue permettant d’identifier les nœuds, la `key` a également d'autres usages et ne se limite pas seulement à son utilisation avec `v-for`, comme nous le verrons plus tard dans le guide.

<p class="tip">N'utilisez pas des valeurs non primitive comme des objets ou des tableaux comme clés pour `v-for`. Utilisez des chaines de caractères ou des nombres à la place.</p>

Pour une utilisation détaillée de l'attribut `key`, consultez la [documentation d'API `key`](/v2/api/#key).

## Détection de changement dans un tableau

### Méthodes de mutation

Vue surcharge les méthodes de mutation d'un tableau observé afin qu'elles déclenchent également des mises à jour de la vue. Les méthodes encapsulées sont :

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Vous pouvez ouvrir la console et jouer avec la liste des éléments `items` des exemples précédents en appelant leurs méthodes de mutation. Par exemple : `example1.items.push({ message: 'Baz' })`.

### Remplacer un tableau

Les méthodes de mutation, comme leur nom le suggère, modifient le tableau d'origine sur lequel elles sont appelées. En comparaison, il y a aussi des méthodes non-mutatives comme par ex. `filter()`, `concat()` et `slice()`, qui ne changent pas le tableau original mais **retourne toujours un nouveau tableau**. Quand vous travaillez avec des méthodes non-mutatives, vous pouvez juste remplacer l'ancien tableau par le nouveau :

``` js
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```

Vous pouvez penser que cela va forcer Vue à jeter le DOM existant et à faire de nouveau le rendu de la liste entière ? Par chance, cela n'est pas le cas. Vue implémente plusieurs fonctions heuristiques intelligentes pour maximiser la réutilisation du DOM existant ; ainsi remplacer un tableau par un autre contenant des objets différents à certains index est une opération très performante.

### Limitations

En raison des limitations de JavaScript, il y a des types de changements que Vue **ne peut pas détecter** avec les tableaux et les objets. Ils sont abordés dans la section [réactivité](reactivity.html#Limitations-de-la-detection-de-changement).

## Affichage de résultats filtrés/triés

Parfois nous voulons afficher une version filtrée ou triée d'un tableau sans pour autant modifier ou réassigner les données d'origine. Dans ce cas, vous pouvez créer une propriété calculée qui retourne le tableau filtré ou trié.

Par exemple :

``` html
<li v-for="n in evenNumbers">{{ n }}</li>
```

``` js
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

Dans les situations où les propriétés calculées ne sont pas utilisables (par ex. à l'intérieur d'une boucle `v-for` imbriquée), vous pouvez juste utiliser une méthode :

```html
<ul v-for="set in sets">
  <li v-for="n in even(set)">{{ n }}</li>
</ul>
```

```js
data: {
  sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```

## `v-for` et plage de valeurs

`v-for` peut également prendre un nombre entier. Dans ce cas, il répètera le template autant de fois qu'indiqué.

``` html
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```

Résultat :

{% raw %}
<div id="range" class="demo">
  <span v-for="n in 10">{{ n }} </span>
</div>
<script>
  new Vue({ el: '#range' })
</script>
{% endraw %}

## Template `v-for`

De la même manière qu'avec `v-if`, vous pouvez également utiliser la balise `<template>` avec `v-for` pour faire le rendu d'une structure contenant de multiples éléments. Par exemple :

``` html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` avec `v-if`

<p class="tip">Notez qu'il n'est **pas** recommandé d'utiliser `v-if` et `v-for` ensemble. Référez-vous aux [Conventions](/v2/style-guide/#Eviter-v-if-avec-v-for-essentiel) pour plus de détails.</p>

Quand ils existent sur le même nœud, `v-for` a une priorité plus élevée que `v-if`. Cela signifie que `v-if` va être exécuté indépendamment à chaque itération de boucle. C'est très utile quand vous voulez faire le rendu de seulement _certains_ noeuds, comme ci-dessous :

``` html
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

La partie ci-dessus fait uniquement le rendu des tâches qui ne sont pas achevées.

Si votre intention est plutôt de sauter conditionnellement l'exécution de la boucle, vous pouvez placer le `v-if` sur l'élément parent (ou sur [`<template>`](conditional.html#Conditional-Groups-with-v-if-on-lt-template-gt)). Par exemple :

``` html
<ul v-if="todos.length">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
<p v-else>Plus de tâche !</p>
```

## Composants et `v-for`

> Cette partie suppose que vous connaissez les [Composants](components.html). Vous pouvez la passer pour le moment et y revenir plus tard.

Vous pouvez directement utiliser `v-for` sur un composant personnalisé, comme sur n'importe quel autre élément standard :

``` html
<my-component v-for="item in items" :key="item.id"></my-component>
```

> En 2.2.0+, lors de l'utilisation de `v-for` avec un composant, une [`key`](list.html#key) (clé) est maintenant requise.

Cependant, cela ne passera pas automatiquement les données au composant parce que les composants ont leurs propres portées isolées. Pour passer les données itérées au composant, nous devons utiliser les props en plus :

``` html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```

La raison pour ne pas injecter automatiquement `item` dans le composant est que cela le rendrait fortement couplé au fonctionnement de `v-for`. Être explicite sur l'endroit d'où proviennent les données rend le composant réutilisable dans d'autres situations.

Voici un exemple complet d'une simple liste de tâches :

``` html
<div id="todo-list-example">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-todo">Ajouter une tâche</label>
    <input
      v-model="newTodoText"
      id="new-todo"
      placeholder="Ex. nourrir le chat"
    >
    <button>Add</button>
  </form>
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
```

<p class="tip">Notez l'attribut `is="todo-item"`. Il est nécessaire dans le template du DOM, car seuls les éléments `<li>` sont valides à l'intérieur des `<ul>`. Cela fait la même chose que `<todo-item>`, mais permet de contourner les erreurs potentielles d'analyse des navigateurs. Consultez les [limitations de l’analyse d’un template à partir du DOM](components.html#Limitations-de-l’analyse-d’un-template-a-partir-du-DOM) pour en savoir plus.</p>

``` js
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Supprimer</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'Faire la vaisselle',
      },
      {
        id: 2,
        title: 'Sortir les poubelles',
      },
      {
        id: 3,
        title: 'Tondre la pelouse'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
```

{% raw %}
<div id="todo-list-example" class="demo">
  <form v-on:submit.prevent="addNewTodo">
    <label for="new-todo">Ajouter une tâche</label>
    <input
      v-model="newTodoText"
      id="new-todo"
      placeholder="Ex. nourrir le chat"
    >
    <button>Add</button>
  </form>
  <ul>
    <li
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
  </ul>
</div>
<script>
Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Supprimer</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [
      {
        id: 1,
        title: 'Faire la vaisselle',
      },
      {
        id: 2,
        title: 'Sortir les poubelles',
      },
      {
        id: 3,
        title: 'Tondre la pelouse'
      }
    ],
    nextTodoId: 4
  },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      this.newTodoText = ''
    }
  }
})
</script>
{% endraw %}
