const truckersDevelopers = [
 {'job':'Truckers',
   'automatability':0.79,
   'skillDeveloperScore':3,
   'skillDeveloperName':'Programming',
   'fill':'blue',
   'skillTruckerScore':72,
   'skillTruckerName':'Multilimb Coordination'},
 {'job':'Developers',
  'automatability':0.04,
  'skillDeveloperScore':75,
  'skillDeveloperName':'Programming',
  'fill':'magenta',
  'skillTruckerScore':0,
  'skillTruckerName':'Multilimb Coordination'},
 {'job':'Teachers',
  'automatability':0,
  'skillDeveloperScore':'',
  'skillDeveloperName':'',
  'fill':'',
  'skillTruckerScore':'',
  'skillTruckerName':''},
  {'job':'Telemarketers',
  'automatability':1,
  'skillDeveloperScore':'',
  'skillDeveloperName':'',
  'fill':'',
  'skillTruckerScore':'',
  'skillTruckerName':''}
]


let isMobile = null;

let svgWidth = null;
let svgHeight = null;

let widthPercentage  = null;
let heightPercentage = null;

const $chartContainer = d3.select("body")
  .select("figure.svg-container")

const $chartSvg = $chartContainer
  .select("svg.scatter")

const MIN_AUTOMATION = 0
const MAX_AUTOMATION = 1
const CIRCLE_RADIUS = 20;
const INIT_X_AXIS_PLACEMENT = 50;

const DIFFERENCE_RECT_HEIGHT = 3;

let viewportWidth =  null;
let viewportHeight = null;

let yAxisLabelMin = null;
let truckerDeveloperYAxis = null;
let introYAxisLocation = null;
let scalesObject = {}

let yMaxScaleValue = null;
let xMaxScaleValue = null;
let truckerDeveloperXAxisFunction = null;

let xPadding = null;
let yPadding = null;

let $jobCircles = null;
let jobsGroups = null;
// let $automatability_LABEL = null;
let $truckerDeveloperXAxis = null;
let jobsName_LABELS = null;
let jobNameLabel_margin_x = null;
let jobCircle_margin_x = null;
let jobNameLabel_margin_y = null;

let $exampleSkillTitle = null;

let reverseTransitionTrigger__twoJobstwoSkillsDevelopers = false;
//
// let annoConnector="arrow";
// const thisAnno = [
//   {
// 		note: {
// 			label:'annoText',
// 			title:'annoTitle',
// 			wrap:150,
// 			align:"middle",
// 			},
// 			connector:{
// 				end:annoConnector
// 			},
// 			x:100,
// 			y:100,
// 			dx:30,
// 			dy:-30
// 		}
//   ];
//
//
// const makeThis = d3.annotation()
// 			.type(d3.annotationLabel)
// 			.annotations(thisAnno)
// 			.editMode(true)
//
// $chartSvg.append("g")
// 			.attr("transform","translate("+100+","+100+")")
// 			.attr("class","annotation-group")
// 			.call(makeThis)


function setupCirclePatterns(data){

  const $defs = $chartSvg.append('defs');
  const patternsJoin = $defs
    .selectAll('pattern')
    .data(data)
    .enter()

  const $patterns = patternsJoin
    .append('pattern')
    .at("width", 2*CIRCLE_RADIUS)
    .at("height", 2*CIRCLE_RADIUS)
    .at('id',d=>{
      const jobNameNoSpaces = d.job.replace(/ /g, '_')
      return jobNameNoSpaces+'-img'
    })

  const $patternsImages=$patterns
    .append('image')
    .at("width", 2*CIRCLE_RADIUS)
    .at("height", 2*CIRCLE_RADIUS)
    .at("x",0)
    .at("y",0)
    .at("xlink:href",d=>{
      const jobNameNoSpaces = d.job.replace(/ /g, '_');
      return 'assets/data/circle-images/'+jobNameNoSpaces+'.png'
    })

}

