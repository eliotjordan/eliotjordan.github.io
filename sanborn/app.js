// Sanborn Mosaic Explorer: a static page over data/index.json (built by explorer/build.py).
//
// Every atlas is drawn as a filled footprint polygon. When the map is zoomed in far enough on an
// atlas (see mosaicZoom), the sheets of its mosaic that are in view are loaded as warped IIIF images
// through the Allmaps plugin and the footprint is reduced to an outline; zooming out unloads them.
import L from 'https://esm.sh/leaflet@1.9.4'
import { WarpedMapLayer } from 'https://esm.sh/@allmaps/leaflet@1.0.0-beta.55?deps=leaflet@1.9.4'

const NEW_JERSEY = L.latLngBounds([38.9, -75.58], [41.36, -73.88])
// An atlas turns into its mosaic one zoom level before it would fill the map, but never before
// MOSAIC_MIN_ZOOM (a city atlas would load a hundred sheets at once) and always by MOSAIC_MAX_ZOOM
// (a one-sheet atlas only fills the map at zoom 17 or 18).
const MOSAIC_MIN_ZOOM = 13
const MOSAIC_MAX_ZOOM = 15
const MAX_LOADED_SHEETS = 120     // nearest the map centre win when more are in view
const VIEW_PADDING = 0.15         // sheets this far outside the view are loaded too
const DOT_MAX_ZOOM = 11           // below this a footprint is only a few pixels, so a dot marks each atlas

const BASEMAPS = {
  osm: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22, maxNativeZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }),
  imagery: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 22, maxNativeZoom: 19, attribution: 'Imagery &copy; Esri and its data providers'
  })
}
const FOOTPRINT_STYLE = { color: '#1f5f8b', weight: 1.5, opacity: 1, fillColor: '#1f5f8b', fillOpacity: 0.55 }
const FOOTPRINT_HOVER = { weight: 3, fillOpacity: 0.75 }
const FOOTPRINT_AS_OUTLINE = { color: '#1f5f8b', weight: 1, opacity: 0.6, fillOpacity: 0, dashArray: '4 4' }

const $ = (id) => document.getElementById(id)
const escapeHtml = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const toBounds = ([[west, south], [east, north]]) => L.latLngBounds([south, west], [north, east])

// Zoom animations across more than one level are not supported by the Allmaps Leaflet plugin.
const map = L.map('map', { zoomAnimationThreshold: 1, maxZoom: 22, zoomSnap: 0.5 })
map.fitBounds(NEW_JERSEY)
// The basemap is drawn slightly faded over the map's white background, so the sheets stand out.
const setBasemapOpacity = () => basemap.setOpacity(Number($('basemap-opacity').value))
let basemap = BASEMAPS.osm.addTo(map)
setBasemapOpacity()
const warpedMapLayer = new WarpedMapLayer().addTo(map)
const footprints = L.layerGroup().addTo(map)
const dots = L.layerGroup().addTo(map)
const markerLayer = L.layerGroup()

let atlases = []                  // index entries, each extended with the view state below
const bundles = new Map()         // slug -> Promise of {annotations: {sheet id: ...}, metadata: {sheet id: ...}}
const loaded = new Map()          // "slug/sheet" -> { annotation, markers }
let highlight = null              // outline of the sheet under the cursor in the list
const filter = { text: '', from: 0, to: 0, min: 0, max: 0 }

// ---------------------------------------------------------------- filters

const normalise = (text) => text.trim().toLowerCase()
const matchesText = (atlas) => filter.text.split(/\s+/).every((word) => atlas.haystack.includes(word))
const matchesYears = (atlas) => atlas.year === null || (atlas.year >= filter.from && atlas.year <= filter.to)
const matches = (atlas) => matchesText(atlas) && matchesYears(atlas)
const onMap = (atlas) => atlas.shown && matches(atlas)
// The list holds only the matching atlases that reach into the current map view.
const inView = (atlas) => map.getBounds().intersects(toBounds(atlas.bbox))
const listed = () => atlases.filter((atlas) => matches(atlas) && inView(atlas))

