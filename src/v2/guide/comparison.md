---
title: Comparaison avec les autres Frameworks
type: guide
order: 29
---

C'est définitivement la page du guide la plus difficile à écrire, mais nous avons le sentiment que c'est important. Fortes sont les chances pour que, vous ayez des problèmes à résoudre et que vous utilisiez une autre librairie pour les résoudre. Vous êtes ici parce que vous voulez savoir si Vue peut encore mieux résoudre vos problèmes spécifiques. C'est la réponse que nous espérons pouvoir vous apporter.

Nous allons également essayer d'être objectif. En tant que mainteneurs, nous aimons énormément Vue. Il y a tellement de problèmes que nous pensons pouvoir être résolu bien mieux avec nous que nul part ailleurs. Si vous n'y croyez pas, nous allons travailler là dessus. Nous voulons être juste et précis. Les autres librairies offres des avantages significatifs, comme React et son vaste écosystème de rendu alternatif ou le support de Knockout des navigateurs jusqu'à IE6 ; nous allons essayer de prendre en compte cela correctement.

Nous apprécierions également **votre** aide pour garder ce document à jour car le monde de JavaScript bouge rapidement ! Si vous remarquez quelque chose de faux ou quelque chose qui ne semble pas tout à fait être juste, faites le nous savoir en [ouvrant un ticket](https://github.com/vuejs/vuejs.org/issues/new?title=Inaccuracy+in+comparisons+guide).

## React

React et Vue ont beaucoup en commun. Tous les deux :

- utilisent un DOM virtuel,
- fournissent des composants de vue réactifs et organisables,
- restent concentrés sur le cœur de la librairie, en déléguant le routage et la gestion d'état à des librairies connexes.

Ayant un champ d'action similaire, nous avons passé plus de temps à affiner cette comparaison que les autres. Nous voulons être sure non seulement de nos précisions techniques, mais aussi de leurs justesses. Nous soulignons que React éclipse Vue, par exemple dans la richesse de son écosystème et l'abondance de ses rendus personnalisables.

Ceci étant dit, il est inévitable que la comparaison va paraître biaisée entre Vue et les utilisateurs de React, tant les sujets explorés tendent à la subjectivité. Nous reconnaissons l’existence de goût différent en matière d'implémentation technique, et cette comparaison va principalement avoir pour but de décrire en quoi vous pourriez potentiellement préférer Vue si vos préférences coïncides avec les nôtres.

La communauté React [a été sollicitée](https://github.com/vuejs/vuejs.org/issues/364) pour nous aider à atteindre cette justesse, avec des remerciements spéciaux à Dan Abramov de l'équipe React. Il a été extrêmement généreux en accordant son temps et son expertise pour nous aider à remanier ce document jusqu'à ce que le résultat final [convienne](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244575740) aux deux parties.

### Profiles de performance

Dans tous les scénarios de cas réel que nous avons pu tester, Vue surpasse React avec une bonne marge. Si vos sourcils viennent tout juste de se relever, lisez plus loin. Nous allons décortiquer pourquoi (et même inclure un benchmark développé en collaboration avec l'équipe de React).

#### Performance de rendu

Quand on rend une UI, la manipulation du DOM est en général l'opération la plus coûteuse et malheureusement, aucune librairie ne peut rendre ces opérations plus rapides. Le mieux que nous puissions faire est :

1. Minimiser le nombre de changement nécessaire dans le DOM. React et Vue utilisent tous les deux un DOM virtuel pour accomplir cela et les deux implémentations fonctionnent aussi bien l'une que l'autre.

2. Et par dessus cela (en pure calcules JavaScript), il est également possible de manipuler le DOM. C'est là que Vue et React sont différents.

JavaScript est mis à contribution directement pour calculer les opérations nécessaires sur le DOM. Vue et React utilisent un DOM Virtuel pour parvenir à cela, mais l'implémentation virtuelle de Vue (un fork de [snabbdom](https://github.com/snabbdom/snabbdom)) est moins lourde en poids et utilise moins de ressources que l'implémentation de React.

Vue comme React offre également des composants fonctionnels, qui sont sans états et sans instanciations - et donc, qui requiert moins de ressources. Quand ils sont utilisés dans des situations où la performance est critique, Vue est une fois de nouveau plus rapide. Pour démontrer cela, nous avons créé un simple [projet de benchmark](https://github.com/chrisvfritz/vue-render-performance-comparisons) qui fait le rendu de 10000 éléments de liste 100 fois. Nous vous encourageons à essayer cela vous-même, sachant que le résultat varie en fonction de la machine et du navigateur utilisé — et en réalité, il varie même entre chaque exécution du fait de la nature des moteurs JavaScript.

Si vous n'en avez pas le courage, voici ci-dessous les résultats d'une des exécutions avec Chrome 52 sur un MacBook Air 2014. Pour être clair, chacun des benchmarks a été exécuté de manière successive 20 fois, et nous affichons ci-dessous les meilleurs résultats d'exécution :

{% raw %}
<table class="benchmark-table">
  <thead>
    <tr>
      <th></th>
      <th>Vue</th>
      <th>React</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Plus rapide</th>
      <td>23ms</td>
      <td>63ms</td>
    </tr>
    <tr>
      <th>Médianne</th>
      <td>42ms</td>
      <td>81ms</td>
    </tr>
    <tr>
      <th>Moyenne</th>
      <td>51ms</td>
      <td>94ms</td>
    </tr>
    <tr>
      <th>Pour 95</th>
      <td>73ms</td>
      <td>164ms</td>
    </tr>
    <tr>
      <th>Plus lent</th>
      <td>343ms</td>
      <td>453ms</td>
    </tr>
  </tbody>
</table>
{% endraw %}

#### Performance de mise à jour

Avec React, quand l'état d'un composant change, cela enclenche de nouveau le rendu de tous les sous-composants inclues, en commençant par le composant racine. Pour empêcher le re-rendu des composants enfants, vous devez implémenter `shouldComponentUpdate` partout et utilisez des structures de données immuables. Dans Vue, les dépendances d'un composant sont automatiquement suivies, ainsi le système sait précisément quels composants ont besoin d'être re-rendu.

Cela signifie que les mises à jour dans un Vue basique seront plus rapide que celles d'un React basique, et grâce au rendu performant de Vue, même un React pleinement optimisé est plus lent qu'un Vue basique.

#### En développement

Alors que la performance en production est la métrique la plus importante car directement en corrélation avec l'expérience de l'utilisateur final, la performance en développement est tout aussi importante car associée à l'expérience du développeur.

Vue et React restent assez rapide en développement pour les applications les plus standards. Cependant, quand vous avez besoin d'un taux de rafraîchissement par image pour de la visualisation de données ou de l'animation, nous avons vu des cas ou Vue supportait 10 images par seconde en développement là ou React ne supportait que 1 image par seconde.

Cela est dû au lourdes vérifications invariantes faites par React en mode développement, cela aide à l'obtention d'excellent message d'avertissements et messages d'erreurs. Nous sommes d'accord pour dire que cela est aussi important pour Vue, mais nous avons essayé de garder un œil sur la performance pendant que nous implémentions ces vérifications.

### HTML & CSS

Dans React, tout n'est que JavaScript, cela paraît simple et élégant — jusqu'à ce que vous creusiez plus profondément. La malheureuse réalité c'est que cela ré-invente le concept de HTML et CSS avec JavaScript, et, alors que cela résout certains problèmes du modèle traditionnel, cela peut en créer d'autres. Dans Vue, nous préférons embrasser les technologies du web et se placer au dessus d'elles. Pour vous montrer ce que cela signifie, nous allons nous plonger dans plusieurs exemples.

#### JSX vs Template

Avec React, tous les composants expriment leur UI à travers leurs fonctions de rendu en utilisant JSX, une syntaxe déclarative comme du XML qui fonctionne au sein de JavaScript. En voici un exemple ici, [vérifier par la communauté React](https://github.com/vuejs/vuejs.org/issues/364#issuecomment-244582684).

``` jsx
render () {
  let { items } = this.props

  let children
  if (items.length > 0) {
    children = (
      <ul>
        {items.map(item =>
          <li key={item.id}>{item.name}</li>
        )}
      </ul>
    )
  } else {
    children = <p>No items found.</p>
  }

  return (
    <div className='list-container'>
      {children}
    </div>
  )
}
```

Les fonctions de rendu de JSX ont quelques avantages :

- Vous pouvez utiliser la puissance d'un langage de programmation complet (JavaScript) pour créer vos vues.
- Les outils d'aide (ex : analyse des erreurs, vérifications de typage, auto-complétion...) pour JSX sont en bien des points plus avancés que ce qui est actuellement disponible dans les templates de Vue.

Dans Vue, nous avons également des [fonctions de rendu](https://vuejs.org/v2/guide/render-function.html) et même [un support de JSX](https://vuejs.org/v2/guide/render-function.html#JSX), car parfois, nous avons besoin de cette puissance. Cependant, pour une expérience par défaut nous offrons les templates comme une alternative simple :

``` html
<template>
  <div class="list-container">
    <ul v-if="items.length">
      <li v-for="item in items">
        {{ item.name }}
      </li>
    </ul>
    <p v-else>No items found.</p>
  </div>
</template>
```

Les quelques avantages sont ici :

- Moins d'implémentations et décisions de style sont faites lors de l'écriture du template.
- Un template est toujours déclaratif.
- Tout HTML valide est un template valide.
- Cela ce lit plus comme de l'anglais (ex : for each item in items).
- Une version avancée de JavaScript n'est pas requise ce qui améliore la lisibilité.

Ce n'est pas seulement plus facile pour le développeur de les écrire, c'est également plus facile pour les designers et développeurs moins expérimentés de comprendre et de contribuer au code.

Un autre bénéfice des templates respectant le HTML est que vous pouvez utiliser des préprocesseur comme Pug (anciennement Jade) pour créer vos templates Vue :

``` pug
div.list-container
  ul(v-if="items.length")
    li(v-for="item in items") {{ item.name }}
  p(v-else) No items found.
```

#### CSS embarqué dans les composants

À moins que vous ne répartissiez les composants dans plusieurs fichiers (par exemple avec [CSS Modules](https://github.com/gajus/react-css-modules)), l'implémentation CSS dans React est souvent faites via une solution CSS-dans-JS. Il y a beaucoup de solutions en compétition, chacune avec leurs propres mises en garde à respecter. Un problème commun a ces fonctionnalités est que les états de survoles, les media queries, et les pseudo-selectors demandent de lourdes dépendances pour ré-inventer ce que le CSS fait déjà — ou alors ne sont pas supportés. S'il n'est pas optimisé avec précaution, le CSS-dans-JS peut aussi introduire des problèmes d'exécutions complexes en terme de performance. Plus important encore, cela dévie de l'expérience première offerte par du CSS standard.

Vue d'un autre côté, donne l'accès complet au CSS à l'intérieur d'un [simple fichier composant](https://vuejs.org/v2/guide/single-file-components.html) :

``` html
<style scoped>
  @media (min-width: 250px) {
    .list-container:hover {
      background: orange;
    }
  }
</style>
```

L'attribut optionnel `scoped` encapsule automatiquement ce CSS dans votre composant en ajoutant un unique attribut (comme par exemple `data-v-21e5b78`) à l'élément et compile `.list-container:hover` en tant que `.list-container[data-v-21e5b78]:hover`.

Si vous êtes déjà familier avec les Modules CSS, les fichiers de composant Vue on également un [support de première classe pour cela](http://vue-loader.vuejs.org/en/features/css-modules.html).

Finalement, exactement comme en HTML, vous avez également l'option d'écrire votre CSS en utilisant n'importe quel préprocesseurs (ou post-processeurs) que vous souhaitez, vous permettant de tirer parti des bibliothèques existantes dans ces écosystèmes. Vous pouvez aussi effectuer des opérations centrées sur le design comme la manipulation de couleur durant votre processus de génération, au lieu d'importer des librairies JavaScript spécialisées qui vont augmenter le poids de votre livrable et complexifier votre application.

### Évolutivité

#### Amélioration progressive

Pour de large application, Vue et React offrent des solutions de routage robustes. La communauté React a également été réellement innovante en matière de solutions de gestion d'état (ex : Flux/Redux). Ces modèles de gestion d'état et [même Redux lui-même](https://github.com/egoist/revue) peuvent être facilement intégrés dans une application Vue. En fait, Vue a même poussé ce modèle un cran plus loin avec [Vuex](https://github.com/vuejs/vuex), une solution de gestion d'état inspiré par Elm qui s'intègre profondément dans Vue et qui, nous pensons, offre une expérience de développement supérieure.

Une autre différence importante entre ces offres est que les librairies accompagnant la solution de gestion d'état et de routage (parmi [d'autres concernées](https://github.com/vuejs)) sont toutes officiellement supportées et gardées à jour avec le cœur de la librairie. React préfère à la place choisir de laisser cette partie à la communauté, créant un écosystème plus fragmenté. Devenu plus populaire avec le temps, l'écosystème de React est considérablement plus riche que celui de Vue.

Pour finir, Vus offre un [outil de génération de projet](https://github.com/vuejs/vue-cli) qui rend facile de commencer un nouveau projet en utilisant le système de création de votre choix, incluant [Webpack](https://github.com/vuejs-templates/webpack), [Browserify](https://github.com/vuejs-templates/browserify), ou même sans [système de création](https://github.com/vuejs-templates/simple). React fait aussi des progrès de ce côté là avec [create-react-app](https://github.com/facebookincubator/create-react-app), mais a pour le moment quelques limitations :

- Il ne permet aucune configuration durant la génération du projet, là où les templates de projet Vue permettent l'utilisation de personnalisation à la sauce Yeoman.
- Il n'offre qu'un seul template pour vous permettre de créer une application en une seule page, là où Vue offre une large variété de template pour différents objectifs et système de création.
- Il ne permet pas la génération de projets depuis des templates fait par les utilisateurs, ce qui peut être particulièrement utile aux environnements d'entreprises avec des conventions pré-établies.

Il est important de noter que beaucoup de ses limitations sont des choix d'architecture intentionnels pris par l'équipe de create-react-app et a également ses avantages. Par exemple, aussi longtemps que vos besoins de projet seront vraiment simple vous n'aurez jamais besoin de faire des « éjection » pour personnaliser votre processus de création, vous serez capable de le mettre à jour avec des dépendances. Vous pouvez en lire plus à propos de [la différence de philosophie ici](https://github.com/facebookincubator/create-react-app#philosophy).

#### Utilisation minimale

React est renommé pour sa courbe d'apprentissage abrupte. Avant de commencer, vous devez en savoir plus à propos de JSX et probablement de ES2015+, puisque beaucoup d'exemple React utilisent la syntaxe de classe. Vous devez également apprendre ce qu'il faut à propos des système de génération, car bien que vous puissiez techniquement utiliser le compilateur Babel live fourni dans votre navigateur, cela n'est absolument pas envisageable en production.

Alors que Vue peut-être augmenté pour être l'égale de React, sinon mieux, il est également possible d'en utiliser simplement l'essence exactement comme le fait jQuery. Bien sûr — tout ce que vous devez faire est de placer une balise script dans une page :

``` html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
```

Ainsi vous pouvez commencer à écrire du code Vue même avec la version minifiée sans vous sentir coupable ou vous souciez des problèmes de performance.

Puisque vous n'avez pas besoin d'en savoir plus à propos de JSX et de ES2015, ou des systèmes de génération pour commencer à travailler avec Vue, il faut généralement moins d'un jour à un développeur pour lire [le guide](./) et en savoir assez sur la construction d'applications complexes.

### Rendu natif

ReactNavive vous permet d'écrire pour créer un rendu natif pour les applications iOS et Android en utilisant le même modèle de composant que React. Cela est génial pour un développeur, vous permettant d'appliquer vos connaissances d'un framework sur de multiple plateformes. De ce côté, Vue a une collaboration officielle avec [Weex](https://alibaba.github.io/weex/), un framework de développement d'UI multi-lateforme développé par le groupe Alibaba, qui utilise Vue en tant que framework JavaScript d'exécution. Cela signifie qu'avec Weex, vous pouvez utiliser les mêmes syntaxes de composant Vue pour qu'ils ne soient pas uniquement rendu sur un navigateur, mais également nativement sur iOS ou Android !

Actuellement, Weex est toujours activement en développement et n'a été testé aussi mûrement que ReactNative, mais sont développement est piloté en fonction des besoins d'un large e-commerce mondiale, et l'équipe de Vue est aussi en étroite collaboration avec l'équipe de Weex pour assurer la meilleure expérience pour les développeurs de Vue.

### Avec MobX

MobX est devenu populaire dans la communauté React et utilise actuellement un système de réactivité identique à Vue. Dans une certaine mesure, le flux de travail React + MobX peut être considéré comme plus verbeux que Vue. Donc si vous utilisez cette combinaison et qu'elle vous plait, l'étape suivante la plus probable et logique est d'utiliser Vue.

## Angular 1

Beaucoup de la syntaxe de Vue ressemble à celle de Angular (ex : `v-if` vs `ng-if`). Cela est dû au fait qu'il y a un certain nombre de chose bien faites dans Angular et que cela a été une source d'inspiration pour Vue vraiment tôt dans son développement. Il y a également un certain nombre de problème qu'à ammener Angular cependant, c'est là que Vue tente d'offrir des améliorations significatives.

### Complexité

Vue est bien plus simple que Angular 1, autant en terms d'API que d'architecture. En apprendre assez pour créer une application complexe prend généralement moins d'un jour, là où ce n'est pas vrai avec Angular 1.

### Flexibilité et modularité

Angular 1 impose fortement la manière dont votre application doit être structurée, là où Vue offre une solution plus flexible, modulaire. Cela premet de rendre Vue plus adaptable à une large variété de projets, bien que nous reconnaissons également qu'il peut être utile de prendre des décisions pour vous, ainsi vous avez juste à commencer à coder.

C'est pourquoi nous offrons un [template Webpack](https://github.com/vuejs-templates/webpack) qui peut être mis en place en quelques minutes, vous mettant à disposition diversent fonctionalités comme un module de rechargement à chaud, de la recherche d'erreur de code, de l'extraction de CSS, et bien plus.

### Liaison de donnée

Angular 1 utilise la liaisons de donnée à double sens entre ses champs lexicaux, là où Vue force une liaison de donnée dans un seul sens entre ses composants. Cela rend le flux de donnée plus facile pour travailler avec des applications complexes.

### Directives vs composants

Vus a une séparation clair entre les directives et les composants. Les directives sont des manipulations d'encapsulation de DOM uniquement, tandis que les composants sont des unités auto-sufissante contenant leur propre vue et logique de donnée. Dans Angular, il y a beaucoup de confusion entre les deux.

### Performance

Vue a de meilleures performances et est plus, bien plus optimisé car il ne fait pas de vérification à l'aveugle. Angular 1 devient lent quand il y a un grand nombre de observateur, car chaque fois que quelque chose change dans le champ lexical, tous les observateurs ont besoin de ré-évaluer de nouveau. Aussi, le cycle de vérification doit être exécuté de multiple fois pour être sur que tous les observateurs surveillent des données « à jour ». Les utilisateurs d'Angular ont parfois recourt a des techniques esoterique pour contourner le cyle de vérification, et dans beaucoup de situations, il n'y a simplement pas de moyen d'optimiser un champ lexical avec trop de observateurs.

Vue ne souffre pas de tout ça grâce à l'utilisation du système transparent de dépendance de surveillance avec une mise en pile asynchrone — tous les changements se déclenchent indépendamment à moins qu'ils aient des relations de dépendance explicites.

De façon intéressante, il y a quelque similitudes dans la manière dont Angular 2 et Vue corrigent ces problèmes de Angular 1.

## Angular 2

Nous avons une section dédiée à Angular 2 car c'est un framework complètement nouveau. Par exemple, les fonctionnalités du système de composant de première classe et beaucoup d'autres détailles de l'implémentation on été complètement ré-écrit. L'API à également radicalement changée.

### TypeScript

Alors que Angular 1 pouvait être utilisé pour de petite applications, Angular 2 a changé de point de vue pour faciliter la réalisation de large applications d'entreprise. Une conséquence de cela, est qu'il requière TypeScript, qui peut être réellement utile au développeurs qui désirent du typage fort comme c'est le cas avec Java ou C#.

Vue est aussi bien fourni pour l'[environnement d'entreprise](https://github.com/vuejs/awesome-vue#enterprise-usage) et peut également être utilisé avec TypeScript via notre [typage officiel](https://github.com/vuejs/vue/tree/dev/types) et les [décorateurs officiels](https://github.com/vuejs/vue-class-component), bien que ce soit définitivement une option dans notre cas.

### Taille et performance

En terme de performance, les deux frameworks sont exceptionnellement rapides et il n'y a pas assez de données de cas réelles pour ce faire une idée tranchée. Cependant, si vous êtes déterminez à comparer des valeurs, Vue 2.0 semble devant Angular 2 selon le [benchmark de cette partie tierce](http://stefankrause.net/js-frameworks-benchmark4/webdriver-ts/table.html).

D'une taille raisonnable, Angular 2 avec sa compilation hors-ligne et le retrait de fonctionalités non utilisés est capable d'offrir une taille considérablement basse. Un Vue 2.0 avec la totalité des fonctionnalités compilées inclus (23kb) est toujours plus léger que le bare-bone exemple de Angular 2 (50kb). Notons que la taille d'une app Angular 2 est petite grâce au retrait des fonctionnalités non utilisées qui enlève le code des fonctionnalités qui ne sont pas utilisées. Il va donc éventuellement encore plus grossir à mesure que vous importez et utilisez plus de fonctionnalités du framework.

### Flexibilité

Vue est moins contraignant que Angular 2, offrant un support officiel pour une variété de système de génération, avec aucune restrictions sur la manière dont vous devez structurer votre application. Beaucoup de développeur apprécie cette liberté, quand d'autres préfèrent avoir seulement une seule bonne route pour créer une application.

### Courbe d'apprentissage

Pour commercer avec Vue, tout ce dont vous avez besoin sont des connaissances en HTML et JavaScript ES5 (c-à-d JavaScript de base). Avec ces compétences de base, vous pouvez commencer à construire des applications complexes sans perdre des jours à lire [la documentation](https://vuejs.org/v2/guide/).

La courbe d'apprentissage de Angular 2 est plus raide. Même sans TypeScript, le [Guide de démarrage rapide](https://angular.io/docs/js/latest/quickstart.html) commence avec une app qui utilise JavaScript ES2015, npm avec 18 dépendances, 4 fichiers, et plus de 3000 mots pour expliquer le fonctionnement global — juste pour dire Hello World. Il ne serait donc pas exagéré de dire que le [Hello World de Vue](https://jsfiddle.net/chrisvfritz/50wL7mdz/) est bien plus simple. Il est si simple, qu'il n'est pas nécessaire de consacrer une page dédiée dans le guide pour ça.

## Ember

Ember est un framework plein de fonctionalités qui a été construit pour être hautement opiniâtre. Il fournit beaucoup de conventions et une fois que vous êtes assez familié avec elles, il vous rend réellement productif. Cependant cela signifie que la courbe d'apprentissage est élevée et souffre de flexibilité. C'est un compromis lorsque vous essayez de choisir entre un cadre opiniâtre et une bibliothèque avec un ensemble d'outils mal couplés qui travaillent ensemble. Ces derniers vous offre la liberté mais également vous laisse prendre plus de décisions d'architecture.

Cela dit, il serait problement plus judicieux de faire une comparaison entre le cœur de Vue et le système de [template](https://guides.emberjs.com/v2.10.0/templates/handlebars-basics/) d'Ember et les couches de [modèles d'objet](https://guides.emberjs.com/v2.10.0/object-model/) :

- Vue fournit une réactivité discrète sur des objets plainement JavaScript et des propriétés calculées automatiquement. Dans Ember, vous devez encapsuler tout dans des objets Ember et manuellement déclarer toutes les dépendances entre les propriétés calculées.

- La syntaxe des templates de Vue exploite toute la puissance des expressions JavaScript alors que les expressions Handlebars et les aides à la syntaxe sont intentionnellement limité en comparaison.

- Côté performance, Vue surpasse Ember avec une bonne avance, même après la dernière mise à jour du moteur Glimmer dans Ember 2.0. Vue regroupe les mises à jour, alors que dans Ember, vous devez gérer manuellement les boucles d'exécution dans des situations critiques.

## Knockout

Knockout fut un pionnier en MVVM et son espace de suivi de dépendence et son système réactif est vraiment très similaire à Vue. C'est son [support des navigateurs](http://knockoutjs.com/documentation/browser-support.html) qui est vraiment impressionnant considérant tout ce qu'il permet de faire avec un support jusqu'à IE6 ! Vue d'un autre côté ne supporte que IE9+.

Avec le temps cependant, le développement de Knockout a ralenti et il commence a se montrer un peu agé. Par exemple, son système de composant manque d'un ensemble complet d'accroche au cycle de vie et même si c'est un cas d'utilisation commun, l'interface pour passer des composants enfants à un composant est quelque peu maladroit en comparaison de Vue.

Il semble aussi y avoir une différence de philosophie dans le design des APIs et cela peut être démontrer en étudiant comment chacun gére la création [d'une simple todo list](https://gist.github.com/chrisvfritz/9e5f2d6826af00fcbace7be8f6dccb89). C'est définitivement quelque chose de subjectif, mais beaucoup considère l'API de Vue moins complexe et mieux structurée.

## Polymer

Polymer est encore un projet sponsorisé par Google et est également une source d'inspiration pour Vue. Les composants de Vue peuvent être grosso modo comparés à ceux des éléments personnalisés de Polymer et les deux fournissent un style de développement vraiment similaire. La plus grosse différence est que Polymer est construit au dessus des dernières fonctionnalités de Composant Web et requière donc des polyfills complexes pour fonctionner (avec des performances dégradées) dans les navigateurs qui ne supportent pas ses fonctionnalités nativement. Par contraste, Vue fonctionne sans aucunes dépendances dans tous les navigateurs après IE9.

Dans Polymer 1.0, l'équipe a également créé un système de liaison de donnée vraiment limité pour compenser les performances. Par exemple, la seule expression supportée dans les templates Polymer sont les négations booléennes et l'appel de simples méthodes. Son implémentation des propriétés calculées n'est pas non plus très flexible.

Les éléments personnalisés sont créé dans des fichiers HTML, avec comme limite du JavaScript et CSS natif (et les fonctionnalités supportés par les navigateurs actuels). En comparaison, les fichiers de composant unique de Vue vous permettent facilement d'utiliser ES2015+ et n'importe quel préprocesseur CSS de votre choix.

Quand vous déployez en production, Polymer recommande de tout charger à la volé avec des imports HTML, en s'appuyant sur l'implémentation dans les navigateurs de la spec, et du support de HTTP/2 côté client et côté serveur. Cela peut ne pas être possible en fonction de l'audience ciblée ou de l'environnement serveur. Au cas où vous ne souhaiteriez pas cela, vous pouvez utiliser un outil appelé Vulcanizer pour empaqueter vos éléments Polymer. De ce côté, Vue peut combiner ses fonctionnalités de composant async avec la fonctionnalité de découpe de code de Webpack pour facilement découper des parties de l'application empaquetée pour du chargement à la volée. Cela assure l'entière compatibilité avec les vieux navigateurs en conservant une excellente performance de chargement.

Il est également totallement possible d'offrir une intégration profonde entre Vue et ses specs de Composant Web tels que les Éléments Personnalisés et l'Encapsulation Discrète du DOM — Cependant, nous sommes actuellement en attente que les specs mûrissent et soit largement implémenté dans tous les navigateurs majeurs avant de sérieusement nous pencher sur la question.

## Riot

Riot 2.0 fournit un modèle de développement basé sur les composants similaire (cela est appelé un « tag » dans Riot), avec une minimal mais magnifique API. Riot et Vue partage beaucoup en matière de philosophie d'architecture. Cependant, bien qu'il soit un peu plus lourd que Riot, Vue offre beaucoup d'avantages significatifs :

- [Les effets de transitions](transitions.html). Riot n'en a pas.
- Un système de route bien plus puissant. Le routage de l'API Riot est vraiment minimal.
- Meilleures performances. Riot [utilise le DOM](http://riotjs.com/compare/#virtual-dom-vs-expressions-binding) plutôt qu'un DOM Virtuel, et par conséquent il souffre des mêmes problèmes de performances que Angular 1.
- Plus d'outils de support mûrs. Vue fournit un support officiel pour [Webpack](https://github.com/vuejs/vue-loader) et [Browserify](https://github.com/vuejs/vueify), là où Riot s'appuie sur le soutien de la communauté pour l'intégration d'un système de création.
