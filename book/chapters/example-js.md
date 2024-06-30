# JavaScript Code Example

[editable=code/js]

<!-- backdrop -->
<style>
  .full-opacity {
    opacity: 1 !important;
  }
</style>
<div id="backdrop" style="background-color: #000000ab;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(1px);
  opacity: 0;
  transition: opacity 0.3s;
  ">
    <!-- close btn -->
    <div id="backdrop-close-btn" style="position: fixed;
      top: 0px;
      right: 13px;
      line-height: 1;
      font-size: 32px;
      width: 32px;
      background: red;
      text-align: center;
      height: 38px;
      cursor: pointer;
      border-radius: 0px 0px 4px 4px;">x</div>
    <!-- container -->
    <div style="background-color: white;
      position: absolute;
      top: 5%;
      left: 5%;
      width: 90%;
      height: 90%;
      top: calc(50dvh - 250px);
      max-height: 500px;
      border-radius: 4px;
      overflow: hidden;">
        <!-- html-editor -->
        <style>
          #html-editor-root {
            max-height: 500px;
          }
          #html-editor-root #main {
            margin-bottom: 0px;
          }
          #html-editor {
            height: 100%;
          }
        </style>
        <div id="html-editor"></div>
    </div>
</div>

```js
let hello = "JavaScript";
console.log(hello);
```

<script type="module">
  const styles = document.createElement("link")
  styles.href = "../../lib/html-editor/html-editor.css"
  styles.rel= "stylesheet"
  document.head.append(styles)

  import { init } from '../../lib/html-editor/html-editor.js'
  const doc = await(await fetch("http://localhost:8080/dist/book/test.js")).text()
  /* await init('html-editor', {
    footer: true,
    header: {newTab:false, openBtn:false, fullscreen:true, run:true, saveBtn:true},
    tabs: [
      {
        doc: `let hello = "JavaScript";\nconsole.log(hello);\n`,
        lang: 'javascript',
        fileName: 'demo'
      }
    ],
    events: {onSave: ()=>{
      return true
    }}
  }) */

  setTimeout(() => {
    return
    const backdrop = document.getElementById('backdrop')
    const backdropCloseBtn = document.getElementById('backdrop-close-btn')
    backdropCloseBtn.addEventListener('click', () => {
      backdrop.classList.remove("full-opacity");
      setTimeout(()=>{
        document.body.style.overflow = "unset";
        backdrop.remove()
      }, 300)
    })
    backdrop.classList.add("full-opacity")
    document.body.style.overflow = "hidden"

    const jsBlocks = document.querySelectorAll('.language-javascript')

    // get text from .language-javascript
    let code = Array.from(jsBlocks[0].childNodes)
      .map(a => {
        if (a.nodeType == Node.TEXT_NODE) {
          return a.nodeValue
        } else {
          return a.innerText
        }
      })
      .join('')

    jsBlocks.forEach(a => {
      a.addEventListener('click', () => {
        console.log('click me')
      })
    })
  }, 500)
</script>
