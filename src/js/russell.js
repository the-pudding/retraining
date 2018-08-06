// import * as d3 from 'd3'
import ScrollMagic from 'scrollmagic'
import loadData from './load-data'
import Chart from './chart'
import Split from './split'

let desktop = false
let viewportHeight = 0
let width = 0
let height = 0
let enterExitScene = null

const stepScenes = []

const bodySel = d3.select('body')
const containerSel = bodySel.select('[data-scroll]')
const graphicSel = containerSel.select('[data-graphic]')
const graphicContainerSel = graphicSel.select('[data-container]')
const proseSel = containerSel.select('[data-prose]')
const stepSel = containerSel.selectAll('[data-step]')
const introSel = bodySel.select('[data-intro]')
const textSel = bodySel.select('[data-text]')
const splitSel = textSel.selectAll('[data-split]')
const rpiSel = bodySel.select('#rpi-progress-bar-container')

const controller = new ScrollMagic.Controller({ refreshInterval: 0 })
const chart = Chart()
const splits = splitSel.nodes().map(() => Split())

function updateChart({ step, direction }) {
    chart
        .step(step)
        .direction(direction)

    graphicContainerSel.call(chart)
}

function setupStep() {
    const el = this
    const selection = d3.select(this)
    const triggerHook = 0.25


    const scene = new ScrollMagic.Scene({
        triggerElement: el,
        duration: el.offsetHeight,
        triggerHook,
    })

    scene
        .on('enter', (event) => {
            const step = selection.attr('data-step')
            const direction = event.scrollDirection === 'FORWARD' ? 'down' : 'up'
            selection.classed('is-active', true)
            updateChart({ step, direction })
        })
        .on('leave', (event) => {
            const step = selection.attr('data-step')
            const direction = event.scrollDirection === 'FORWARD' ? 'down' : 'up'
            selection.classed('is-active', false)
            if (step === 'average' && direction === 'up') {
                updateChart({ step: 'default', direction })
            }
        })
        .addTo(controller)

    stepScenes.push(scene)
}

function setupScroll() {
    stepSel.each(setupStep)

    // create a scene to toggle fixed position
    const proseEl = proseSel.node()

    enterExitScene = new ScrollMagic.Scene({
        triggerElement: proseEl,
        triggerHook: 0,
        duration: proseEl.offsetHeight - window.innerHeight,
        loglevel: 0,
    })

    enterExitScene
        .on('enter', (event) => {
            rpiSel.classed('is-visible', true)
            graphicSel.classed('is-fixed', true)
            const bottom = event.scrollDirection === 'REVERSE'
            if (bottom) graphicSel.classed('is-bottom', false)
        })
        .on('leave', (event) => {
            graphicSel.classed('is-fixed', false)
            const bottom = event.scrollDirection === 'FORWARD'
            rpiSel.classed('is-visible', bottom)
            if (bottom) graphicSel.classed('is-bottom', true)
        })
        .addTo(controller)

    // progress bar footer
    const footerScene = new ScrollMagic.Scene({
        triggerElement: d3.select('footer').node(),
        triggerHook: 0,
    })

    footerScene
        .on('enter', (event) => rpiSel.classed('is-visible', false))
        .on('leave', (event) => rpiSel.classed('is-visible', true))
        .addTo(controller)

    // transition text
    const transitionSel = d3.select('[data-transitionText]')
    const transitionsScene = new ScrollMagic.Scene({
        triggerElement: transitionSel.node(),
        triggerHook: 0.5,
    })

    transitionsScene
        .on('enter', (event) => {
            transitionSel.classed('is-active', true)
            transitionsScene.destroy()
        })
        .addTo(controller)
}



function resize() {
    updateDimensions()
    resizeScrollElements()
    resizeGraphic()
    resizeSplits()
}

function setupSplits(data) {
    splitSel.each(function() {
        const sel = d3.select(this)
        const category = sel.attr('data-category')
        const filtered = data.filter(d => d.category === category)
        sel.data(filtered)
    })
}

function setup(data) {
    chart.data(data[0])
    setupSplits(data[1])
    resize()
    setupScroll()
}

function init(rpi) {
    loadData()
        .then((result) => {
            setup(result)
            rpi.update()
        })
        .catch(err => console.log(err))
}

export default { init, resize }