function setYears(from, to) {
  const clamp = (value) => Math.min(filter.max, Math.max(filter.min, Math.round(value) || filter.min))
  filter.from = Math.min(clamp(from), clamp(to))
  filter.to = Math.max(clamp(from), clamp(to))
  $('year-from').value = $('range-from').value = filter.from
  $('year-to').value = $('range-to').value = filter.to
  $('reset-years').hidden = filter.from === filter.min && filter.to === filter.max
  filtersChanged()
}

function filtersChanged() {
  $('clear-search').hidden = !$('search').value
  renderChart()
  renderList()
  requestSync()
}

// ---------------------------------------------------------------- year chart

// One bar per year: the atlases matching the search, whatever the year range. Bars inside the
// range are filled; the range slider below shares the chart's scale, so its thumbs sit under the
// first and last selected bar.
const THUMB = 14
function renderChart() {
  const svg = $('chart')
  const width = svg.clientWidth || 328
  const height = 64, base = height - 6, top = 12
  const counts = new Map()
  atlases.filter((a) => matchesText(a) && a.year !== null).forEach((a) => counts.set(a.year, (counts.get(a.year) || 0) + 1))
  const peak = Math.max(1, ...counts.values())
  const span = Math.max(1, filter.max - filter.min)
  const step = (width - THUMB) / span
  const x = (year) => THUMB / 2 + (year - filter.min) * step
  const barWidth = Math.max(2, Math.min(14, step - 2))
  let marks = `<line x1="0" x2="${width}" y1="${base + 0.5}" y2="${base + 0.5}"/>`
  for (let year = filter.min; year <= filter.max; year++) {
    const count = counts.get(year) || 0
    const h = count ? Math.max(3, (count / peak) * (base - top)) : 0
    const inRange = year >= filter.from && year <= filter.to
    const r = Math.min(3, barWidth / 2, h)
    // Wide transparent hit target first, so the bar after it can react to its hover.
    marks += `<rect class="hit" data-year="${year}" data-count="${count}" x="${x(year) - step / 2}" y="0" width="${step}" height="${height}"/>`
    if (count) {
      const left = x(year) - barWidth / 2
      marks += `<path class="bar${inRange ? '' : ' out'}" d="M${left},${base} v${-(h - r)} q0,${-r} ${r},${-r} h${barWidth - 2 * r} q${r},0 ${r},${r} v${h - r} z"
        fill="${inRange ? 'var(--accent)' : 'var(--idle)'}" pointer-events="none"/>`
    }
  }
  marks += `<text x="0" y="9">${peak} ${peak === 1 ? 'atlas' : 'atlases'} at most per year</text>`
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.innerHTML = marks
  $('axis-min').textContent = filter.min
  $('axis-max').textContent = filter.max
}

function chartEvents() {
  const svg = $('chart'), tip = $('chart-tip')
  svg.addEventListener('mousemove', (event) => {
    const hit = event.target.closest('.hit')
    if (!hit) { tip.hidden = true; return }
    const count = Number(hit.dataset.count)
    tip.textContent = `${hit.dataset.year}: ${count} ${count === 1 ? 'atlas' : 'atlases'}`
    tip.style.left = `${Number(hit.getAttribute('x')) + Number(hit.getAttribute('width')) / 2}px`
    tip.hidden = false
  })
  svg.addEventListener('mouseleave', () => { tip.hidden = true })
  // Clicking a year narrows the range to it; clicking the only selected year widens it again.
  svg.addEventListener('click', (event) => {
    const hit = event.target.closest('.hit')
    if (!hit) return
    const year = Number(hit.dataset.year)
    if (filter.from === year && filter.to === year) setYears(filter.min, filter.max)
    else setYears(year, year)
  })
  new ResizeObserver(renderChart).observe(svg)
}

// ---------------------------------------------------------------- list

