// @ts-check

/**
 * 
 * @returns
 * @description Lazy loading library for m3u8 streaming
 * @example 
 *<div class="video-wrapper">
    <video class="video-js" preload="none" poster="./thumbnail.jpg" controls data-setup="{}">
      <source src="./playlist.m3u8" type="application/x-mpegURL" />
    </video>
  </div>
 */

const main = async () => {
  const hasVideoWrapper = document.getElementsByClassName('video-js')?.length > 0 || false
  if (!hasVideoWrapper) return

  const script = document.createElement('script')
  script.src = '../../lib/videojs/video.min.js'
  document.body.append(script)

  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.href = '../../lib/videojs/video-js.css'
  document.head.append(style)
}

window.addEventListener('DOMContentLoaded', () => setTimeout(() => main(), 500))

// adding the styles immediately
const style_inline = document.createElement('style')
style_inline.innerHTML = /*css*/ `
  .video-wrapper {
    max-width: 600px;
    /* margin: 0 auto; */
  }
  .video-js {
    aspect-ratio: 16 / 9;
    width: 100%;
    height: auto;
  }
`
document.head.append(style_inline)
