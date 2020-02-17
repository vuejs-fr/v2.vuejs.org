---
title: Tests unitaires
type: guide
order: 402
---

> [Vue CLI](https://cli.vuejs.org/) possède des options intégrées pour les tests unitaires avec [Jest](https://github.com/facebook/jest) ou [Mocha](https://mochajs.org/) qui fonctionne dès le démarrage. Nous avons également le [Vue Test Utils](https://vue-test-utils.vuejs.org/) officiel qui fournit un guide plus détaillé pour des configurations personnalisées.

## Des assertions simples

En termes de structure de code pour les tests, vous n'avez rien de spécial à faire dans vos composants pour les rendre testables. Exportez juste les options en l'état :

``` html
<template>
  <span>{{ message }}</span>
</template>

<script>
  export default {
    data () {
      return {
        message: 'bonjour !'
      }
    },
    created () {
      this.message = 'au revoir !'
    }
  }
</script>
```

Puis importez le composant avec [Vue Test Utils](https://vue-test-utils.vuejs.org/) et vous pourrez faire une série d'assertions communes (ici nous utilisons le style Jest avec l'assertion `expect` en tant qu'exemple) :

``` js
// Importer `shallowMount` de Vue Test Utils et le composant à tester
import { shallowMount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

// Monter le composant
const wrapper = shallowMount(MyComponent)

// Ici nous avons plusieurs tests avec Jest, cependant vous pouvez utiliser
// n'importe quel combo de lanceur de tests/bibliothèque d'assertions que vous préférez
describe('MyComponent', () => {
  // Inspecter l'objet d'options du composant
  it('a le hook `created`', () => {
    expect(typeof MyComponent.created).toBe('function')
  })

  // Évaluer les résultats des fonctions dans
  // l'objet d'options du composant
  it('contient les données par défaut', () => {
    expect(typeof MyComponent.data).toBe('function')
    const defaultData = MyComponent.data()
    expect(defaultData.message).toBe('bonjour !')
  })

  // Inspecter l'instance au montage du composant
  it('affecte correctement les messages à la création', () => {
    expect(wrapper.vm.$data.message).toBe('au revoir !')
  })

  // Monter une instance et inspecter le résultat en sortie
  it('rend le message correct', () => {
    expect(wrapper.text()).toBe('au revoir !')
  })
})
```

## Écrire des composants testables

Une bonne partie du code en sortie du rendu d'un composant est principalement déterminée par les props qu'il reçoit. Si le rendu d'un composant dépend uniquement de ses props, il devient assez facile à tester, de la même manière que l'on ferait une assertion sur la valeur de retour d'une fonction pure avec différents arguments. Voici un exemple :

``` html
<template>
  <p>{{ msg }}</p>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>
```

Vous pouvez faire des assertions sur le rendu en sortie avec différentes props avec [Vue Test Utils](https://vue-test-utils.vuejs.org/) :

``` js
import { shallowMount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

// Fonction utilitaire qui monte et retourne le composant rendu
function getMountedComponent(Component, propsData) {
  return shallowMount(MyComponent, { 
    propsData
  })
}

describe('MyComponent', () => {
  it('donne un rendu correct avec différentes props', () => {
    expect(
      getMountedComponent(MyComponent, {
        msg: 'Bonjour'
      }).text()
    ).toBe('Bonjour')

    expect(
      getMountedComponent(MyComponent, {
        msg: 'Au revoir'
      }).text()
    ).toBe('Au revoir')
  })
})
```

## Assertions sur des mises à jour asynchrones

Parce que Vue [fait les mises à jour du DOM de manière asynchrone](reactivity.html#File-d’attente-de-mise-a-jour-asynchrone), les assertions sur les mises à jour du DOM résultant d'un changement d'état doivent être faites une fois que la promesse retournée par `vm.$nextTick()` est résolue :

``` js
// Inspecter le HTML généré après une mise à jour d'état
it('met à jour le message rendu quand `wrapper.message` est mis à jour', async () => {
  const wrapper = shallowMount(MyComponent)
  wrapper.setData({ message: 'foo' })

  // Attendre une boucle (« tick ») après le changement d'état avant de faire l'assertion des mises à jour du DOM
  await wrapper.vm.$nextTick()
  expect(wrapper.text()).toBe('foo')
})
```

Nous prévoyons de travailler sur une collection de fonctions utilitaires de tests communs pour rendre encore plus simple le rendu de composants avec différentes contraintes (par ex. des rendus peu profonds ignorant les composants enfants) et faire des assertions sur le code en sortie.

Pour des informations plus pointues sur les tests unitaires avec Vue, jeter un œil à [Vue Test Utils](https://vue-test-utils.vuejs.org/) et notre entrée des tutoriels à propos des [tests unitaires de composants Vue](https://vuejs.org/v2/cookbook/unit-testing-vue-components.html).