function sheetRow(atlas, sheet) {
  const row = document.createElement('label')
  row.className = 'sheet'
  row.innerHTML = `<input type="checkbox" ${atlas.hiddenSheets.has(sheet.id) ? '' : 'checked'} aria-label="Show ${escapeHtml(sheet.name)}">
    <span class="name" title="${escapeHtml(sheet.label)}">${escapeHtml(sheet.name)}</span>`
  row.querySelector('input').addEventListener('change', (event) => {
    if (event.target.checked) atlas.hiddenSheets.delete(sheet.id)
    else atlas.hiddenSheets.add(sheet.id)
    requestSync()
  })
  // The name zooms to the sheet and opens its details; only the box toggles it.
  row.querySelector('.name').addEventListener('click', (event) => {
    event.preventDefault()
    const bounds = toBounds(sheet.bbox)
    map.fitBounds(bounds.pad(0.2))
    openSheetPopup(atlas, sheet, bounds.getCenter())
  })
  row.addEventListener('mouseenter', () => showHighlight(sheet))
  row.addEventListener('mouseleave', clearHighlight)
  return row
}

function atlasItem(atlas) {
  const item = document.createElement('div')
  item.className = 'atlas' + (atlas.open ? ' open' : '')
  item.dataset.slug = atlas.slug
  const count = atlas.sheets.length
  item.innerHTML = `
    <div class="atlas-row">
      <button class="twisty" type="button" aria-expanded="${atlas.open}" aria-label="${atlas.open ? 'Collapse' : 'Expand'} ${escapeHtml(atlas.title)}"></button>
      <input type="checkbox" ${atlas.shown ? 'checked' : ''} aria-label="Show ${escapeHtml(atlas.title)} on the map">
      <button class="atlas-name" type="button" title="Zoom to this atlas">${escapeHtml(atlas.title)}${atlas.year ? ', ' + atlas.year : ''}
        <small>${escapeHtml(atlas.county || '')}</small></button>
      <span class="atlas-meta">${count} ${count === 1 ? 'sheet' : 'sheets'}</span>
    </div>`
  item.querySelector('.twisty').addEventListener('click', () => { atlas.open = !atlas.open; renderList() })
  item.querySelector('input').addEventListener('change', (event) => { atlas.shown = event.target.checked; requestSync() })
  item.querySelector('.atlas-name').addEventListener('click', () => zoomToAtlas(atlas))
  const row = item.querySelector('.atlas-row')
  row.addEventListener('mouseenter', () => { if (!atlas.asMosaic) atlas.layer.setStyle(FOOTPRINT_HOVER); atlas.dot.setStyle({ fillColor: '#a4521a', radius: 7 }).bringToFront() })
  row.addEventListener('mouseleave', () => { styleFootprint(atlas); atlas.dot.setStyle({ fillColor: '#1f5f8b', radius: 5 }) })
  if (atlas.open) {
    const sheets = document.createElement('div')
    sheets.className = 'sheets'
    atlas.sheets.forEach((sheet) => sheets.appendChild(sheetRow(atlas, sheet)))
    if (atlas.catalog_url) {
      sheets.insertAdjacentHTML('beforeend',
        `<div class="links"><a href="${escapeHtml(atlas.catalog_url)}" target="_blank" rel="noopener">Catalog record</a></div>`)
    }
    item.appendChild(sheets)
  }
  return item
}