function resize(){
  svgWidth = $chartSvg.at('width')
  svgHeight = $chartSvg.at('height')

  // console.log($chartSvg.at('width'));

  // console.log($('figure').height());

  viewportWidth =window.innerWidth;
  viewportHeight=window.innerHeight;

  isMobile = viewportWidth < 700? true : false;

  widthPercentage = 0.9;
  heightPercentage = 0.8;

  // console.log("resize!");
}

function setupScales(){

  const heightMiscElDiv = document.getElementById('misc-chart-elements-container').offsetHeight;
  const svgMaxSize = viewportHeight-heightMiscElDiv;

  yMaxScaleValue = svgMaxSize * heightPercentage;
  xMaxScaleValue = svgWidth * widthPercentage;

  xPadding = (1-widthPercentage)*svgWidth;
  yPadding = (1-heightPercentage)*svgHeight;

  scalesObject.yScale = d3.scaleLinear()
    .domain([MIN_AUTOMATION,MAX_AUTOMATION])
    .range([0+yPadding, yMaxScaleValue]);

  scalesObject.xScale = d3.scaleLinear()
		.domain([0,100])
		.range([0+xPadding, xMaxScaleValue]);

  if(isMobile){
    introYAxisLocation = svgWidth/2;
  }
  else {
    introYAxisLocation = svgWidth/2;
  }

}

function setupAxes(){

  const formatPercent = d3.format(".0%");
  const formatPercentv2 = d3.format("d");

  const truckerDeveloperYAxisFunction = d3.axisLeft(scalesObject.yScale).ticks(1).tickFormat(formatPercent);
  const truckerDeveloperXAxisFunction = d3.axisTop(scalesObject.xScale).ticks(1).tickFormat(formatPercentv2);

  const HORIZONTAL_BUMP=introYAxisLocation;
  const middleCoord = scalesObject.yScale(0.5);

  truckerDeveloperYAxis = $chartSvg.append("g.intro-y-axis")
    .attr("transform", "translate("+HORIZONTAL_BUMP+",0)")
    .call(truckerDeveloperYAxisFunction)
    .style('opacity',1)

  $truckerDeveloperXAxis = $chartSvg.append("g.intro-x-axis")
    .attr("transform", "translate("+0+","+middleCoord+")")
    .call(truckerDeveloperXAxisFunction)
    .style('opacity',0)

  $truckerDeveloperXAxis
    .select('path.domain')
    .at('transform',`translate(0,${-DIFFERENCE_RECT_HEIGHT/2})`)

  yAxisLabelMin = $chartSvg.append('text.y-axis-label.min')
    .at('x',introYAxisLocation)
    .at('y',yPadding/2)
    .st('fill', '#2F80ED')
    .st('text-anchor','middle')
    .text('SAFE JOBS' )

  const yAxisTitleBackground = $chartSvg.append('text.y-axis-label.title-background')
    .at('transform',`translate(${(introYAxisLocation*1.01)},${svgHeight/2}) rotate(270)`)
    .st('stroke', '#FFFFFF')
    .st('stroke-width',11)
    .st('text-anchor','middle')
    .text('AUTOMATION LIKELIHOOD %' )

  const yAxisTitle = $chartSvg.append('text.y-axis-label.title')
    .at('transform',`translate(${(introYAxisLocation*1.01)},${svgHeight/2}) rotate(270)`)
    .st('fill', '#6f6f6f')
    .st('text-anchor','middle')
    .text('AUTOMATION LIKELIHOOD %' )

  const yAxisLabelMax = $chartSvg.append('text.y-axis-label.max')
    .at('x',introYAxisLocation)
    .at('y',yMaxScaleValue+(yPadding/2))
    .st('fill', '#EB5757')
    .st('text-anchor','middle')
    .text('ENDANGERED JOBS')

}

