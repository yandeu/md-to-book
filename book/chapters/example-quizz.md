# JavaScript Code Example

A simple js snippet

```js
let x = 5;
x += 7;

expect(x).toBe(12);
```

<!-- // todo -->
<!-- <script id="quizz-data" type="text/toml">

</script> -->

<div id="quizz_game_root"></div>

<link rel="stylesheet" href="../../lib/quizz-game/style.css" />
<link rel="stylesheet" href="../../lib/quizz-game/quizz-game.css" />

<script async defer type="module">
  import('../../lib/quizz-game/quizz-game.js').then(mod => {
    const {init} = mod
    init({ url: 'https://yandeu.github.io/quizz-game/assets/questions/test.toml', autoStart: false })
  })
</script>