let listedKey = null   // what the list last showed, so that a pan that changes nothing leaves it alone
function renderList() {
  const list = $('list')
  const matching = atlases.filter(matches)
  const visible = matching.filter(inView)
  const elsewhere = matching.length - visible.length
  const sheets = visible.reduce((sum, atlas) => sum + atlas.sheets.length, 0)
  $('match-count').textContent = visible.length === atlases.length
    ? `${atlases.length} atlases, ${sheets} sheets`
    : `${visible.length} of ${atlases.length} atlases${elsewhere ? ' in this map view' : ''}, ${sheets} sheets`
  listedKey = visible.map((atlas) => atlas.slug).join('|')
  const scroll = list.scrollTop
  list.innerHTML = ''
  if (!matching.length) list.innerHTML = '<div class="empty">No atlas matches the search and years.</div>'
  else if (!visible.length) list.innerHTML = '<div class="empty">No matching atlas in this map view.</div>'
  visible.forEach((atlas) => list.appendChild(atlasItem(atlas)))
  if (elsewhere) {
    // Matches outside the view are one click away, so a search made while zoomed in is not a dead end.
    const more = document.createElement('div')
    more.className = 'elsewhere'
    more.innerHTML = `<span>${elsewhere} more outside this map view</span><button type="button">Zoom out to them</button>`
    more.querySelector('button').addEventListener('click', () =>
      map.fitBounds(matching.map((atlas) => toBounds(atlas.bbox)).reduce((a, b) => a.extend(b)).pad(0.1)))
    list.appendChild(more)
  }
  list.scrollTop = scroll
  markLoaded()
}

// After the map moves, the list is rebuilt only if a different set of atlases is now in view.
function viewChanged() {
  if (listed().map((atlas) => atlas.slug).join('|') !== listedKey) renderList()
  requestSync()
}

// The sheet count of an atlas whose mosaic is on the map is emphasised.
function markLoaded() {
  document.querySelectorAll('.atlas').forEach((item) => {
    const atlas = atlases.find((a) => a.slug === item.dataset.slug)
    item.querySelector('.atlas-meta').classList.toggle('loaded', Boolean(atlas && atlas.asMosaic))
  })
}

function zoomToAtlas(atlas) {
  // Zoom at least to where the mosaic loads, so going to an atlas always shows its sheets.
  const bounds = toBounds(atlas.bbox)
  const zoom = Math.max(map.getBoundsZoom(bounds.pad(0.05)), mosaicZoom(atlas))
  map.setView(bounds.getCenter(), zoom)
}

// ---------------------------------------------------------------- map: footprints and highlight

function showHighlight(sheet) {
  clearHighlight()
  highlight = L.polygon(sheet.outline.map((ring) => ring.map(([lon, lat]) => [lat, lon])), {
    color: '#a4521a', weight: 3, opacity: 1, fillColor: '#a4521a', fillOpacity: 0.15, interactive: false
  }).addTo(map)
}

function clearHighlight() {
  if (highlight) { highlight.remove(); highlight = null }
}

function styleFootprint(atlas) {
  atlas.layer.setStyle(atlas.asMosaic ? FOOTPRINT_AS_OUTLINE : FOOTPRINT_STYLE)
  // Over a mosaic the outline must not take clicks or show its tooltip: clicks there are for the sheets.
  atlas.layer.eachLayer((path) => {
    const element = path.getElement()
    if (element) element.style.pointerEvents = atlas.asMosaic ? 'none' : ''
  })
  if (atlas.asMosaic) atlas.layer.closeTooltip()
}

// ---------------------------------------------------------------- sheet details popup

const popup = L.popup({ maxWidth: 380, minWidth: 260, className: 'sheet-popup', autoPanPadding: [24, 24] })
let selected = null   // outline of the sheet whose popup is open
map.on('popupclose', () => { if (selected) { selected.remove(); selected = null } })

function popupHtml(atlas, sheet, metadata) {
  const list = (title, items) => items && items.length
    ? `<h3>${title}</h3><p class="names">${items.map(escapeHtml).join(', ')}</p>` : ''
  const notes = metadata && metadata.notes && metadata.notes.length
    ? `<h3>Notes</h3><ul>${metadata.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}</ul>` : ''
  const body = metadata === undefined ? '<p class="muted">Loading details...</p>'
    : metadata === null ? '<p class="muted">No description has been written for this sheet.</p>'
    : `${metadata.description ? `<p>${escapeHtml(metadata.description)}</p>` : ''}
       ${list('Place names', metadata.placenames)}${list('Street names as printed', metadata.streetnames)}${notes}`
  const catalog = atlas.catalog_url
    ? ` &middot; <a href="${escapeHtml(atlas.catalog_url)}" target="_blank" rel="noopener">Catalog record</a>` : ''
  return `<div class="sheet-details">
    <h2>${escapeHtml(sheet.label)}</h2>
    ${body}
    <p class="muted">${sheet.points} control points${catalog}</p>
  </div>`
}