function setupDOMElements(){

  setupAxes()

  const exampleTitleCoord = scalesObject.yScale(0.35);

  $exampleSkillTitle = $chartSvg
    .append('text.example-skill-title')
    .at('x',introYAxisLocation)
    .at('y',exampleTitleCoord)
    .text('Importance of skill: programming')
    // .st('text-anchor','middle')

  const truckerDeveloperJoin = $chartSvg.selectAll('circle.jobs-circles')
    .data(truckersDevelopers)
    .enter()

  jobsGroups = truckerDeveloperJoin
    .append('g.trucker-developer-groups')

  $jobCircles = jobsGroups.append('circle.intro-jobs-circles')
  const jobsAutomatability_LABELS = jobsGroups.append('text.intro-automatability-values')
  jobsName_LABELS = jobsGroups.append('text.intro-job-names')
  const jobsSkills_LABELS = jobsGroups.append('text.intro-job-skill-values')

  // $automatability_LABEL = $chartSvg.append('text.automatability-label')
// adding element text labels

  jobsAutomatability_LABELS.text(d=>d.automatability*100 + "%")
  jobsName_LABELS.text(d=>d.job)
  jobsSkills_LABELS.text(d=>d.skillTruckerScore)
  // $automatability_LABEL.text('automation likelihood')

  //setting initial opacity
  jobsGroups
    .at('transform', d=>{
      return 'translate('+introYAxisLocation+','+
                         +scalesObject.yScale(d.automatability)+')'
    })
    .style('opacity',d=> {
      if (d.job==="Teachers" || d.job==="Telemarketers"){return 1}
      else {return 0}
    })

  jobsSkills_LABELS
    .style('opacity',0)



  // INITIAL ELEMENT POSITIONING AND OPACITY SETTING

  jobCircle_margin_x = CIRCLE_RADIUS*2;
  jobNameLabel_margin_x = CIRCLE_RADIUS*4;
  jobNameLabel_margin_y = jobCircle_margin_x/10;

  $jobCircles
    .at('cx',jobCircle_margin_x)
    .at('r', CIRCLE_RADIUS)
    // .style('opacity',d=>d.job === 'Developers'? 0 : 1)
    .st('fill','#2F80ED')
    .st('fill', d=>{
      const jobNameNoSpaces = d.job.replace(/ /g,'_');
      return `url(#${jobNameNoSpaces}-img)`
    })

  jobsName_LABELS
    .at('x',jobNameLabel_margin_x)
    .at('y',jobNameLabel_margin_y)
    .st('text-anchor','right')

  jobsAutomatability_LABELS
    .at('x',-jobCircle_margin_x)
    .at('y',jobNameLabel_margin_y)
    .st('text-anchor','left')

  truckerDeveloperXAxisFunction= d3.axisTop(scalesObject.xScale).ticks(1).tickFormat(function(d) { return d + '%' } );



}

