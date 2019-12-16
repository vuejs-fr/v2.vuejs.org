---
title: Déboguer dans VS Code
type: cookbook
order: 8
---

<p>Chaque application atteint un point où il est nécessaire de comprendre les défaillances, petites ou grandes. Dans ce tutoriel, nous explorons quelques workflows pour les utilisateurs de VS Code qui souhaitent déboguer leur application dans le navigateur.</p>

Ce tutoriel montre comment déboguer les applications en utilisant [Vue CLI](https://github.com/vuejs/vue-cli) dans VS Code comme si elles tournaient dans un navigateur.

<p class="tip">Note: Ce tutoriel couvre Chrome et Firefox. Si vous savez comment configurer le débogage de VS Code avec d'autres navigateurs, veuillez envisager de partager vos idées (voir en bas de la page).</p>

## Prérequis

Assurez-vous d'avoir installé VS Code et le navigateur de votre choix, et que la dernière version de l'extension Debugger correspondante est installée et activée :

* [Debugger pour Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
* [Debugger pour Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug)

Installez et créez un projet avec la [vue-cli](https://github.com/vuejs/vue-cli), en suivant les instructions de la section [Guide Vue CLI](https://cli.vuejs.org/). Allez dans le répertoire nouvellement créé et ouvrez VS Code.

### Affichage du code source dans le navigateur

Avant de pouvoir déboguer vos composants Vue à partir de VS Code, vous devez mettre à jour la configuration webpack générée pour construire des sourcemaps. Nous faisons cela pour que notre débogueur ait un moyen de mapper le code d'un fichier compressé à sa position dans le fichier d'origine. Ceci vous permet de déboguer une application même après que vos ressources aient été optimisées par webpack.

Si vous utilisez Vue CLI 2, définissez ou mettez à jour le paramètre `devtool` dans `config/index.js` :

```json
devtool: 'source-map',
```

Si vous utilisez Vue CLI 3, définissez ou mettez à jour le paramètre `devtool` dans `vue.config.js` :

```js
module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}
```

### Lancement de l'application à partir de VS Code

<p class="tip">Nous supposons ici que le port est le `8080`. Si ce n'est pas le cas (par exemple, si le port `8080` a été pris et que Vue CLI a choisi automatiquement un autre port pour vous), modifiez simplement la configuration en conséquence.</p>

Cliquez sur l'icône Débogage dans la barre d'activités pour afficher la vue Débogage, puis cliquez sur l'icône en forme d'écrou pour configurer un fichier launch.json, en sélectionnant **Chrome/Firefox: Launch** comme environnement. Remplacez le contenu du fichier launch.json généré par la configuration correspondante :

![Ajout de la configuration de Chrome](/images/config_add.png)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///./src/*": "${webRoot}/*"
      }
    },
    {
      "type": "firefox",
      "request": "launch",
      "name": "vuejs: firefox",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}/src",
      "pathMappings": [{ "url": "webpack:///src/", "path": "${webRoot}/" }]
    }
  ]
}
```

## Définir un point d'arrêt

1.  Définissez un point d'arrêt dans **src/components/HelloWorld.vue** à la `ligne 90` où la fonction `data` retourne une chaîne de caractères.

  ![Définition d'un point d'arrêt](/images/breakpoint_set.png)

2.  Ouvrez votre terminal favori dans le dossier racine et lancez l'application en utilisant Vue CLI :

  ```
  npm run serve
  ```

3.  Allez dans la vue Débogage, sélectionnez la configuration **'vuejs: chrome/firefox'**, puis appuyez sur F5 ou cliquez sur le bouton vert de lecture.

4.  Votre point d'arrêt devrait maintenant être atteint dès qu'une nouvelle instance de navigateur ouvre `http://localhost:8080`.

  ![Point d'arrêt en pleine action](/images/breakpoint_hit.png)

## Modèles alternatifs

### Vue Devtools

Il existe d'autres méthodes de débogage, plus ou moins complexes. Le plus simple et le plus populaire est d'utiliser l'excellent outil Vue.js devtools [pour Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) et [pour Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/). Certains des avantages de travailler avec les outils Vue.js devtools sont qu'ils vous permettent d'éditer en direct les propriétés des données et de voir les changements se refléter immédiatement. L'autre avantage majeur est la possibilité de déboguer en revenant dans le temps pour Vuex.

![Debugger Vue.js Devtools dans le temps](/images/devtools-timetravel.gif)

<p class="tip">Veuillez noter que si la page utilise une version de Vue.js de production/minifiée (comme le lien standard d'un CDN), l'inspection via Vue.js devtools est désactivée par défaut et le volet Vue n'apparaîtra pas. Si vous passez à une version non minifiée, vous devrez peut-être rafraîchir la page pour les voir.</p>

### La simple instruction Debugger

L'exemple ci-dessus a un excellent workflow. Cependant, il y a une autre option où vous pouvez utiliser l'[instruction du débogueur natif](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) directement dans votre code. Si vous choisissez de travailler de cette façon, il est important que vous vous souveniez d'enlever les instructions lorsque vous avez terminé.

```js
<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    const hello = 'Hello World!'
    debugger
    this.message = hello
  }
};
</script>
```

## Remerciements

Ce tutoriel est basée sur une contribution de [Kenneth Auchenberg](https://twitter.com/auchenberg), [disponible ici](https://github.com/Microsoft/VSCode-recipes/tree/master/vuejs-cli).
