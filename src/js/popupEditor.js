// @ts-check

/**
 * Will add a tiny JS icon on every JavaScript snipped and onclick load the html-editor (https://yandeu.github.io/html-editor/).
 */

import { addCssStringToDom } from './misc.esm.js'
import { ManageStorage } from './store.js'

var popup_editor_template = /* html */ `<!-- backdrop -->
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
    <div id="backdrop-close-btn-corner" style="position: fixed;
      top: 0px;
      right: 45px;
      width: 20px;
      background: #ffffff00;
      height: 5px;
      box-shadow: 12px 0 0 0 #ff0000;
      border-radius: 0px 5px 0px 0px;"></div>
    <div id="backdrop-close-btn" style="position: fixed;
      color: white;
      top: 0px;
      right: 13px;
      line-height: 1;
      font-size: 32px;
      width: 32px;
      background: red;
      text-align: center;
      height: 38px;
      cursor: pointer;
      border-radius: 0px 4px 4px 4px;
      box-shadow: 2px 2px 2px 1px #0000004f;">x</div>
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
`

var add_popup_editor_template = function () {
  const a = document.getElementById('popup-editor')
  const div = a || document.createElement('div')
  div.id = 'popup-editor'
  div.innerHTML = popup_editor_template
  if (!a) document.body.append(div)
}

var remove_popup_editor_template = function () {
  const a = document.getElementById('popup-editor')
  if (a) a.remove()
}

setTimeout(() => {
  /** @type {Array<HTMLElement>} */
  let jsLangElements = []
  // all code snippets using hljs highlight
  const hljs = Array.from(document.querySelectorAll('.language-js'))
  // all buttons using html-editor as data-action
  const docFromLink = Array.from(document.querySelectorAll('[data-action="html-editor"]'))
  jsLangElements = [...hljs, ...docFromLink]

  addCssStringToDom(/*css*/ `
    .language-js {
      position: relative;
      
      .edit-button {
        cursor: pointer;
        position: absolute;
        top: 0px;
        right: 2px;
      }
    }
  `)

  if (jsLangElements.length > 0) {
    const store = new ManageStorage()

    // import html-editor lib
    import('../lib/html-editor/html-editor.js').then(mod => {
      const { init, openPreview, destroyAllTabs, getActiveTabText, setActiveTabText, getActiveTab } = mod

      // init editor
      const add = async (index, doc) => {
        if (doc.startsWith('data-url:')) {
          doc = doc.slice(9)
          doc = await (await fetch(doc)).text()
        }
        await init('html-editor', {
          footer: true,
          header: { loadBtn: true, newTab: false, openBtn: false, fullscreen: true, run: true, saveBtn: true },
          tabs: [
            {
              doc: doc,
              lang: 'javascript',
              fileName: 'demo'
            }
          ],
          events: {
            onSave: async () => {
              const text = getActiveTabText()
              await store.setDataByIndex(index, text)
              return true
            },
            onLoad: async () => {
              const text = await store.getDataByIndex(index)
              setActiveTabText(text)
              return true
            }
          }
        })
        setTimeout(() => {
          openPreview()
        })
      }

      // add styles
      const styles = document.createElement('link')
      styles.href = '../../lib/html-editor/html-editor.css'
      styles.rel = 'stylesheet'
      document.head.append(styles)

      // do the magic
      jsLangElements.forEach((a, i) => {
        const hasActionAttribute = a.hasAttribute('data-action')
        // const doc = await(await fetch("/dist/book/test.js")).text()
        /** @type {HTMLElement} */
        let clickElement
        if (!hasActionAttribute) {
          const span = document.createElement('span')
          span.innerText = 'edit'
          span.innerHTML =
            '<img style="filter: var(--theme-svg-text-filter);opacity: 0.5;" src="../../icons/mdi/javascript.svg" />'
          span.classList.add('edit-button')
          a.append(span)
          clickElement = span
        } else {
          clickElement = a
        }
        clickElement.addEventListener('click', async () => {
          // get text from .language-javascript
          const nodes = Array.from(a.childNodes)
          const code = !hasActionAttribute
            ? nodes
                .filter((a, i) => {
                  // remove the "edit" button (edit should be last node)
                  if (i === nodes.length - 1 && a.classList?.contains('edit-button')) return false
                  return true
                })
                .map(a => {
                  if (a.nodeType == Node.TEXT_NODE) {
                    return a.nodeValue
                  } else {
                    return a.innerText
                  }
                })
                .join('')
            : 'data-url:' + a.getAttribute('data-url')
          add_popup_editor_template()
          await add(i, code)
          const backdrop = document.getElementById('backdrop')
          const backdropCloseBtn = document.getElementById('backdrop-close-btn')
          backdropCloseBtn.addEventListener('click', () => {
            backdrop.classList.remove('full-opacity')
            setTimeout(() => {
              destroyAllTabs()
              backdrop.remove()
              remove_popup_editor_template()
            }, 300)
          })
          setTimeout(() => {
            backdrop.classList.add('full-opacity')
          })
          document.body.style.overflow = 'hidden'
          const jsBlocks = document.querySelectorAll('.language-javascript')
        })
      })
    })
  }
})
