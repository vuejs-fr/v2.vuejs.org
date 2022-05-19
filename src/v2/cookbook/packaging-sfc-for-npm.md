---
title: Réaliser un composant Vue pour npm
type: cookbook
order: 12
---

## Exemple de base

Par nature, un composant Vue est destiné à être réutilisé. Cela est facile lorsque le composant n'est utilisé que dans une seule application. Mais comment peut-on écrire un composant une seule fois et l'utiliser sur plusieurs sites/applications ? La solution la plus simple est peut-être de passer par npm.

En empaquetant votre composant afin qu'il soit partagé via npm, il peut être importé dans un processus de construction pour être utilisé dans des applications web à part entière :

```js
import MyComponent from 'my-component';

export default {
  components: {
    MyComponent,
  },
    // ... suite du composant
}
```

Ou même utilisé via la balise `<script>` dans le navigateur directement :

```html
  <script src="https://unpkg.com/vue@2"></script>
  <script src="https://unpkg.com/my-component"></script>
  ...
  <my-component></my-component>
  ...
```

Non seulement cela vous évite de copier/coller des composants, mais cela vous permet aussi de les partager avec la communauté Vue ! 

## Puis-je partager directement les fichiers `.vue` ?

Vue autorise déjà l'écriture des composants dans un fichier unique. Du fait qu'un ([Composant](https://fr.vuejs.org/v2/guide/single-file-components.html) soit déjà un fichier unique, vous pourriez donc vous poser la question suivante :

> Pourquoi les gens ne peuvent-ils pas utiliser mon fichier `.vue` directement ? N'est-ce pas la façon la plus simple de partager des composants ?

C'est vrai, vous pouvez partager vos fichiers `.vue` directement, et n'importe qui utilisant [Un build Vue](https://fr.vuejs.org/v2/guide/installation.html#Explication-des-differents-builds) contenant le compilateur Vue peut utiliser votre composant directement. Aussi, les builds déstinés aux applications SSR utilisent la concaténation de chaînes de caractères comme une optimisation, l'utilisation de composants `.vue` partagés directement est donc préférable dans cette situation (lire la section [Rendu côté serveur](#Rendu-cote-serveur) pour plus de détails). Cependant, cela exclut les personnes souhaitant utiliser le composant directement dans un navigateur via la balise `<script>`, mais aussi les personnes souhaitant utiliser une compilation à l'exécution ou encore une application contenant des processus de compilation incapables de lire des fichiers `.vue`.

Un package approprié de votre [Composant](https://fr.vuejs.org/v2/guide/single-file-components.html) pour une distribution via npm permet de le partager de manière à ce qu'il soit prêt à être utilisé partout !

## Réaliser un package de votre composant pour npm

Pour les besoins de ce document, nous allons utiliser la structure suivante :

```
package.json
build/
   rollup.config.js
src/
   wrapper.js
   my-component.vue
dist/
```

<p class="tip">Tout au long de ce document, il est fait référence au fichier package.json mentionné dans la structure présente ci-dessus. Le fichier utilisé dans ces exemples a été généré à la main, et contiendra la configuration minimale requise pour la tâche en question. Il est probable que votre fichier package.json contienne beaucoup plus d'éléments que ce qui est énuméré sur ce document.</p>

### Comment npm sait-il quelle version servir ?

Le fichier package.json utilisé sur npm nécessite qu'une seule version (`main`), mais nous ne sommes pas seulement limité à cela. Nous pouvons aussi traiter les cas d'utilisation les plus courants en précisant 2 versions supplémentaires (`module` et `unpkg`) et même fournir un accès au fichier `.vue` lui-même en utilisant le champ `browser`. Notre fichier package.json devrait donc, pour l'instant, ressembler à ceci :

```json
{
  "name": "my-component",
  "version": "1.2.3",
  "main": "dist/my-component.umd.js",
  "module": "dist/my-component.esm.js",
  "unpkg": "dist/my-component.min.js",
  "browser": {
    "./sfc": "src/my-component.vue"
  },
  ...
}
```

Quand webpack 2+, Rollup ou bien d'autres outils de compilation sont utilisés, ils reprennent la construction du build de type `module`. Les anciennes applications utiliseraient donc la version `main` tandis que la version `unpkg` peut être utilisée directement dans les navigateurs. Par ailleurs, [unpkg](https://unpkg.com) utilise automatiquement la version `unpkg` lorsque quelqu'un saisit l'URL de votre module dans son service !

### Rendu côté serveur (SSR)

Vous aurez peut-être remarqué que les navigateurs n'utilisent pas la version `browser`. C'est parce que ce champ est destiné pour que l'auteur du package fournisse [quelque chose aux bundlers](https://github.com/defunctzombie/package-browser-field-spec#spec) qui, à leur tour, créent leurs propres paquets pour une utilisation côté client. Avec un peu d'imagination ce champ nous permet de faire correspondre un alias au fichier `.vue` lui-même. Par exemple :

```js
import MyComponent from 'my-component/sfc'; // Notons le '/sfc'
```

Les bundlers compatibles peuvent lire l'option `browser` dans le fichier package.json et traduire les requêtes de `my-component/sfc` en `my-component/src/my-component.vue`, ce qui permet d'utiliser le fichier `.vue` original à la place. Maintenant, le processus SSR peut utiliser les optimisations de concaténation de chaînes de caractères dont il a besoin pour un gain de performances.

<p class="tip">Note: Lorsque vous utilisez un fichier `.vue` directement, faites attention à tout type de prétraitement sur les balises `script` et `style`. Ces dépendances seront transmises aux utilisateurs. Envisagez donc de fournir des [Composant](https://fr.vuejs.org/v2/guide/single-file-components.html) « simples » pour alléger au maximum les choses.</p>

### Comment puis-je réaliser plusieurs versions de mon composant ?

Vous n'avez pas besoin de réecrire votre module plusieurs fois car il est tout à fait possible de préparer 3 versions de votre module en une seule étape, en quelques secondes seulement. L'exemple ci-dessous utilise [Rollup](https://rollupjs.org) en raison de sa configuration minimaliste, mais une configuration similaire est possible avec d'autres outils de builds (plus de détails sur [ce post (EN)](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c)). La section `scripts` de notre package.json peut être mise à jour avec une seule entrée pour chaque cible de compilation, et un script `build` plus générique qui les exécute tous en un seul passage. Notre fichier package.json ressemble désormais à ceci :

```json
{
  "name": "my-component",
  "version": "1.2.3",
  "main": "dist/my-component.umd.js",
  "module": "dist/my-component.esm.js",
  "unpkg": "dist/my-component.min.js",
  "browser": {
    "./sfc": "src/my-component.vue"
  },
  "scripts": {
    "build": "npm run build:umd & npm run build:es & npm run build:unpkg",
    "build:umd": "rollup --config build/rollup.config.js --format umd --file dist/my-component.umd.js",
    "build:es": "rollup --config build/rollup.config.js --format es --file dist/my-component.esm.js",
    "build:unpkg": "rollup --config build/rollup.config.js --format iife --file dist/my-component.min.js"
  },
  "devDependencies": {
    "rollup": "^1.17.0",
    "@rollup/plugin-buble": "^0.21.3",
    "@rollup/plugin-commonjs": "^11.1.0",
    "rollup-plugin-vue": "^5.0.1",
    "vue": "^2.6.10",
    "vue-template-compiler": "^2.6.10"
    ...
  },
  ...
}
```

<p class="tip">N'oubliez pas que si un fichier package.json est déjà présent sur votre projet, il sera probablement beaucoup plus long que celui présenté ici. Ceci n'illustre qu'un point de départ. De plus, les *paquets* listés dans devDependencies (et non leurs versions) sont les exigences minimales pour que Rollup puisse créer les trois builds séparées (umd, es, et unpkg). Au fur et à mesure que des versions plus récentes sont disponibles, elles doivent être mises à jour si nécessaire.</p>

Nos changements effectués sur notre package.json sont désormais terminés. Ensuite, nous aurons besoin d'un petit fichier pour exporter/installer automatiquement le ([Composant](https://fr.vuejs.org/v2/guide/single-file-components.html) actuel, d'une configuration minimale de Rollup, et c'est parti !

### À quoi va ressembler mon composant ?

En fonction de la manière dont votre composant est utilisé, il doit être exposé soit comme un module JavaScript ([CommonJS/UMD](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc#c33a)), un module [ES6](https://medium.freecodecamp.org/javascript-modules-a-beginner-s-guide-783f7d7a5fcc#4f5e) ou bien dans le cas d'une utilisation via `script`, ce composant sera automatiquement chargé dans Vue via `Vue.use(...)` et donc directement disponible. Ce fichier wrapper.js qui gère l'exportation et l'installation automatique du module ressemble à ceci:

```js
// Importation de notre composant Vue
import component from './my-component.vue';

// Déclaration de la méthode d'installation utilisée via Vue.use(...)
export function install(Vue) {
	if (install.installed) return;
  
	install.installed = true;
  
	Vue.component('MyComponent', component);
}

// Création du module à destionation Vue.use(...)
const plugin = {
	install,
};

// Installation automatique si Vue est détecté (par exemple dans un navigation via la balise <script>)
let GlobalVue = null;

if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}

if (GlobalVue) {
	GlobalVue.use(plugin);
}

// Exporter en tant que module (pour npm/webpack/etc.)
export default component;
```

On peut remarquer que la première ligne importe directement notre [Composant](https://fr.vuejs.org/v2/guide/single-file-components.html) et que la dernière ligne l'exporte tel quel. Comme indiqué dans les commentaires, ce fichier de configuration fourni une méthode "d'installation" déstinée à Vue puis tente de détecter Vue afin de s'installer automatiquement. Avec 90% du travail effectué, il est temps de sprinter jusqu'à l'arrivée !

### Comment configurer un build avec Rollup ?

Avec notre package.json contenant la section `scripts` prête à démarrer et la configuration de notre [Composant](https://fr.vuejs.org/v2/guide/single-file-components.html) mise en place via notre wrapper, il ne reste plus qu'à s'assurer que Rollup est correctement configuré. Heureusement, cela peut être fait avec un petit fichier rollup.config.js de 19 lignes déjà prêt :

```js
import commonjs from '@rollup/plugin-commonjs'; // Converti les modules CommonJS en ES6
import vue from 'rollup-plugin-vue'; // Gère les composants .vue
import buble from '@rollup/plugin-buble'; // Permet un polyfill de notre code pour un meilleur support sur les navigateurs

export default {
  input: 'src/wrapper.js', // Fichier relatif en partant de notre fichier package.json
  output: {
    name: 'MyComponent',
    exports: 'named',
  },
  plugins: [
    commonjs(),
    vue({
      css: true, // Injecte dynamiquement notre CSS dans une balise <style>
      compileTemplate: true, // Converti notre template en fonction de rendu Vue
    }),
    buble(), // Traduit en ES5
  ],
};
```

Cet exemple de configuration contient les paramètres minimums pour empaqueter votre [Composant](https://fr.vuejs.org/v2/guide/single-file-components.html) à destination de npm. Il est possible de le personnaliser, par exemple en extrayant le CSS dans un fichier séparé, en utilisant un préprocesseur CSS, en masquant la sortie JS, etc.

Il convient également de noter le « nom » donné au composant ici qui est en PascalCase, et qui devrait correspondre au nom en kebab-case utilisé ailleurs dans ce projet.

### Cela remplacera-t-il mon processus de développement actuel ?

La configuration ici n'est pas destinée à remplacer le processus de développement que vous utilisez actuellement. Si, actuellement, vous avez une configuration webpack avec hot-reload, continuez à l'utiliser ! Si vous partez de zéro, n'hésitez pas à installer [Vue CLI 3](https://github.com/vuejs/vue-cli/), qui vous donnera la configuration complète d'un hot-reload avec la commande suivante :

```bash
vue serve --open src/my-component.vue
```

En d'autres termes, développez de la manière qui vous convient le mieux. Les éléments décrits sur cette page ressemblent plus à des « touches finales » qu'à un processus de développement complet.

## Quand éviter ce schéma ?

Conditionner les [Composant](https://fr.vuejs.org/v2/guide/single-file-components.html) de cette manière n'est pas forcément une bonne idée dans certains cas. Cette page n'entre pas dans le détail de la manière dont les composants eux-mêmes sont écrits. Certains composants peuvent avoir des effets secondaires comme des directives, ou étendre d'autres bibliothèques avec des fonctionnalités supplémentaires. Dans ces cas, vous devrez évaluer si les changements nécessaires décrits sur cette page sont trop importants ou non.

En outre, faites attention à toute dépendance supplémentaire que votre [Composant](https://fr.vuejs.org/v2/guide/single-file-components.html) pourrait avoir. Par exemple, si vous avez besoin d'une bibliothèque tierce pour le tri ou la communication avec une API, Rollup peut ommetre ces différents packages dans le code final s'il n'est pas correctement configuré. Pour continuer à utiliser ceci, vous devrez configurer Rollup et exclure ces fichiers de la sortie puis mettre à jour votre documentation pour informer vos utilisateurs de la présence ces dépendances.

## Patterns alternatifs

Au moment où cette recette est écrite, Vue CLI 3 est elle-même en version bêta. Cette version de la CLI est dotée d'un mode de construction `library` intégré, qui crée des versions CommonJS et UMD d'un composant. Cela peut être adéquat pour vos cas d'utilisation, mais vous devrez quand même vous assurer que votre fichier package.json pointe correctement vers `main` and `unpkg`. De plus, il n'y aura pas de sortie de `module` ES6 à moins que cette fonctionnalité ne soit ajoutée au CLI avant sa sortie ou via un plugin.

## Remerciements

Cette page est le résultat d'une conférence éclair donnée par [Mike Dodge](https://twitter.com/webdevdodge) à VueConf.us en mars 2018. Il a publié un utilitaire pour npm qui permettra d'échafauder rapidement un échantillon de [Composant](https://fr.vuejs.org/v2/guide/single-file-components.html) en utilisant cette recette. Vous pouvez télécharger l'utilitaire, [vue-sfc-rollup](https://www.npmjs.com/package/vue-sfc-rollup), sur npm. Vous pouvez également [cloner le repo](https://github.com/team-innovation/vue-sfc-rollup) et le personnaliser.