// Open the details of a sheet at `latlng`: at once with what the index knows, then with the
// description, names and notes once the atlas's bundle has arrived.
async function openSheetPopup(atlas, sheet, latlng) {
  popup.setLatLng(latlng).setContent(popupHtml(atlas, sheet, undefined)).openOn(map)
  if (selected) selected.remove()
  selected = L.polygon(sheet.outline.map((ring) => ring.map(([lon, lat]) => [lat, lon])),
    { color: '#a4521a', weight: 2.5, opacity: 1, fill: false, interactive: false }).addTo(map)
  const outline = selected
  let metadata = null
  try { metadata = (await loadBundle(atlas)).metadata[sheet.id] || null } catch (error) { console.warn('details', atlas.slug, error) }
  if (selected === outline) popup.setContent(popupHtml(atlas, sheet, metadata))   // still this sheet's popup
}

// Even-odd test of [lon, lat] rings, as in GeoJSON.
function ringsContain(rings, lng, lat) {
  let inside = false
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j]
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside
    }
  }
  return inside
}

// A click on the map opens the details of the mosaic sheet drawn there, if any. The warped images
// are one canvas and take no events of their own, so the sheet is found from the outlines.
function sheetAt(latlng) {
  for (const atlas of atlases) {
    if (!atlas.asMosaic || !toBounds(atlas.bbox).contains(latlng)) continue
    const sheet = atlas.sheets.find((s) => loaded.has(`${atlas.slug}/${s.id}`) && ringsContain(s.outline, latlng.lng, latlng.lat))
    if (sheet) return { atlas, sheet }
  }
  return null
}
map.on('click', (event) => {
  const hit = sheetAt(event.latlng)
  if (hit) openSheetPopup(hit.atlas, hit.sheet, event.latlng)
})

function addFootprint(atlas) {
  atlas.layer = L.geoJSON({ type: 'Feature', geometry: atlas.footprint }, { style: FOOTPRINT_STYLE })
  atlas.layer.bindTooltip(`${escapeHtml(atlas.title)}${atlas.year ? ', ' + atlas.year : ''}<br>${atlas.sheets.length} sheets`,
    { sticky: true, className: 'footprint-tip' })
  atlas.layer.on('mouseover', () => { if (!atlas.asMosaic) atlas.layer.setStyle(FOOTPRINT_HOVER) })
  atlas.layer.on('mouseout', () => styleFootprint(atlas))
  atlas.layer.on('click', () => { if (!atlas.asMosaic) zoomToAtlas(atlas) })
  // Statewide, the footprint is too small to see or to click: a dot stands in for it.
  atlas.dot = L.circleMarker(toBounds(atlas.bbox).getCenter(),
    { radius: 5, color: '#fff', weight: 1.5, fillColor: '#1f5f8b', fillOpacity: 1 })
  atlas.dot.bindTooltip(atlas.layer.getTooltip().getContent(), { className: 'footprint-tip' })
  atlas.dot.on('click', () => zoomToAtlas(atlas))
}

// ---------------------------------------------------------------- map: mosaics

// The zoom from which an atlas is shown as its mosaic (see the constants at the top).
function mosaicZoom(atlas) {
  const fit = map.getBoundsZoom(toBounds(atlas.bbox))
  return Math.min(MOSAIC_MAX_ZOOM, Math.max(MOSAIC_MIN_ZOOM, fit - 1))
}