function updateStep(step){
  if(step==='all-automation'){
      jobsGroups
        .transition()
        .style('opacity', d=>d.job==='Truckers' || d.job==='Developers'? 0 : 1)
        .at('transform', d=>{
          return 'translate('+introYAxisLocation+','+
                             +scalesObject.yScale(d.automatability)+')'
        })

      $chartSvg.select('g.intro-y-axis')
        .selectAll('g.tick')
        .selectAll('text')
        .transition()
        .style('opacity', '0')
  }
  else if(step==='main-job-circle'){

      $chartSvg
        .selectAll('g.anno-group')
        .st('opacity',0)

      $chartSvg
        .selectAll('text.axis-label')
        .st('opacity',0)

      jobsGroups
        .transition()
        .style('opacity', d=>d.job==='Truckers'? 1 : 0)
        .at('transform', d=>{
          return 'translate('+introYAxisLocation+','+
                             +scalesObject.yScale(d.automatability)+')'
        })

      $chartSvg.select('g.intro-y-axis')
        .selectAll('g.tick')
        .selectAll('text')
        .transition()
        .style('opacity', '1')
  }
  else if(step==='main-job-automation'){

    $chartSvg
      .select('g.legend__wages')
      .st('opacity',0)


    $chartSvg
      .selectAll('g.anno-group')
      .st('opacity',0)

    $chartSvg
      .selectAll('text.axis-label')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.all-jobs')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.bisecting-automation-group')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.similarity-annotation')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.skill-section__two-jobs')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.scatter-y-axis')
      .st('opacity',0)

    $exampleSkillTitle
      .transition()
      .style('opacity',0)

    jobsName_LABELS
      .at('x',jobNameLabel_margin_x)
      .at('y',jobNameLabel_margin_y)
      .st('text-anchor','right')

    $chartSvg
      .selectAll('text.y-axis-label')
      .transition()
      .style('opacity',1)

    $chartSvg
      .selectAll('.intro-automatability-values')
      .transition()
      .style('opacity',1)

    $truckerDeveloperXAxis
      .transition()
      .style('opacity',0)

      $chartSvg.st('display', 'block')
      truckerDeveloperYAxis.style('opacity',1)

      jobsGroups
        .transition()
        .style('opacity', d=>d.job==='Truckers' || d.job==='Developers'? 1 : 0)
        .at('transform', d=>{
          return 'translate('+introYAxisLocation+','+
                             +scalesObject.yScale(d.automatability)+')'
        })

      $chartContainer
        .select('img.images-two-jobs-two-skills')
        .st('display','none')

      reverseTransitionTrigger__twoJobstwoSkillsDevelopers = false;
  }
  else if(step ==='images-two-jobs-two-skills-developers'){

    $chartSvg
      .select('g.legend__wages')
      .st('opacity',0)


    $chartSvg
      .selectAll('g.anno-group')
      .st('opacity',0)

    $chartSvg
      .selectAll('text.axis-label')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.all-jobs')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.similarity-annotation')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.scatter-y-axis')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.skill-section__two-jobs')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.bisecting-automation-group')
      .st('opacity',0)

    const numSkills = $chartSvg
      .selectAll('g.skill-section__two-jobs')
      .size()

    const TIME_INTERVAL = 15;
    const skillTitle_transitionReturn_delay=800;

    $exampleSkillTitle
      .classed('invisible',false)
      .transition()
      .delay(()=>{
        if(reverseTransitionTrigger__twoJobstwoSkillsDevelopers===true){return skillTitle_transitionReturn_delay}
        else {return 0}
      })
      .style('opacity',1)

    d3.select('.chart-title-div')
      .transition()
      .st('visibility','hidden')

    $chartSvg.selectAll('g.trucker-developer-groups')
      .classed('invisible', false)

      jobsName_LABELS
        .at('x',0)
        .at('y',jobCircle_margin_x)
        .st('text-anchor','start')

      $chartSvg
        .selectAll('.skill-section__two-jobs')
        .transition()
        .duration((d,i)=>{
          if(reverseTransitionTrigger__twoJobstwoSkillsDevelopers===true){
            return (numSkills*TIME_INTERVAL) - (i*TIME_INTERVAL);
          }
          else {return 250}
        })
        .style('opacity',0)

      const middleCoord = scalesObject.yScale(0.5);

      $chartSvg
        .selectAll('text.y-axis-label')
        .transition()
        .style('opacity',0)

      $chartSvg
        .selectAll('.intro-automatability-values')
        .transition()
        .style('opacity',0)

      const formatPercentv2 = d3.format("d");

      const TruckerDevelopers_transitionVertical_duration = 400;

      $truckerDeveloperXAxis
        .transition()
        .delay(()=>{
          if(reverseTransitionTrigger__twoJobstwoSkillsDevelopers===true){return TruckerDevelopers_transitionVertical_duration}
          else {return 0}
        })
        .duration(TruckerDevelopers_transitionVertical_duration)
        .call(truckerDeveloperXAxisFunction)
        .style('opacity',1)
        .at('transform',()=>{
          return 'translate(0,'+ middleCoord+')'
        })


      $truckerDeveloperXAxis
        .selectAll('.intro-x-axis .tick text')
        .at('y',0)

      // console.log("BUMP: " + ticksYBump);


      $truckerDeveloperXAxis
        .selectAll('g.tick')
        .selectAll('text')
        .transition()
        .st('text-anchor',(d,i)=>{
          if(d===0){return 'end'}
          else return 'start'
        })
        .at('y',()=> {return 0})
        .at('x', (d,i)=>{
          if(d===0){ return -2}
          else return 2
        })
        // .attr("transform", `translate(0,${-ticksYBump})`)
        .at('y',0)
        .st('font-size',()=>{
          if(isMobile){return 12}
          else{return 16}
        })


      truckerDeveloperYAxis
      .transition()
      .style('opacity',0)

      jobsGroups
      .transition()
      .delay(()=>{
        if (reverseTransitionTrigger__twoJobstwoSkillsDevelopers === true){return skillTitle_transitionReturn_delay}
        else {return 0}
      })
      // .duration(1000)
      .at('transform',d=>{
        return 'translate('+scalesObject.xScale(d.skillDeveloperScore)+','+middleCoord +')'
      })
      .style('opacity', d=>d.job==='Truckers' || d.job==='Developers'? 1 : 0)

      $chartSvg
        .selectAll('g.skill-section')
        .transition()
        .style('opacity',0)

    reverseTransitionTrigger__twoJobstwoSkillsDevelopers= true;

  }
  else if(step==='images-two-jobs-two-skills'){

      $chartSvg
        .selectAll('g.all-jobs')
        .st('opacity',0)

      $chartSvg
        .selectAll('g.similarity-annotation')
        .st('opacity',0)

      $chartSvg
        .selectAll('g.scatter-y-axis')
        .st('opacity',0)

      $chartSvg
        .selectAll('g.skill-section__two-jobs')
        .st('opacity',0)

      $chartSvg
        .selectAll('g.bisecting-automation-group')
        .st('opacity',0)

      const middleCoord = scalesObject.yScale(0.5);

      $chartSvg
        .selectAll('text.y-axis-label')
        .transition()
        .style('opacity',0)

      $chartSvg
        .selectAll('.intro-automatability-values')
        .transition()
        .style('opacity',0)


      $truckerDeveloperXAxis
        .transition()
        .style('opacity',1)
        .at('transform',()=>{
          return 'translate(0,'+ middleCoord+')'
        })

      truckerDeveloperYAxis
      .transition()
      .style('opacity',0)


      jobsGroups
      .transition()
      .at('transform',d=>{
        return 'translate('+scalesObject.xScale(d.skillTruckerScore)+','+middleCoord +')'
      })


  }
  else if(step==='images-two-jobs-many-skills'){

      $chartSvg
        .selectAll('g.similarity-annotation')
        .st('opacity',0)

      $chartSvg
        .selectAll('g.similarity-annotation')
        .classed('invisible',true)

      $chartContainer
        .select('img.images-two-jobs-two-skills')
        .st('display','none')

      $chartContainer
        .select('img.images-two-jobs-stacked-skills')
        .st('display','none')

       const $staticImageDiv = $chartContainer
        .select('img.images-two-jobs-many-skills')

      $staticImageDiv
        .st('display','block')
        .st('visibility','visible')
  }
  else if(step==='images-two-jobs-all-skills'){
    reverseTransitionTrigger__twoJobstwoSkillsDevelopers = true;
  }

}

function init(){

  return new Promise((resolve, reject) =>{

    setupCirclePatterns(truckersDevelopers)
    resize()
    setupScales()
    setupDOMElements()

    resolve()

  })
}


export default {init, updateStep}
