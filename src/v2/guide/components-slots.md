---
title: Slots
type: guide
order: 104
---

> Cette page suppose que vous avez déjà lu les principes de base des [composants](components.html). Lisez-les en premier si les composants sont quelque chose de nouveau pour vous.

> En 2.6.0, nous introduisons une nouvelle syntaxe unifiée (la directive `v-slot`) pour nommer vos slots avec portée. Il remplace les attributs `slot` et `slot-scope` qui sont à présent dépréciés mais _non_ retirés et toujours documentés [ici](#Syntaxe-dépréciée). La raison à l'introduction de la nouvelle syntaxe est décrite dans cette [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md).

## Les contenus de slot

Vue implémente une API de distribution de contenu inspirée du [brouillon de spécification des WebComponents](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md) utilisant l'élément `<slot>` comme zone de distribution de contenu.

Cela vous permet de composer vos composants ainsi :

``` html
<navigation-link url="/profile">
  Mon profil
</navigation-link>
```

Dans le template `<navigation-link>`, nous aurons :

``` html
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```

Lors du cycle de rendu du composant, l'élément `<slot></slot>` est remplacé par « Mon profil ». Les éléments `<slot>` peuvent contenir n'importe quel code de template, incluant le HTML :

``` html
<navigation-link url="/profile">
  <!-- Mon icône -->
  <span class="fa fa-user"></span>
  Mon profil
</navigation-link>
```

Ou encore faire appel à d'autres composants :

``` html
<navigation-link url="/profile">
  <!-- Utilisation d'un composant dédié à l'ajout d'une icône -->
  <font-awesome-icon name="user"></font-awesome-icon>
  Mon profil
</navigation-link>
```

Si `<navigation-link>` ne contient **pas** d'élément `<slot>`, n'importe quel contenu fourni entre la balise d'ouverture et de fermeture sera ignoré.

## Portée de compilation

Quand vous voulez utiliser des données à l'intérieur d'un slot, comme ici :

``` html
<navigation-link url="/profile">
  Se connnecter en tant que {{ user.name }}
</navigation-link>
```

Le slot a accès à la même propriété d'instance (c.-à-d. la même « portée ») que le reste du template. Le slot n'a **pas** accès à la portée de `<navigation-link>`. Par exemple, essayer d'accéder à `url` ne fonctionnera pas :

``` html
<navigation-link url="/profile">
  Cliquer ici vous amènera à : {{ url }}
  <!--
  Ici `url` sera `undefined` car le contenu est passé
  _à l'intérieur de_ <navigation-link>, au lieu d'être défini _entre_ le composant <navigation-link>.
  -->
</navigation-link>
```

Souvenez-vous de cette règle :

> Tout ce qui est dans le template parent est compilé dans la portée parente, tout ce qui est dans le template enfant est compilé dans la portée enfant.

## Contenu par défaut

Il y a des cas où il est utile de spécifier un contenu par défaut pour un slot qui sera rendu uniquement si aucun contenu n'est fourni. Par exemple, dans le composant `<submit-button>` :

``` html
<button type="submit">
  <slot></slot>
</button>
```

Nous pourrions vouloir que le texte « Envoyer » soit rendu à l'intérieur de `<button>` la plupart du temps. Pour faire de « Envoyer » le contenu par défaut, nous pouvons le placer à l'intérieur des balises `<slot>` :

``` html
<button type="submit">
  <slot>Envoyer</slot>
</button>
```

Maintenant quand nous utilisons `<submit-button>` dans le composant parent, nous ne fournissons aucun contenu pour le slot :

``` html
<submit-button></submit-button>
```

ce qui fera le rendu du contenu par défaut « Envoyer » :

``` html
<button type="submit">
  Envoyer
</button>
```

Cependant, si nous fournissons le contenu :

``` html
<submit-button>
  Sauver
</submit-button>
```

Le contenu fourni sera rendu à la place :

``` html
<button type="submit">
  Sauver
</button>
```

## Les slots nommés

> Mis à jour dans la 2.6.0+. [Voir ici](#Syntaxe-dépréciée) pour la syntaxe dépréciée en utilisant l'attribut `slot`.

Dans certains cas, il peut être intéressant d'avoir plusieurs éléments `<slot>`. Dans un exemple hypothétique, voici le template d'un composant `<base-layout>` :

``` html
<div class="container">
  <header>
    <!-- Ici le contenu de l'entête -->
  </header>
  <main>
    <!-- Ici le contenu courant -->
  </main>
  <footer>
    <!-- Ici le pied de page -->
  </footer>
</div>
```

Dans le cas suivant, l'élément `<slot>` à un l'attribut spécial `name` , qui peut être utilisé pour désigner des slots additionnels :

``` html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

Un `<slot>` sans `name` obtient implicitement le nom "default".

Pour fournir du contenu à des slots nommés, nous pouvons utiliser la directive `v-slot` sur un `<template>`, fournissant le nom du slot en tant qu'argument de `v-slot` :

``` html
<base-layout>
  <template v-slot:header>
    <h1>Le titre de ma page</h1>
  </template>

  <p>Un paragraphe pour le slot par défaut.</p>
  <p>Un autre paragraphe.</p>

  <template v-slot:footer>
    <p>Ici les infos de contact</p>
  </template>
</base-layout>
```

Maintenant, tout a l'intérieur des éléments `<template>` sera passé aux slots correspondants. Tout contenu non inclu dans un `<template>` utilisant `v-slot` est considéré comme étant destiné au slot par défaut `default`.

Cependant, vous pouvez toujours entourer le contenu du slot par défaut dans un `<template>` si vous désirez que cela soit plus explicite :

``` html
<base-layout>
  <template v-slot:header>
    <h1>Le titre de ma page</h1>
  </template>

  <template v-slot:default>
    <p>Un paragraphe pour le slot par défaut.</p>
    <p>Un autre paragraphe.</p>
  </template>

  <template v-slot:footer>
    <p>Ici les infos de contact</p>
  </template>
</base-layout>
```

Dans tous les cas, le rendu HTML sera :

``` html
<div class="container">
  <header>
    <h1>Le titre de ma page</h1>
  </header>
  <main>
    <p>Un paragraphe pour le slot par défaut.</p>
    <p>Un autre paragraphe.</p>
  </main>
  <footer>
    <p>Ici les infos de contact</p>
  </footer>
</div>
```

Notez que **`v-slot` ne peut seulement être ajouté à un `<template>`** (avec [une exception](#Abbreviated-Syntax-for-Lone-Default-Slots)) contrairement aux [attributs de `slot`](#Syntax-dépréciée) dépréciés.

## Slots avec portée

> Mis à jour dans la 2.6.0+. [Voir ici](#Syntaxe-dépréciée) pour la syntaxe dépréciée en utilisant l'attribut `slot-scope`.

Parfois, il est utile pour les contenus de slot d'avoir accès aux données uniquement disponibles dans le composant enfant. Par exemple, imaginez un composant `<current-user>` avec le template suivant :

``` html
<span>
  <slot>{{ user.lastName }}</slot>
</span>
```

Nous souhaiterions remplacer le contenu par défaut pour afficher le nom de famille de l'utilisateur à la place de son prénom comme ceci :

``` html
<current-user>
  {{ user.firstName }}
</current-user>
```

Ce qui ne fonctionnera pas puisque le composant `<current-user>` n'a pas accès à `user` ni au contenu que nous avons fourni lors du rendu du parent.

Pour rendre `user` disponible dans le contenu du slot dans le parent, nous pouvons lier `user` comme un attribut de l'élément `<slot>` :

``` html
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
```

Les attributs liés à l'élément `<slot>` sont appelés des **props de slot**. Maintenant, dans la portée parente, nous pouvons utiliser `v-slot` avec une valeur pour définir un nom pour les props de slot qui nous ont été fournies :

``` html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
```

Dans cet exemple, nous avons choisi de nommer l'objet contenant tous nos props de slot `slotProps` mais vous pouvez choisir n'importe quel nom.

### Syntaxe abrégée pour les slots par défaut uniques

Dans les cas comme au-dessus, quand _uniquement_ le slot par défaut a un contenu fourni, la balise du composant peut utiliser le template de slot. Cela nous permet d'utiliser `v-slot` directement sur le composant :

``` html
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

Cela peut même être raccourci encore plus. Comme un contenu non spécifié est considéré comme étant destiné au slot par défaut, `v-slot` sans un argument est considéré comme faisant référence au slot par défaut :

``` html
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

Notez que la syntaxe abrégée pour le slot par défaut **ne** peut **pas** être mélangée avec les slots nommées, ce qui mènerait à une ambigüité de portée :

``` html
<!-- INVALIDE, résultera en un avertissement -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
  <template v-slot:other="otherSlotProps">
    `slotProps` n'est PAS disponible ici
  </template>
</current-user>
```

À chaque fois qu'il y a de multiples slots, utilisez la syntaxe complète pour le `<template>` pour _tous_ les slots :

``` html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>
```

### Décomposition de props de slot

En interne, les slots avec portée fonctionnent en entourant votre contenu de slot dans une fonction avec un seul argument :

```js
function (slotProps) {
  // ... contenu du slot ...
}
```

Cela signifie que la valeur de `v-slot` peut accepter n'importe quelle expression JavaScript valide pouvant apparaitre à la position d'un argument lors de la définition d'une fonction. Également, pour les environnements qui le supportent ([composants monofichier](single-file-components.html) ou les [navigateurs modernes](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Affecter_par_d%C3%A9composition#Compatibilit%C3%A9_des_navigateurs)), vous pouvez utiliser la [décomposition ES2015](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Affecter_par_d%C3%A9composition#D%C3%A9composer_un_objet) pour définir une collection de props de slot comme suit :

``` html
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
```

Cela rend les templates vraiment propres, en particulier quand un slot fournit divers props. Cela agrandit les possibilités, comme le renommage de props, par ex. `user` à `person`:

``` html
<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>
```

Vous pouvez même définir des valeurs par défaut à utiliser dans le cas où les props de slot sont `undefined` :

``` html
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```

## Noms de slot dynamiques

> Nouveau dans la 2.6.0+

[Arguments de directive dynamiques](syntax.html#Dynamic-Arguments) fonctionne aussi sur `v-slot`, en permettant de définir des noms de slots dynamiques:

``` html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

## Abréviation pour les slots nommés

> New in 2.6.0+

Semblable à `v-on` et`v-bind`, `v-slot` a aussi une abréviation, remplaçant tout ce qui précède l'argument (`v-slot:`) par le symbole spécial `#`. Par exemple, `v-slot: header` peut être réécrit comme `#header`:

``` html
<base-layout>
  <template #header>
    <h1>Peut être ici le titre d'une page</h1>
  </template>

  <p>Un paragraphe pour le contenu principal.</p>
  <p>Un autre paragraphe.</p>

  <template #footer>
    <p>Quelques informations de contact</p>
  </template>
</base-layout>
```

Cependant, comme pour les autres directives, l'abréviation n'est disponible que lorsqu'un argument est fourni. Cela signifie que la syntaxe suivante n'est pas valide:

``` html
<!-- Déclenchera un avertissement -->
<current-user #="{ user }">
  {{ user.firstName }}
</current-user>
```

Au lieu de cela, vous devez toujours spécifier le nom slot si vous souhaitez utiliser l'abréviation :

``` html
<current-user #default="{ user }">
  {{ user.firstName }}
</current-user>
```

## Autres exemples

**Les props de slot nous permettent de transformer les slot en templates réutilisables pouvant afficher différents contenus en fonction des slots fourni en paramètre.** Cela est particulièrement utile lorsque vous concevez un composant réutilisable qui encapsule la logique des données tout en permettant au composant parent de personnaliser une partie de sa mise en page.

Par exemple, nous implémentons un composant `<todo-list>` qui contient la logique de mise en page et de filtrage pour une liste :

``` html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

Au lieu de coder en dur le contenu de chaque tâche, nous pouvons laisser le composant parent prendre le contrôle en faisant en sorte que chaque tâche soit un slot, puis lier `todo` en tant que prop du slot :

``` html
<ul>
  <li
    v-for="todo in filteredTodos"
    v-bind:key="todo.id"
  >
    <!--
    Nous avons un slot pour chaque tâche, en le passant le
     `todo` objet comme une prop du slot.
    -->
    <slot name="todo" v-bind:todo="todo">
      <!-- Contenu par défaut -->
      {{ todo.text }}
    </slot>
  </li>
</ul>
```

Maintenant, lorsque nous utilisons le composant `<todo-list>`, nous pouvons éventuellement définir un autre `<modèle>` pour les éléments à faire, mais avec un accès aux données de l'enfant :

``` html
<todo-list v-bind:todos="todos">
  <template v-slot:todo="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```

Cependant, même cela effleure à peine ce que sont capables de faire les scops slots. Pour des exemples concrets et puissants d’utilisation des scops de slots, nous vous recommandons de parcourir des bibliothèques telles que [Vue Virtual Scroller](https://github.com/Akryum/vue-virtual-scroller), [Vue Promised](https://github.com/posva/vue-promised) et [Portal Vue](https://github.com/LinusBorg/portal-vue).

## Syntaxe Obsolète

> La directive `v-slot` a été introduite dans Vue 2.6.0, offrant une API alternative améliorée aux attributs`slot` et `slot-scope` toujours pris en charge. La justification complète de l'introduction du `v-slot` est décrite dans cette [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0001-new-slot-syntax.md). Les attributs `slot` et`slot-scope` continueront d'être pris en charge dans toutes les futures versions 2.x, mais sont officiellement obsolètes et seront éventuellement supprimés dans Vue 3.

### Slots nommés avec l'attribut `slot`

> <abbr title="Toujours pris en charge dans toutes les versions 2.x de Vue, mais n'est plus recommandé.">Obsolète</abbr> pour 2.6.0+. Voir [ici](#Les-slots-nommes) pour la nouvelle syntaxe recommandée.

Pour transmettre le contenu du parent aux slots nommés, utilisez l’attribut spécial `slot` sur `<template>` (utilisant le composant `<base-layout>` décrit [ici](#Les-slots-nommes) par exemple):

``` html
<base-layout>
  <template slot="header">
    <h1>Peut être ici le titre d'une page</h1>
  </template>

  <p>Un paragraphe pour le contenu principal.</p>
  <p>Un autre paragraphe.</p>

  <template slot="footer">
    <p>Quelques informations de contact</p>
  </template>
</base-layout>
```

Ou bien, l'attribut `slot` peut également être utilisé directement sur un élément normal :

``` html
<base-layout>
  <h1 slot="header">Peut être ici le titre d'une page</h1>

  <p>Un paragraphe pour le contenu principal.</p>
  <p>Un autre paragraphe.</p>

  <p slot="footer">Quelques informations de contact</p>
</base-layout>
```

Il peut toujours y avoir un emplacement non nommé, le **slot par défaut**, qui sert de passe-partout pour tout contenu sans correspondance. Dans les deux exemples ci-dessus, le code HTML rendu serait :

``` html
<div class="container">
  <header>
    <h1>Peut être ici le titre d'une page</h1>
  </header>
  <main>
    <p>Un paragraphe pour le contenu principal.</p>
    <p>Un autre paragraphe.</p>
  </main>
  <footer>
    <p>Quelques informations de contact</p>
  </footer>
</div>
```

### Slots avec portée avec l'attribut `slot-scope`

> <abbr title="Toujours pris en charge dans toutes les versions 2.x de Vue, mais n'est plus recommandé.">Obsolète</abbr> pour 2.6.0+. Voir [ici](#Slots-avec-portee) pour la nouvelle syntaxe recommandée.

Pour recevoir les props passés à un slot, le composant parent peut utiliser `<template>` avec l'attribut `slot-scope` (en utilisant le `<slot-example>` décrit [ici](#Slots-avec-portee) par exemple) :

``` html
<slot-example>
  <template slot="default" slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

Ici, `slot-scope` déclare l'objet props reçu en tant que variable`slotProps` et le rend disponible dans la portée `<template>`. Vous pouvez nommer `slotProps` comme vous le souhaitez, comme pour nommer les arguments des fonctions en JavaScript.

Ici `slot="default"` peut être omis car cela sous-entend :

``` html
<slot-example>
  <template slot-scope="slotProps">
    {{ slotProps.msg }}
  </template>
</slot-example>
```

L'attribut `slot-scope` peut également être utilisé directement sur un élément non-`<template>`(y compris les composants) :

``` html
<slot-example>
  <span slot-scope="slotProps">
    {{ slotProps.msg }}
  </span>
</slot-example>
```

La valeur de `slot-scope` peut accepter toute expression JavaScript valide pouvant apparaître dans la position d'argument d'une définition de fonction. Cela signifie que dans les environnements pris en charge ([Composants monofichiers](single-file-components.html) ou [navigateurs modernes](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Affecter_par_d%C3%A9composition#Compatibilit%C3%A9_des_navigateurs)) vous pouvez aussi utiliser [Décomposition ES2015](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Affecter_par_d%C3%A9composition#D%C3%A9composer_un_objet) dans l'expression, comme ceci :

``` html
<slot-example>
  <span slot-scope="{ msg }">
    {{ msg }}
  </span>
</slot-example>
```

En utilisant le `<todo-list>` décrit [ici](#Autres-exemples) à titre d'exemple, voici l'utilisation équivalente en utilisant `slot-scope` :

``` html
<todo-list v-bind:todos="todos">
  <template slot="todo" slot-scope="{ todo }">
    <span v-if="todo.isComplete">✓</span>
    {{ todo.text }}
  </template>
</todo-list>
```