function loadBundle(atlas) {
  if (!bundles.has(atlas.slug)) {
    const request = fetch(`data/atlases/${encodeURIComponent(atlas.slug)}.json`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
    request.catch(() => bundles.delete(atlas.slug))   // a failed fetch is tried again at the next sync
    bundles.set(atlas.slug, request)
  }
  return bundles.get(atlas.slug)
}

function buildMarkers(annotation) {
  const group = L.layerGroup()
  annotation.body.features.forEach((feature, index) => {
    const [lon, lat] = feature.geometry.coordinates
    L.circleMarker([lat, lon], { radius: 5, color: '#1f5f8b', weight: 2, fillColor: '#fff', fillOpacity: 0.9 })
      .bindTooltip(escapeHtml(feature.properties.name || `Control point ${index + 1}`))
      .addTo(group)
  })
  return group
}

function setOpacity(value) {
  // The option-based call is the current API; setOpacity is kept for older plugin builds.
  if (warpedMapLayer.setLayerOptions) warpedMapLayer.setLayerOptions({ opacity: value })
  else if (warpedMapLayer.setOpacity) warpedMapLayer.setOpacity(value)
}

async function loadSheet(key, atlas, sheet) {
  const bundle = await loadBundle(atlas)
  // A stable id per sheet keeps the layer's maps apart; a copy leaves the cached bundle untouched.
  const annotation = { ...bundle.annotations[sheet.id], id: new URL(`data/atlases/${atlas.slug}#${sheet.id}`, location.href).href }
  await warpedMapLayer.addGeoreferenceAnnotation(annotation)
  const markers = buildMarkers(annotation).addTo(markerLayer)
  loaded.set(key, { annotation, markers })
  setOpacity(Number($('opacity').value))
}

async function unloadSheet(key) {
  const entry = loaded.get(key)
  loaded.delete(key)
  entry.markers.remove()
  await warpedMapLayer.removeGeoreferenceAnnotation(entry.annotation)
  if (!loaded.size) {
    // With no maps left the plugin does not repaint, so the last sheet would stay on screen.
    const gl = warpedMapLayer.gl
    if (gl) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT) }
  }
}

// What the map should show now: footprints for the atlases that pass the filters, and the sheets
// (by "slug/sheet") of the ones zoomed in on.
function desiredSheets() {
  const zoom = map.getZoom()
  const view = map.getBounds().pad(VIEW_PADDING)
  const centre = map.getCenter()
  const wanted = []
  for (const atlas of atlases) {
    const visible = onMap(atlas)
    atlas.asMosaic = visible && zoom >= mosaicZoom(atlas) && view.intersects(toBounds(atlas.bbox))
    if (visible) footprints.addLayer(atlas.layer)
    else footprints.removeLayer(atlas.layer)
    if (visible && zoom < DOT_MAX_ZOOM) dots.addLayer(atlas.dot)
    else dots.removeLayer(atlas.dot)
    styleFootprint(atlas)
    if (!atlas.asMosaic) continue
    for (const sheet of atlas.sheets) {
      const bounds = toBounds(sheet.bbox)
      if (atlas.hiddenSheets.has(sheet.id) || !view.intersects(bounds)) continue
      wanted.push({ key: `${atlas.slug}/${sheet.id}`, atlas, sheet, distance: centre.distanceTo(bounds.getCenter()) })
    }
  }
  wanted.sort((a, b) => a.distance - b.distance)
  return wanted.slice(0, MAX_LOADED_SHEETS)
}

// Loading and unloading are asynchronous, so they run one at a time in a single loop; a change
// that arrives meanwhile (another pan, a filter) makes the loop start over with the new target.
let syncWanted = false
let syncRunning = false
function requestSync() {
  syncWanted = true
  if (!syncRunning) runSync()
}

