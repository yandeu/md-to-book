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
