---
title: Réactivité en détail
type: guide
order: 601
---

C'est maintenant l'heure du grand plongeon ! L'une des fonctionnalités les plus emblématiques de Vue est le système de réactivité non obstrusif. Les modèles sont simplement des objets JavaScript. Lorsque vous les modifiez, la vue se met à jour. Cela rend la gestion d'état très simple et intuitive, mais il est également important de comprendre comment cela fonctionne pour éviter quelques erreurs classiques. Dans cette section, nous allons nous pencher sur certains détails de bas niveau du système de réactivité de Vue.

<div class="vue-mastery"><a href="https://www.vuemastery.com/courses/advanced-components/build-a-reactivity-system" target="_blank" rel="sponsored noopener" title="Vue Reactivity">Regardez une vidéo de cours gratuite sur Vue Mastery (EN)</a></div>

## Comment les modifications sont tracées ?

Lorsque vous passez un simple objet JavaScript à une instance de Vue via son option `data`, Vue parcourra toutes ses propriétés et les convertira en accesseurs / mutateurs (« [getters/setters](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Utiliser_les_objets#Defining_getters_and_setters) ») en utilisant [Object.defineProperty](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object/defineProperty). Il s'agit d'une fonctionnalité ES5 uniquement et qui ne peut pas être émulée, c'est pourquoi Vue ne prend pas en charge IE8 et les versions antérieures.

Les accesseurs/mutateurs sont invisibles pour l'utilisateur, mais sous le capot, ils permettent à Vue d'effectuer le suivi des dépendances et la notification de changement quand les propriétés sont accédées ou modifiées. Une des limitations est que les consoles des navigateurs formatent les accesseurs/mutateurs différemment lorsque les objets de données convertis sont logués, vous pouvez donc installer [vue-devtools](https://github.com/vuejs/vue-devtools) pour avoir une interface plus sympathique lors de l'inspection.

Chaque instance de composant a une instance d'**observateur** correspondante, qui enregistre comme dépendances toutes les propriétés « touchées » pendant le rendu du composant. Plus tard, lorsque le mutateur d'une dépendance est déclenché, il en avertit l'observateur, ce qui provoque à son tour un nouveau rendu du composant.

![Reactivity Cycle](/images/data.png)

## Limitations de la détection de changement

En raison des limites du JavaScript moderne, il y a certains changement que Vue **ne peut pas détecter**. Cependant, il existe des manières de contourner ces limitations pour préserver la réactivité :

### Pour les objects

Vue ne peut pas détecter l'ajout et la suppression. 
Vue cannot detect property addition or deletion. Since Vue performs the getter/setter conversion process during instance initialization, a property must be present in the `data` object in order for Vue to convert it and make it reactive. For example:

Comme Vue effectue le processus de conversion accesseur/mutateur lors de l'initialisation de l'instance, une propriété doit être présente dans l'objet `data` pour que Vue puisse le convertir et le rendre réactif. Par exemple :

``` js
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` est maintenant réactive

vm.b = 2
// `vm.b` N'est PAS réactive
```

Vue n'autorise pas l'ajout dynamique de nouvelles propriétés réactives au niveau de la racine dans une instance déjà créée. Toutefois, il est possible d'ajouter des propriétés réactives à un objet imbriqué à l'aide de la méthode `Vue.set(object, propertyName, value)` :

``` js
Vue.set(vm.someObject, 'b', 2)
```

Vous pouvez aussi utiliser la méthode d'instance `vm.$set`, qui est juste un alias de la méthode globale `Vue.set` :

``` js
this.$set(this.someObject, 'b', 2)
```

Parfois vous voudrez affecter un certain nombre de propriétés à un objet existant, par exemple à l'aide de `Object.assign()` ou `_.extend()`. Pourtant, les nouvelles propriétés ajoutées à l'objet ne déclencheront pas de changements. Dans de tels cas, créez un nouvel objet avec à la fois les propriétés de l'objet d'origine et celles de l'objet à intégrer :

``` js
// Au lieu de `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

### Pour les tableaux

Vue ne peut pas détecter les changements suivants dans un tableau :

1. Lorsque vous définissez directement un élément avec l'index, par exemple `vm.items[indexOfItem] = newValue`
2. Lorsque vous modifiez la longueur du tableau, par exemple `vm.items.length = newLength`

Par exemple :

``` js
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // is NOT reactive
vm.items.length = 2 // is NOT reactive
```

Pour surmonter la première restriction, les deux éléments suivants accompliront la même chose que "vm.items[indexOfItem] = newValue", mais déclencheront également des mises à jour d'état dans le système de réactivité :

``` js
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
```
``` js
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

Vous pouvez également utiliser le [`vm.$set`](https://vuejs.org/v2/api/#vm-set) d'instance, qui est un alias de la méthode `Vue.set`:

``` js
vm.$set(vm.items, indexOfItem, newValue)
```

Pour résoudre la deuxième condition, vous pouvez utiliser le `splice` :

``` js
vm.items.splice(newLength)
```

## Déclaration de propriétés réactives

Étant donné que Vue ne permet pas d'ajouter dynamiquement des propriétés réactives au niveau de la racine, vous devez initialiser les instances de Vue en déclarant dès le départ toutes les propriétés des données réactives au niveau de la racine, même avec juste une valeur vide :

``` js
var vm = new Vue({
  data: {
    // déclare message avec une valeur vide
    message: ''
  },
  template: '<div>{{ message }}</div>'
})
// définit plus tard `message`
vm.message = 'Bonjour !'
```

Si vous ne déclarez pas `message` dans l'option data, Vue vous avertira que la fonction de rendu tente d'accéder à une propriété qui n'existe pas.

Il y a des raisons techniques derrière cette restriction (ça élimine toute une série de cas particuliers dans le système de suivi, et permet également aux instances de Vue de mieux s'intégrer avec les systèmes de vérification de type). Mais il y a aussi une considération importante en termes de maintenance de code : l'objet `data` est comme le schéma de l'état de votre composant. Déclarer toutes les propriétés réactives dès le départ rend le code du composant plus facile à comprendre lorsqu'il sera reparcouru plus tard ou lu par un autre développeur.

## File d'attente de mise à jour asynchrone

Au cas où vous ne l'auriez pas encore remarqué, Vue effectue les mises à jour du DOM de façon **asynchrone**. Chaque fois qu'un changement de données est observé, cela ouvrira une file d'attente et mettra en mémoire toutes les modifications de données qui se sont produites dans la même boucle des évènements. Si le même observateur est déclenché plusieurs fois, il ne sera ajouté qu'une seule fois dans la file d'attente. Cette suppression des doublons en mémoire est primordiale car elle évite des calculs et des manipulations du DOM inutiles. Puis, lors du prochain tour (« tick ») de la boucle des évènements, Vue vide la file d'attente et effectue le travail (déjà dédoublonné). En interne, Vue essaie d'utiliser les fonctions natives `Promise.then` et `MutationObserver` et `setImmediate` pour la file d'attente asynchrone et se rabat sur `setTimeout(fn, 0)` si elles ne sont pas supportées.

Par exemple, lorsque vous définissez `vm.someData = 'nouvelle valeur'`, le composant ne sera pas rendu de nouveau immédiatement. Il se mettra à jour au prochain « tour » (tick), lorsque la file d'attente sera vidée. La plupart du temps nous n'avons pas besoin de nous en soucier, mais cela peut être délicat lorsque vous voulez faire quelque chose qui dépend de l'état du DOM après sa mise à jour. Bien que Vue.js encourage généralement les développeurs à penser dans un mode « piloté par les données » (« data-driven ») en évitant de toucher le DOM directement, parfois il peut être nécessaire de se salir les mains. Afin d'attendre que Vue.js ait terminé la mise à jour du DOM après un changement de données, vous pouvez utiliser `Vue.nextTick (callback)` immédiatement après la modification des données. La fonction de retour sera appelée après que le DOM a été mis à jour. Par exemple :

``` html
<div id="example">{{ message }}</div>
```

``` js
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'nouveau message' // change les données
vm.$el.textContent === 'nouveau message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'nouveau message' // true
})
```

Il y a aussi la méthode d'instance `vm.$nextTick()`, qui est particulièrement pratique à l'intérieur des composants, car elle n'a pas besoin de la variable globale de `Vue` et le contexte `this` de sa fonction de rappel sera automatiquement lié à l'instance de Vue actuelle :

``` js
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: 'pas mis à jour'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = 'mis à jour'
      console.log(this.$el.textContent) // => 'pas mis à jour'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => 'mis à jour'
      })
    }
  }
})
```

Depuis que `$nextTick()` retourne une promesse, vous pouvez parvenir au même résultat que ci-dessus avec la nouvelle syntaxe [async/await de ES2017](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Instructions/async_function) :

``` js
  methods: {
    updateMessage: async function () {
      this.message = 'mise à jour'
      console.log(this.$el.textContent) // => 'pas mis à jour'
      await this.$nextTick()
      console.log(this.$el.textContent) // => 'mis à jour'
    }
  }
```