async function runSync() {
  syncRunning = true
  while (syncWanted) {
    syncWanted = false
    const wanted = desiredSheets()
    markLoaded()
    const keep = new Set(wanted.map((item) => item.key))
    for (const key of [...loaded.keys()]) {
      if (!keep.has(key)) await unloadSheet(key).catch((error) => console.warn('unload', key, error))
    }
    for (const item of wanted) {
      if (syncWanted) break
      if (loaded.has(item.key)) continue
      try { await loadSheet(item.key, item.atlas, item.sheet) } catch (error) { console.warn('load', item.key, error) }
    }
  }
  syncRunning = false
}

// ---------------------------------------------------------------- start

function showProgress(progress, built) {
  const { atlases_georeferenced: done, atlases_total: total } = progress
  const percent = total ? (done / total) * 100 : 0
  $('progress-count').textContent = `${done.toLocaleString()} of ${total.toLocaleString()} atlases georeferenced`
  $('progress-percent').textContent = `${percent < 10 ? percent.toFixed(1) : Math.round(percent)}%`
  $('progress-bar').style.width = `${percent}%`
  $('progress-note').textContent =
    `${progress.images_georeferenced.toLocaleString()} of ${progress.images_total.toLocaleString()} scanned pages. Updated ${built}.`
  $('progress').hidden = false
}

async function start() {
  let index
  try {
    index = await fetch('data/index.json').then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
  } catch (error) {
    $('list').innerHTML = `<div class="error">Could not load data/index.json: ${escapeHtml(error.message)}</div>`
    return
  }
  atlases = index.atlases.map((atlas) => ({
    ...atlas,
    shown: true, open: false, asMosaic: false, hiddenSheets: new Set(),
    haystack: normalise([atlas.title, atlas.county, atlas.year, atlas.slug, atlas.catalog_title].filter(Boolean).join(' '))
  }))
  atlases.forEach(addFootprint)
  showProgress(index.progress, index.built)

  const years = atlases.map((atlas) => atlas.year).filter((year) => year !== null)
  filter.min = Math.min(...years)
  filter.max = Math.max(...years)
  for (const id of ['year-from', 'year-to', 'range-from', 'range-to']) { $(id).min = filter.min; $(id).max = filter.max }
  chartEvents()
  setYears(filter.min, filter.max)     // renders the chart and the list, and syncs the map
}

$('search').addEventListener('input', () => { filter.text = normalise($('search').value); filtersChanged() })
$('search').addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && $('search').value) { event.preventDefault(); $('clear-search').click() }
})
$('clear-search').addEventListener('click', () => { $('search').value = ''; filter.text = ''; filtersChanged(); $('search').focus() })
$('year-from').addEventListener('change', () => setYears($('year-from').value, filter.to))
$('year-to').addEventListener('change', () => setYears(filter.from, $('year-to').value))
// A thumb pushed past the other one pushes it along.
$('range-from').addEventListener('input', () => setYears($('range-from').value, Math.max(filter.to, $('range-from').value)))
$('range-to').addEventListener('input', () => setYears(Math.min(filter.from, $('range-to').value), $('range-to').value))
$('reset-years').addEventListener('click', () => setYears(filter.min, filter.max))

$('opacity').addEventListener('input', () => setOpacity(Number($('opacity').value)))
$('basemap-opacity').addEventListener('input', setBasemapOpacity)
$('basemap').addEventListener('change', (event) => {
  basemap.remove()
  basemap = BASEMAPS[event.target.value].addTo(map)
  basemap.bringToBack()
  setBasemapOpacity()
})
$('markers').addEventListener('change', (event) => (event.target.checked ? markerLayer.addTo(map) : markerLayer.remove()))
$('home').addEventListener('click', () => map.fitBounds(NEW_JERSEY))
// Show all / Hide all act on the atlases in the list: the ones passing the filters, in this map view.
const setShown = (value) => { listed().forEach((atlas) => { atlas.shown = value }); renderList(); requestSync() }
$('show-all').addEventListener('click', () => setShown(true))
$('hide-all').addEventListener('click', () => setShown(false))
map.on('moveend zoomend resize', viewChanged)

window.explorer = { map, warpedMapLayer, loaded, get atlases() { return atlases } }   // for debugging from the console
start()
