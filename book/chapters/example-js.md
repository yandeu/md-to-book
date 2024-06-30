# JavaScript Code Example

[editable=code/js]

```js
let hello = "JavaScript";
console.log(hello);
```

<script type="module">
  import { init, destroyAllTabs} from '../../lib/html-editor/html-editor.js'

  // add styles
  const styles = document.createElement("link")
  styles.href = "../../lib/html-editor/html-editor.css"
  styles.rel= "stylesheet"
  document.head.append(styles)

  // init editor
  const add = async () => {
    const doc = await(await fetch("/dist/book/test.js")).text()
    await init('html-editor', {
      footer: true,
      header: {newTab:true, openBtn:false, fullscreen:true, run:true, saveBtn:true},
      tabs: [
        {
          doc: `let hello = "JavaScript";\nconsole.log(hello);\n`,
          lang: 'javascript',
          fileName: 'demo'
        }
      ],
      events: {onSave: ()=>{
        console.log("intercept save")
        return true
      }}
    })
  }


  setTimeout(() => {
    const jsLangs = document.querySelectorAll(".hljs.language-js")
    jsLangs.forEach(a=>{
      const span = document.createElement("span")
      span.innerText = "edit"
      span.classList.add("edit-button")
      a.append(span)
      span.addEventListener("click",async()=>{
          add_popup_editor_template()
          await add()
          const backdrop = document.getElementById('backdrop')
          const backdropCloseBtn = document.getElementById('backdrop-close-btn')
          backdropCloseBtn.addEventListener('click', () => {
            backdrop.classList.remove("full-opacity");
            setTimeout(()=>{
              destroyAllTabs()
              backdrop.remove()
              remove_popup_editor_template()
            }, 300)
          })
          setTimeout(()=>{
            backdrop.classList.add("full-opacity")
          })
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

        }, 500)
      })
    })
    
  
</script>
