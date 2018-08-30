---
title: Eviter Les Fuites De Mémoire (FR)
type: cookbook
order: 10
---

## Introduction

<p>Si vous développer des applications avec Vue, vous devez être attentif aux fuites de mémoire. Ce problème est spécialement important dans les Single Page Applications (SPAs) car par design, les utilisateurs ne devrait pas avoir à rafraîchir leur navigateur quand ils utilisent une SPA. L'application JavaScript est responsable pour le nettoyage des composants et doit s'assurer que le garbage collector fonctionne correctement.</p>

Les fuites de mémoire dans les applications Vue ne viennent pas de Vue, elles peuvent arriver quand on ajoute d'autre librairies dans une application.

## Simple Exemple

L'exemple suivant montre une fuite de mémoire causée par l'utilisation de la librairie [Choices.js](https://github.com/jshjohnson/Choices) dans un composant Vue et pas proprement nettoyée. Plus tard on va vous montrer comment enlever l'empreinte de Choices.js et éviter les fuites de mémoire.

Dans l'exemple ci-dessous, on ajoute énormément d'options dans un select et ensuite on utilise un montrer/cacher bouton avec une directive [v-if](/v2/guide/conditional.html) pour l'ajouter et l'enlever de la DOM virtuel. Le problème avec cet exemple est que la directive `v-if` enlève l'élément parent de la DOM, mais on ne nettoie pas les pièces additionnel de la DOM crées par Choices.js, ce qui crée une fuite de mémoire.

```html
<link rel='stylesheet prefetch' href='https://joshuajohnson.co.uk/Choices/assets/styles/css/choices.min.css?version=3.0.3'>
<script src='https://joshuajohnson.co.uk/Choices/assets/scripts/dist/choices.min.js?version=3.0.3'></script>

<div id="app">
  <button
    v-if="showChoices"
    @click="hide"
  >Cacher</button>
  <button
    v-if="!showChoices"
    @click="show"
  >Montrer</button>
  <div v-if="showChoices">
    <select id="choices-single-default"></select>
  </div>
</div>
```

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      // Ajoutont beaucoup d'options à notre select
      // pour utiliser beaucoup de mémoire
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      this.showChoices = false
    }
  }
})
```

Pour voir cette fuite de mémoire en action, ouvrer [l'exemple CodePen](https://codepen.io/freeman-g/pen/qobpxo) avec Chrome et ensuite ouvrer le gestionnaire de tâches de Chrome. Pour ouvrir le gestionnaire de tâches sur Mac, cliquer sur Fenêtre > Gestionnaire de Tâches ou sur Windows, utiliser le raccourcis Shift+Esc. Maintenant, cliquer sur le montrer/cacher bouton à peu prêt 50 fois. Vous deviez voir l'utilisation de la mémoire qui dans le gestionnaire de tâches de Chrome qui augmente sans jamais être nettoyer.

![Exemple De Fuite De Mémoire](/images/memory-leak-example.png)

## Résoudre une Fuite de Mémoire

Dans l'exemple ci-dessus, on peut utiliser notre fonction `hide()` pour nettoyer et résoudre la fuite de mémoire avant d'enlever le select de la DOM. Pour ce faire, on va garder un attribut dans l'objet data de notre instance de Vue et on va utiliser la fonction `destroy()` de [l'API de Choices](https://github.com/jshjohnson/Choices) pour faire un nettoyage.

Observer l'utilisation de la mémoire avec cet [example CodePen mis à jour](https://codepen.io/freeman-g/pen/mxWMor).

```js
new Vue({
  el: "#app",
  data: function () {
    return {
      showChoices: true,
      choicesSelect: null
    }
  },
  mounted: function () {
    this.initializeChoices()
  },
  methods: {
    initializeChoices: function () {
      let list = []
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i
        })
      }
      // Donner une réference à notre attribut choicesSelect
      this.choicesSelect = new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list
      })
    },
    show: function () {
      this.showChoices = true
      this.$nextTick(() => {
        this.initializeChoices()
      })
    },
    hide: function () {
      // Maintenant on peut utiliser notre choicesSelect réference pour faire le nettoyage
      // avant d'enlever les éléments de la DOM
      this.choicesSelect.destroy()
      this.showChoices = false
    }
  }
})
```

## Pourquoi Doit-on Gérer la Mémoire

La gestion de la mémoire et les testes de performance peuvent facilement être négligés dans l'excitement de livrer rapidement, néanmoins, utiliser le peu de mémoire est toujours important pour l'expérience utilisateur.

Considérer les types d'appareils que vos utilisateurs peuvent utiliser et quelle utilisation en font-ils. Utilisent-ils des ordinateurs portables avec peu de mémoire ou des appareils mobile? Est-ce qu'ils font beaucoup de navigation à l'intérieur de votre application? Si c'est le cas, une bonne gestion de la mémoire peut aider à éviter de crasher le navigateur de l'utilisateur. Même si ce n'est pas le cas, vous pouvez toujours avoir une dégradation des performance sur une longue période d'utilisation de votre app si vous ne faites pas attention.

## Réel Exemple

Dans l'exemple ci-dessus, on a utilisé une directive `v-if` pour illustrer une fuite de mémoire, mais une scénario plus réel arrive quand on utilise [vue-router](https://router.vuejs.org/en/) pour lier les composants dans une Single Page Application.

Comme la directive `v-if`, `vue-router` enlève les éléments de la DOM virtuel et les remplace avec de nouveaux éléments quand un utilisateur navigue dans votre application. Le [lifecycle hook](/v2/guide/instance.html#Lifecycle-Diagram) `beforeDestroy()` est une bonne place pour résoudre le même genre de problème dans une application basé sur `vue-router`.

On pourrait placer notre nettoyage dans le hook `beforeDestroy()` de la manière suivante:

```js
beforeDestroy: function () {
    this.choicesSelect.destroy()
}
```

## Modèle Altérnatif

Nous avons discuté de la gestion de mémoire quand on enlève des éléments, mais qu'arrive-il quand on veut intentionnellement garder l'état et les éléments dans la mémoire? Dans ce cas, on peut utiliser le composant [keep-alive](/v2/api/#keep-alive).

Quand on enveloppe un composant avec `keep-alive`, son état est préservé et donc garder en mémoire.

```html
<button @click="show = false">Hide</button>
<keep-alive>
  <!-- my-component va intentionnellement être garder en mémoire -->
  <my-component v-if="show"></my-component>
</keep-alive>
```
Cette technique peut être utile pour améliorer l'expérience utilisateur. Par exemple, imaginez qu'un utilisateur commence à écrire un texte sur une page et ensuite change de page. Si l'utilisateur revient sur la première page, son texte sera toujours là.

Quand on utilise kee-alive, on a accès à deux lifecycle hooks de plus: `activated` et `deactivated`. Si on veut nettoyer ou changer les données quand un keep-alive composant est enlevé, on peut le faire dans le hook `deactivated`.

```js
deactivated: function () {
  // Enlevez toutes les données que vous ne voulez par garder en mémoire
}
```

## Conclusion

Vue permet de facilement développer de magnifiques, réactives applications JavaScript, mais vous devez toujours faire attention aux fuites de mémoire. Ces fuites vont souvent survenir quand on utilise des libraires additionnel qui manipule la DOM en dehors de Vue. Soyez sure de tester votre application pour les fuites de mémoire et faites attention de bien nettoyer vos composants si nécessaire.
