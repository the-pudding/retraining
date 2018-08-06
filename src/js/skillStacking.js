const $chartSvg = d3.select('svg.scatter')
let viewportWidth = null;
let viewportHeight = null;
let isMobile = null;
let svgWidth = null;
let svgHeight = null;

let JOB_LABEL_MARGIN_LEFT = null;
const ALL_JOBS_STARTING_Y_LOCATION = 20;
let TWO_JOBS_SKILL_SPACING = null;
let ALL_JOBS_JOB_SPACING = null;

let XBUMP = null;
const TRANSITION_DURATION_SKILLS_DIFFERENCE = 500;
const JOB_STACKED_SKILL_DELAY = 3.67647059
const DIFFERENCE_RECT_HEIGHT = 6
const TIME_INTERVAL = 20;

let $devSkillCircles = null;
let $truckerSkillCircles = null;
let $skillSectionsText= null;
let $axisLines = null;
let $skillSectionsTextAllJobs = null;
let $skillDifferenceRects = null;
let $skillDifferenceRectsAllJobs = null;
let $truckerDeveloperXAxis = null;
let $introJobsCircles = null;
let $exampleSkillTitle = null;


let allData = null;
let allJobSkillsFlat = null;
let allJobSkillsGrouped = null;
let devAndTruckerSkills = null;
let scalesObject = {}

let $skillSections = null;
let $skillSectionsAllJobs = null;
let $skillItemsAllJobs = null;

let reverseTransitionTrigger__highlightSkillDifferences = false;
let reverseTransitionTrigger__twoJobsAllSkills = false;
let $chartTitle_main = null;
let $chartTitle_truckers = null;
let $chartTitle_and = null;
let $chartTitle_developers = null;


const fileNames = [
  "devs_and_truckers_skills","Choreographers","Dentists","Nurses",
  "Chiropractors","Farmers","Construction_Managers","Firefighters","Geographers","Embalmers",
  "Pipelayers","Podiatrists","Fabric_Patternmakers","Clergy","Makeup_Artists",
  "Family_Therapists","CEOs","Art_Directors","Interior_Designers","Craft_Artists",
  "Event_Planners","Veterinarians","Writers","Political_Scientists","Ship_Engineers",
  "Paramedics","Mathematicians","Florists","Travel_Guides","News_Analysts",
  "Musicians","Fitness_Trainers","Graphic_Designers","Childcare_Workers","Police_Officers",
  "Hairdressers","Journalists","Air_Traffic_Controllers","Dancers","Optometrists",
  "Physician_Assistants","Electricians","Ambulance_Drivers","Athletes","Skincare_Specialists",
  "Private_Cooks","Funeral_Attendants","Actors","Judges","Economists",
  "Historians","Dental_Assistants","Cobblers","Massage_Therapists","Millwrights",
  "Librarians","Maids","Bartenders","Dishwashers","Fast_Food_Cooks",
  "Barbers","Real_Estate_Agents","Proofreaders"
]

const numOfJobs = fileNames.length;

const pathData = 'assets/data/'
let files=[]
fileNames.forEach((fileName)=>{
  files.push(pathData+fileName + '.csv')
})

function resize() {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  isMobile = viewportWidth < 700? true : false;
}

