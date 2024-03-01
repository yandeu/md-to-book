// @ts-check

/**
 * 
 * @returns
 * @description Lazy loading library for m3u8 streaming
 * @example 
 *<div class="video-wrapper">
    <video preload="none" poster="./thumbnail.jpg" controls data-setup="{}">
      <source src="./playlist.m3u8" type="application/x-mpegURL" />
    </video>
  </div>
 */

const main = async () => {
  const videos = Array.from(document.getElementsByTagName('video'))
  if (videos.length === 0) return

  const script = document.createElement('script')
  script.src = '../../lib/hls/hls.js'
  script.addEventListener('load', () => {
    if (Hls.isSupported()) {
      videos.forEach(v => {
        const arr = /** @type {Array<HTMLSourceElement>} */ (Array.from(v.children))
        const m3u8 = arr.find(s => s.src.endsWith('m3u8'))
        if (!m3u8) return
        // autoStartLoad = don't start automatically
        const hls = new Hls({
          autoStartLoad: false,
          capLevelToPlayerSize: true,
          ignoreDevicePixelRatio: false,
          capLevelOnFPSDrop: true,
          abrEwmaDefaultEstimate: 2_000_000
        })
        hls.loadSource(m3u8.src)
        hls.attachMedia(v)
        v.addEventListener('play', () => hls.startLoad(), { once: true })
      })
    }
  })
  document.body.append(script)
}

window.addEventListener('DOMContentLoaded', main)
