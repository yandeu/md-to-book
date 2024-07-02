# JavaScript Code Example

A simple js snippet

```js
let x = 5;
x += 7;

expect(x).toBe(12);
```

Another snippet

```js
let hello = "JavaScript";
editor.log(hello);
```

Lade Aufgabe von url <a data-action="html-editor" data-url="http://localhost:8080/dist/book/test.js" >(test.js)</a>.

<script type="module">
  import { init, openPreview, destroyAllTabs} from '../../lib/html-editor/html-editor.js'

  // add styles
  const styles = document.createElement("link")
  styles.href = "../../lib/html-editor/html-editor.css"
  styles.rel= "stylesheet"
  document.head.append(styles)

  // init editor
  const add = async (doc) => {
    if(doc.startsWith("data-url:")) {
      doc = doc.slice(9)
      doc = await(await fetch(doc)).text()
    }
    await init('html-editor', {
      footer: true,
      header: {loadBtn: true, newTab:false, openBtn:false, fullscreen:true, run:true, saveBtn:true},
      tabs: [
        {
          doc: doc,
          lang: 'javascript',
          fileName: 'demo'
        }
      ],
      events: {
        onSave: ()=>{
          console.log("intercept save")
          return true
        },
        onLoad: ()=>{
          console.log("onLoad event")
        }
      }
    })
    setTimeout(()=>{
      openPreview()
    })
  }


  setTimeout(() => {
    let  jsLangElements = []
    const hljs = Array.from(document.querySelectorAll(".hljs.language-js"))
    const docFromLink = Array.from(document.querySelectorAll('[data-action="html-editor"]'))
    jsLangElements = [...hljs,...docFromLink]

    jsLangElements.forEach(a=>{
      const hasActionAttribute = a.hasAttribute("data-action")
      console.log(hasActionAttribute)
      // const doc = await(await fetch("/dist/book/test.js")).text()
      let clickElement
      if(!hasActionAttribute) {
        const span = document.createElement("span")
        span.innerText = "edit"
        span.innerHTML = '<img style="filter: var(--theme-svg-text-filter);opacity: 0.5;" src="../../icons/mdi/javascript.svg" />'
        span.classList.add("edit-button")
        a.append(span)
        clickElement = span
      } else {
        clickElement = a
      }
      clickElement.addEventListener("click",async()=>{
          // get text from .language-javascript
          const nodes = Array.from(a.childNodes)
          const code = !hasActionAttribute ?
            nodes.filter((a,i)=>{
              // remove the "edit" button (edit should be last node)
              if(i === nodes.length -1 && a.classList?.contains("edit-button")) return false
              return true
            }).map(a => {
              if (a.nodeType == Node.TEXT_NODE) {
                return a.nodeValue
              } else {
                return a.innerText
              }
            })
            .join('') : "data-url:"+a.getAttribute("data-url")
          console.log(code)
          add_popup_editor_template()
          await add(code)
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
        }, 500)
      })
    })
    
  
</script>