function getRandom(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function setupData(devAndTruckerSkills,allJobSkillsRaw){

  let abrigedCount = 0;
  let arrayCount = 0;
  const NTH_ITEM= 2;
  const ALL_OTHER_ITEM_COUNT = 2000

  devAndTruckerSkills.forEach(skill=>{

    skill.difference = Math.abs(+skill.devs- +skill.truckers)

    if (arrayCount %  NTH_ITEM === 0){
      skill.abrigedNum = abrigedCount
      abrigedCount+=1;
    }
    else{skill.abrigedNum = ALL_OTHER_ITEM_COUNT}

    arrayCount += 1;
  })

  allJobSkillsRaw.forEach(job=>{
    job.forEach(skill=>{
      skill.difference = Math.abs(+skill.job_selected- +skill.job_compared)
    })
  })


  // Calculating xCoord offset for stacked bar chart, Devs and Truckes

  let i;
  let xSum=0;
  let stackPadding=1;

  for (i=0; i<devAndTruckerSkills.length; i++){
    devAndTruckerSkills[i]['xCoordStacked']=xSum
    xSum+=devAndTruckerSkills[i]['difference'] + stackPadding
  }


// Calculating xCoord offset for stacked bar chart, for all jobs

  allJobSkillsRaw.forEach(jobAndTruckerSkills=>{
    xSum=0;
    stackPadding=1;
    for (i=0; i<jobAndTruckerSkills.length; i++){
      jobAndTruckerSkills[i]['xCoordStacked']=xSum
      xSum+= +jobAndTruckerSkills[i]['difference'] + stackPadding
    }
  })

  // Concatenating all the CSVS for previously loaded jobs and making a new array
  // of objects from them, w/ each job name used as a key.

  allJobSkillsFlat = [].concat.apply([], allJobSkillsRaw);
  allJobSkillsGrouped = d3.nest()
    .key(d=>d.job_compared_name)
    .entries(allJobSkillsFlat)

  // abridging job skills array
  allJobSkillsGrouped = allJobSkillsGrouped.slice(0,39)

  let jobOrder = 0
  allJobSkillsGrouped.forEach(jobSkillGroup=>{
    jobSkillGroup.order = jobOrder;
    jobOrder+=1;
  })
}

function highlightSkill(d,i,nodes){

  const elType = $(this)[0].nodeName.toLowerCase();

  let $group = null;

  if(elType==='g'){
    $group = d3.select(nodes[i])
  }
  else if(elType==='text'){
    $group = d3.select(nodes[i]).parent()
  }


  $skillSections
    .st('opacity',0.3)



  // Opacity, group
  $group
    .st('opacity',1)

  // Circle stroke
  $group
    .selectAll('circle')
    .st('stroke-width',3)

  // Line width
  $group
    .select('line.skill-axis')
    .st('stroke-width',2)

  // Font weight and skill text color change
  $group
    .select('text')
    .st('font-weight',600)
    .st('opacity',1)


}

function removeHighlightSkill(d,i,nodes){

  $skillSectionsText
    .st('font-weight',400)
    .st('opacity',(d,i)=>{
      if(i%2===0){return 1}
      else{return 0.1}
    })

  $skillSections
    .st('opacity',1)

  // Circle stroke
  $skillSections
    .selectAll('circle')
    .st('stroke-width',2)

  // Line width
  $skillSections
    .selectAll('line.skill-axis')
    .st('stroke-width',1)

}

function setupScales(){
  svgWidth = $chartSvg.at('width')
  svgHeight = $chartSvg.at('height')

  TWO_JOBS_SKILL_SPACING = svgHeight/(devAndTruckerSkills.length+1)
  ALL_JOBS_JOB_SPACING = svgHeight/(allJobSkillsGrouped.length+3)

  // console.log("TWO_JOBS_SKILL_SPACING: "+TWO_JOBS_SKILL_SPACING);
  // console.log("ALL_JOBS_JOB_SPACING: "+ALL_JOBS_JOB_SPACING);

  const mobileAdjustmentWidth = 0.1
  const mobilePaddingPercentage = 0.35

  const widthPercentage = isMobile? 0.98 : 0.7;
  const heightPercentage = 0.7;

  const yMaxScaleValue = svgHeight * heightPercentage;
  const xMaxScaleValue = isMobile? svgWidth * (widthPercentage-mobileAdjustmentWidth) : svgWidth * widthPercentage;

  const xPadding = isMobile? mobilePaddingPercentage * svgWidth : (1-widthPercentage)*svgWidth;
  const yPadding = (1-heightPercentage)*svgHeight;

  scalesObject.xScale = d3.scaleLinear()
  	.domain([0,100])
  	.range([xPadding, xMaxScaleValue]);

  scalesObject.xScaleRectangle = d3.scaleLinear()
  	.domain([0,100])
  	.range([0, (xMaxScaleValue-xPadding)]);


  const xCoordsArray = []
  const xOffsetsForHorizontalBars = allJobSkillsFlat.map(d=> d.xCoordStacked)
  const maxSumBarWidth = d3.max(xOffsetsForHorizontalBars);
  const maxPartBarWidth= isMobile? maxSumBarWidth/200 : maxSumBarWidth/68;
  scalesObject.xScaleEuclidean = d3.scaleLinear()
    .domain([0,100])
    .range([0, maxPartBarWidth]);

  if(isMobile){JOB_LABEL_MARGIN_LEFT=10}
  else{JOB_LABEL_MARGIN_LEFT=60}

  XBUMP = isMobile? svgWidth*0.5 : 250;

}


function setupDOMElements(devAndTruckerSkills) {
  $chartTitle_main = d3.select('span.chart-title-pt1')
  $chartTitle_truckers = d3.select('span.chart-title-pt2')
  $chartTitle_and = d3.select('span.chart-title-pt3')
  $chartTitle_developers = d3.select('span.chart-title-pt4')

  $exampleSkillTitle = $chartSvg
    .select('text.example-skill-title')

  // Creating group elements for each skill, both for developers and for other jobs
  $skillSections = $chartSvg.selectAll('g.skill-section__two-jobs')
    .data(devAndTruckerSkills)
    .enter()
    .append('g.skill-section__two-jobs')
    .st('opacity',0)
    .at('transform', (d,i)=>{return 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (ALL_JOBS_STARTING_Y_LOCATION+(i*TWO_JOBS_SKILL_SPACING)) +')'});

  $skillSectionsAllJobs = $chartSvg.selectAll('g.all-jobs')
    .data(allJobSkillsGrouped)
    .enter()
    .append('g')
    .at('class',d=> 'all-jobs '+d.key)
    .st('opacity',0)

  $skillItemsAllJobs = $skillSectionsAllJobs.selectAll('g.skill-item')
    .data(d=>d.values)
    .enter()
    .append('g')
    .at('class',d=>'skill-item-'+d.skills.replace(/ /g,'_'))



  $axisLines = $skillSections
    .append('line.skill-axis')

  $skillSectionsTextAllJobs = $skillSectionsAllJobs
    .append("text.job-name")
    .st('font-weight',d=>{
      if(d.key==='Pipelayers'){return 600}
      else if (d.key==='CEOs'){return 600}
      else {return 400}
    })
    // .st('fill', d=>{
    //   if(d.key==='Pipelayers'){return '#EB5757'}
    //   else if (d.key==='CEOs'){return '#2F80ED'}
    //   else {return '#000000'}
    // })
    // console.log(allJobSkillsGrouped)


// Original bars signifying different skills
  $skillDifferenceRects = $skillSections.append('rect.skill-difference-axis')

  $skillDifferenceRectsAllJobs = $skillItemsAllJobs.append('rect.skill-difference-axis-all-jobs')

// Adding difference rectangles for devs and truckers

  $skillDifferenceRects
  .at('x', d=>{
    if (+d.devs>=+d.truckers){
      return scalesObject.xScale(+d.truckers)
    }
    else{
      return scalesObject.xScale(+d.devs)
    }
    })
  .at('y', `${(-DIFFERENCE_RECT_HEIGHT)}` )
  .at('width',d=>{
    return scalesObject.xScaleRectangle(d.difference);
  })
  .at('height', DIFFERENCE_RECT_HEIGHT)
  .st('fill','#E530BE')
  .st('opacity',0)

  $skillDifferenceRectsAllJobs
    .at('x',d=> scalesObject.xScaleEuclidean(d.xCoordStacked))
    .at('width',d=> scalesObject.xScaleEuclidean(d.difference))
    .st('fill','#E530BE')
    .at('transform',`translate(${XBUMP},${-DIFFERENCE_RECT_HEIGHT-1})`)
    .at('height', DIFFERENCE_RECT_HEIGHT)
    .on('mouseenter',d=>console.log(d.skills))
    // .st('opacity',0)


  $skillSectionsAllJobs
    .at('transform',(d,i)=>{
      return 'translate(0,'+(3*ALL_JOBS_STARTING_Y_LOCATION +(i*ALL_JOBS_JOB_SPACING))+')'
  })


  $devSkillCircles = $skillSections
    .append('circle.devs-skill-circle')

  $truckerSkillCircles = $skillSections
    .append('circle.truckers-skill-circle')

  $skillSectionsText= $skillSections
    .append("text.skill-name")

  $truckerDeveloperXAxis = $chartSvg
    .selectAll('.intro-x-axis')

  $introJobsCircles = $chartSvg
    .selectAll('.trucker-developer-groups')
}

function setupAnnotations(){

  const pipelayerCoords = {};
  const ceosCoords = {};
  // const clergyCoords = {};
  // const ambulanceDriversCoords = {};

  const data_Pipelayers = allJobSkillsGrouped.filter(job=>job.key==='Pipelayers')
  const data_CEOs = allJobSkillsGrouped.filter(job=>job.key==='CEOs')
  // const data_Clergy = allJobSkillsGrouped.filter(job=>job.key==='Clergy')
  // const data_AmbulanceDrivers = allJobSkillsGrouped.filter(job=>job.key==='Ambulance_Drivers')

  const tmp =devAndTruckerSkills.filter(skill=>skill.key==='Fine Arts')
  // console.log(devAndTruckerSkills);

  const skillNumber = data_Pipelayers[0]['values'].length-1
  const MARGIN_TOP = 3*ALL_JOBS_STARTING_Y_LOCATION;

  pipelayerCoords.xCoord = XBUMP+scalesObject.xScaleEuclidean(data_Pipelayers[0]['values'][skillNumber]['xCoordStacked'])
  ceosCoords.xCoord = XBUMP+scalesObject.xScaleEuclidean(data_CEOs[0]['values'][skillNumber]['xCoordStacked'])
  // clergyCoords.xCoord = XBUMP+scalesObject.xScaleEuclidean(data_Clergy[0]['values'][skillNumber]['xCoordStacked'])
  // ambulanceDriversCoords.xCoord = XBUMP+scalesObject.xScaleEuclidean(data_AmbulanceDrivers[0]['values'][skillNumber]['xCoordStacked'])

  pipelayerCoords.yCoord = +data_Pipelayers[0].order*ALL_JOBS_JOB_SPACING + MARGIN_TOP;
  ceosCoords.yCoord = +data_CEOs[0].order*ALL_JOBS_JOB_SPACING + MARGIN_TOP;
  // clergyCoords.yCoord = +data_Clergy[0].order*ALL_JOBS_JOB_SPACING + MARGIN_TOP;
  // ambulanceDriversCoords.yCoord = +data_AmbulanceDrivers[0].order*ALL_JOBS_JOB_SPACING + MARGIN_TOP;

  const annoStartingCoord = svgWidth-svgWidth*0.15

  const differentAnnotationYBump = 40;
  const differentAnnotationXBump = annoStartingCoord-ceosCoords.xCoord;
  const similarAnnotationYBump = -30
  const similarAnnotationXBump = annoStartingCoord - pipelayerCoords.xCoord;

  let annoConnector="arrow";

  const mostDifferentJobAnno = [
    {
		  note: {label:'Among these jobs, CEOs and truck drivers have the greatest gap between their skills',title:'Different',wrap:150,align:"middle",},
			// connector:{end:annoConnector},
    			x:ceosCoords.xCoord,y:ceosCoords.yCoord,dx:differentAnnotationXBump,dy:differentAnnotationYBump,subject: {radius: 15,radiusPadding: 5}
  		}
    ];

  const mostSimilarJobAnno = [
    {
		  note: {label:'One of the largest skill overlaps for truck drivers occurs with pipelayers',title:'Similar',wrap:150,align:"middle",},
			// connector:{end:annoConnector},
    			x:pipelayerCoords.xCoord,y:pipelayerCoords.yCoord,dx:similarAnnotationXBump,dy:similarAnnotationYBump,subject: {radius: 15,radiusPadding: 5}
  		}
    ];

  const makeMostDifferentJobAnno = d3.annotation()
  			.type(d3.annotationCalloutCircle)
  			.annotations(mostDifferentJobAnno)
  			// .editMode(true)


  const makeMostSimilarJobAnno = d3.annotation()
  			.type(d3.annotationCalloutCircle)
  			.annotations(mostSimilarJobAnno)
  			// .editMode(true)

  $chartSvg.append("g")
  			.attr("transform","translate("+0+","+0+")")
  			.attr("class","annotation-group-different annotation-group-stacked")
  			.call(makeMostDifferentJobAnno)

  $chartSvg.append("g")
  			.attr("transform","translate("+0+","+0+")")
  			.attr("class","annotation-group-similar annotation-group-stacked")
  			.call(makeMostSimilarJobAnno)
}

function updateStep(step){
  if(step==='images-two-jobs-two-skills-developers'){
    reverseTransitionTrigger__twoJobsAllSkills = false;
  }
  if(step==='images-two-jobs-all-skills'){

    $chartSvg
      .select('g.legend__wages')
      .st('opacity',0)


		$chartSvg
			.selectAll('g.legend-job-number')
			.st('opacity',0)

    $chartSvg
      .selectAll('g.annotation-group-stacked')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.anno-group')
      .st('opacity',0)

    $chartSvg
      .selectAll('text.axis-label')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.trucker-developer-groups')
      .st('opacity',0)

    $chartSvg
      .selectAll('circle.job')
      .classed('invisible',true)

    $chartSvg
      .selectAll('g.similarity-annotation')
      .classed('invisible',true)

    $truckerDeveloperXAxis
      .classed('invisible',false)

    const CIRCLES_REVERSE_FADEIN_DELAY=250
    const CIRCLES_REVERSE_FADEIN_DURATION=200
    const delayVar = 1000

    const truckerDeveloperXAxisFunction = d3.axisTop(scalesObject.xScale).ticks(1).tickFormat(function(d) { return d + '%' } );

    const TruckerDevelopers_transitionVertical_duration = 400;

    $truckerDeveloperXAxis
      .transition()
      .duration(TruckerDevelopers_transitionVertical_duration)
      .call(truckerDeveloperXAxisFunction)
      .at('transform', (d,i)=>{return 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (ALL_JOBS_STARTING_Y_LOCATION+(0*TWO_JOBS_SKILL_SPACING)) +')'})

    $truckerDeveloperXAxis
      .selectAll('.intro-x-axis .tick line')
      .st('opacity',0)

    $exampleSkillTitle
      .st('opacity',0)
      .classed('invisible',true)

    $chartTitle_main
      .text('Importance of skills for ')

    $chartTitle_truckers
      .text('truckers ')
      .classed('red-text',true)
      .st('display','inline-block')

    $chartTitle_and
      .text('and ')
      .st('display','inline-block')

    $chartTitle_developers
      .text('developers')
      .classed('blue-text',true)
      .st('display','inline-block')


    d3.select('.chart-title-div')
      .st('visibility','visible')


    $skillDifferenceRects
      .transition()
      .duration(250)
      .st('opacity',0)

    $devSkillCircles
      .transition()
      .delay(()=>{
        if(reverseTransitionTrigger__twoJobsAllSkills===true){return CIRCLES_REVERSE_FADEIN_DELAY}
        else {return TruckerDevelopers_transitionVertical_duration}
      })
      .duration((d,i)=>{
        if(reverseTransitionTrigger__twoJobsAllSkills===true){return CIRCLES_REVERSE_FADEIN_DURATION}
        else {return i*TIME_INTERVAL}
      })
      .st('opacity',1)

    $truckerSkillCircles
      .transition()
      .delay(()=>{
        if(reverseTransitionTrigger__twoJobsAllSkills===true){return CIRCLES_REVERSE_FADEIN_DELAY}
        else {return TruckerDevelopers_transitionVertical_duration}
      })
      .duration((d,i)=>{
        if(reverseTransitionTrigger__twoJobsAllSkills===true){return CIRCLES_REVERSE_FADEIN_DURATION}
        else {return i*TIME_INTERVAL}
      })
      .st('opacity',1)

    // Getting rid of intro axes
    // $truckerDeveloperXAxis
      // .st('opacity',0)

    $introJobsCircles
      .st('opacity',0)

    $devSkillCircles.at('cx',(d)=> scalesObject.xScale(d.devs))
      .at('cy',-1)
      .at('r',5)
      .on('mouseenter')

    $truckerSkillCircles.at('cx',(d)=>scalesObject.xScale(d.truckers))
      .at('cy',-1)
      .at('r',5)

    $skillSections
      .at('transform', (d,i)=>{return 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (ALL_JOBS_STARTING_Y_LOCATION+(i*TWO_JOBS_SKILL_SPACING)) +')'})
      .transition()
      .delay(()=>{
        if(reverseTransitionTrigger__twoJobsAllSkills===false){return TruckerDevelopers_transitionVertical_duration}
        else {return 0}
      })
      .duration((d,i)=>{
        return i*TIME_INTERVAL
      })
      .st('opacity',1)


    $skillSectionsText.text(d=>{
      if(isMobile){return d.skills.slice(0,12)+'...'}
      else{return d.skills}
    })
      .st('text-anchor','right')
      .st('opacity',(d,i)=>{
        if(i%2===0){return 1}
        else{return 0.1}
      })

    $axisLines.at('x1',()=>scalesObject.xScale(0))
      .at('y1',-1)
      .at('x2',()=>scalesObject.xScale(100))
      .at('y2',-1)
      .at('stroke-width', 1)
      .st('stroke','black')
      .st('opacity',(d,i)=>{
        if (d.skills==="Programming"){return 0}
        else return 1
      })

   $skillSectionsTextAllJobs.at('transform','translate('+JOB_LABEL_MARGIN_LEFT+',0)')
      .text(d=>d.key.replace(/_/g,' '))
      .st('text-anchor','right')
      .st('opacity', 0)


  $truckerDeveloperXAxis
    .selectAll('.intro-x-axis .tick text')
    .st('font-size','12px')
    .st('opacity',1)
    .at('y',0)

    reverseTransitionTrigger__twoJobsAllSkills=true;


  }
  else if(step==='images-two-jobs-highlight-skill-differences'){

    $chartSvg
      .select('g.legend__wages')
      .st('opacity',0)

		$chartSvg
			.selectAll('g.legend-job-number')
			.st('opacity',0)

    $chartSvg
      .selectAll('g.annotation-group-stacked')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.anno-group')
      .st('opacity',0)

    $chartSvg
      .selectAll('text.axis-label')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.trucker-developer-groups')
      .st('opacity',0)

    $chartSvg.selectAll('circle.job')
      .classed('invisible',true)

    $chartSvg.selectAll('circle.job')
      .classed('invisible',true)

    $chartSvg
      .selectAll('g.similarity-annotation')
      .classed('invisible',true)

    $truckerDeveloperXAxis
      .classed('invisible',false)

    $exampleSkillTitle
      .classed('invisible',true)

    const RECTS_FADEIN_DELAY=250
    const delayVar = numOfJobs*TIME_INTERVAL * 0.6

    $truckerDeveloperXAxis
      .transition()
      .delay(delayVar)
      .st('opacity',1)

    d3.selectAll('.secondary-title-stacking')
      .st('display','none')

    $chartTitle_main
      .text('Skill differences between truckers & developers')


    // const CIRCLES_FADEIN_DURATION=350

    // ACCOUNTING FOR REVERSE:
    // Removing annotations
    $chartSvg
      .selectAll('g.annotation-group-different')
      .transition()
      .st('visibility','hidden')

    $chartSvg
      .selectAll('g.annotation-group-similar')
      .transition()
      .st('visibility','hidden')

    $skillSections
      .st('opacity',1)
      .transition()
      .delay( ()=>{
        if (reverseTransitionTrigger__highlightSkillDifferences===true){return delayVar}
        else {return 0}
      })
      // .duration(250)
      .at('transform', (d,i)=>{return 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (ALL_JOBS_STARTING_Y_LOCATION+(i*TWO_JOBS_SKILL_SPACING)) +')'});

      $skillSectionsText
        .transition()
        .delay( ()=>{
          if (reverseTransitionTrigger__highlightSkillDifferences===true){return delayVar}
          else {return 0}
        })
        .text(d=>{
          if(isMobile){return d.skills.slice(0,12)+'...'}
          else{return d.skills}
        })
        .st('text-anchor','right')
        // .at('transform','translate('+JOB_LABEL_MARGIN_LEFT+ ',0)')
        .st('opacity',(d,i)=>{
          if(i%2===0){return 1}
          else{return 0.1}
        })
        .at('transform','translate('+0+ ',0)')

      $axisLines
        .at('x1',()=>scalesObject.xScale(0))
        .at('y1',(-DIFFERENCE_RECT_HEIGHT/2))
        .at('x2',()=>scalesObject.xScale(100))
        .at('y2',(-DIFFERENCE_RECT_HEIGHT/2))
        .at('stroke-width', 1)
        .st('stroke','black')
        .transition()
        .delay( ()=>{
          if (reverseTransitionTrigger__highlightSkillDifferences===true){return delayVar}
          else {return 0}
        })
        .st('opacity',(d,i)=>{
          if (d.skills==="Programming"){return 0}
          else return 1
        })

     $skillSectionsTextAllJobs
        .text(d=>d.key.replace(/_/g,' '))
        .st('text-anchor','right')
        .transition()
        .duration((d,i)=>{
          return (numOfJobs*TIME_INTERVAL) - i*TIME_INTERVAL;
        })
        .st('opacity', 0)

    $skillDifferenceRects
      .transition()
      .delay( ()=>{
        if (reverseTransitionTrigger__highlightSkillDifferences===true){return delayVar}
        else {return RECTS_FADEIN_DELAY}
      })
      .duration(500)
      .st('opacity',1)
      .at('x', d=>{
        if (+d.devs>=+d.truckers){
          return scalesObject.xScale(+d.truckers)
        }
        else{
          return scalesObject.xScale(+d.devs)
        }
        })
      .at('y', (-DIFFERENCE_RECT_HEIGHT) )
      .at('width',d=>{
        return scalesObject.xScaleRectangle(d.difference);
      })
      .at('height', DIFFERENCE_RECT_HEIGHT)
      .at('transform','translate(0,0)')
      .st('fill','#E530BE')

    $devSkillCircles
      .transition()
      .st('opacity',0)

    $truckerSkillCircles
      .transition()
      .st('opacity',0)

    $skillSectionsAllJobs
      .transition()
      // .delay(numOfJobs*TIME_INTERVAL)
      .duration((d,i)=>{
        return (numOfJobs*TIME_INTERVAL) - i*TIME_INTERVAL;
      })
      .st('opacity',0)

    reverseTransitionTrigger__highlightSkillDifferences = false;
  }
  else if(step==='images-two-jobs-stacked-skills'){

    $chartSvg
      .selectAll('g.annotation-group-stacked')
      .st('opacity',1)

    $chartSvg
      .select('g.legend__wages')
      .st('opacity',0)

		$chartSvg
			.selectAll('g.legend-job-number')
			.st('opacity',0)

    $chartSvg
      .selectAll('g.anno-group')
      .st('opacity',0)

    $chartSvg
      .selectAll('text.axis-label')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.trucker-developer-groups')
      .st('opacity',0)

    $chartSvg
      .selectAll('g.similarity-annotation')
      .classed('invisible',true)

    $truckerDeveloperXAxis
			.classed('invisible',false)

    $exampleSkillTitle
      .classed('invisible',true)

    $truckerDeveloperXAxis
      .st('opacity',0)

    $chartSvg
      .selectAll('g.similarity-annotation')
      .st('opacity',0)

    d3.selectAll('span.secondary-title-remaining')
      .st('display','none')

    $chartSvg
      .selectAll('.axis-label')
      .st('opacity',0)

    $chartSvg.selectAll('circle.job')
      .classed('invisible',true)
      .st('opacity',0)
      .on('mouseenter',()=>{})


    d3.selectAll('span.secondary-title-stacking')
      .st('display','none')

    $chartTitle_main
      .transition()
      .text("Skills differences between truckers & other jobs")

    reverseTransitionTrigger__highlightSkillDifferences = true;

      // Removing axis line visibility in each skill group for trucker/dev
    $axisLines
      .transition()
      .st('opacity',0)

    // Removing developer skill and trucker skill circles from view
    $devSkillCircles
      .transition()
      .st('opacity',0)

    $truckerSkillCircles
      .transition()
      .st('opacity',0)



     // ACCOUNTING FOR REVERSE:
     // Moving job skill groups back to appropriate place

     // AND

     // waiting 450ms before fading each job's skill difference section, each slower than the next by 50ms
    $skillSectionsAllJobs
      .at('transform',(d,i)=>{
        return 'translate(0,'+(3*ALL_JOBS_STARTING_Y_LOCATION+ i*ALL_JOBS_JOB_SPACING)+')'
    })
      .transition()
      .delay(450)
      .duration((d,i)=>i*TIME_INTERVAL)
      .st('opacity',1)

    // Waiting 450ms before fading each job's title in
    $skillSectionsTextAllJobs
      .transition()
      .delay(450)
      .st('opacity',1)

      // Adding title of "Developer" to the trucker/dev skill difference rectangle group
    $skillSectionsText
      .transition()
      .st('opacity',0)
      .text((d,i)=> {
        if (i===devAndTruckerSkills.length-1){return 'Developers'}
        else return ''
      })
      // .at('transform','translate('+JOB_LABEL_MARGIN_LEFT+ ',0)')
      .at('transform','translate('+JOB_LABEL_MARGIN_LEFT+ ',0)')
      .transition()
      .st('opacity',1)

  // Transitioning trucker/dev skill difference rects to appropriate place

    $skillDifferenceRects
      .transition()
      // .delay(1000)
      .duration(TRANSITION_DURATION_SKILLS_DIFFERENCE)
      .at('x',d=> scalesObject.xScaleEuclidean(d.xCoordStacked))
      .at('width',d=> scalesObject.xScaleEuclidean(d.difference))
      .at('transform',(d,i)=>{
        return 'translate('+XBUMP+',0)'
      })
      .at('height',DIFFERENCE_RECT_HEIGHT)

    const yTransform = 3*ALL_JOBS_STARTING_Y_LOCATION - ALL_JOBS_JOB_SPACING

    $skillSections
      .transition()
      .delay((d,i)=>i*JOB_STACKED_SKILL_DELAY)
      .st('opacity',1)
      .at('transform',()=> 'translate('+0+','+ yTransform +')')

    $skillDifferenceRects
      .on('mouseenter', d=>console.log(d.skills))


    $chartSvg
      .selectAll('g.annotation-group-different')
      .transition()
      .delay(450)
      .st('visibility','visible')

    $chartSvg
      .selectAll('g.annotation-group-similar')
      .transition()
      .delay(450)
      .st('visibility','visible')

  }

}

function populateRawSkills(allJobSkillsRaw, response){
  // Note: i=1 here to exclude first entry in data loaded, which reprensents devs comparison
    let i;
    for (i=1;i<response.length;i++){
      allJobSkillsRaw.push(response[i])
    }
}

function init() {
  return new Promise((resolve,reject)=>{

    d3.loadData(...files,(err,response)=>{
      if(err) reject()
      else{
      devAndTruckerSkills = response[0];
      let allJobSkillsRaw = []

      populateRawSkills(allJobSkillsRaw, response)

      resize()
      setupData(devAndTruckerSkills,allJobSkillsRaw)
      setupScales()
      setupDOMElements(devAndTruckerSkills)
      if(isMobile){}
      else{setupAnnotations()}
      resolve()
      }
    })

  })
}


export default {init, updateStep}
