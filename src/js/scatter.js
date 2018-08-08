/* global d3 */

// Setting up data and data objects
const MAX_AUTO = 1;
const MIN_AUTO = 0;

let VERTICAL_LABEL_POSITION_SHORTER = null;
let VERTICAL_LABEL_POSITION_TALLER = null;
let LINE_HEIGHT_LEAST_SIMILAR_JOB = null;
let LINE_HEIGHT_MOST_SIMILAR_JOB = null;
let INTRO_Y_AXIS_LOCATION = null;
let X_AXIS_LABEL_HEIGHT = null;

const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
let svgWidth = null;
let xMaxScaleValue = null;
let widthPercentage = null;
let xPadding = null;

let isMobile = false;
let dropdownDefaultTrigger = false;

let yScale = null;
let yMaxScaleValue = null;
let yPadding = null;
const tooltipXScale = d3.scaleLinear().domain([0,100]);
let chartTooltipClosingTrigger = false;

let yAxisGroup = null;
let yAxisLabel = null;

let $truckerDeveloperXAxis = null;
let $automatability_LABEL = null;
let $jobCircles = null;
let $automatabilityBisectingGroup = null;

let $xAxisTextLabel = null;
let maxSimilarityLabel = null;
let minSimilarityLabel = null;
let $similarityAnnotations = null;

let scalesObject = {}

let $legendWages = null;
let $legendjobNumber = null;

// let allData = null;
let similarity = null;
let selectedJobData = null;
let selectedJobID=415;

let jobTooltip = null;
let jobSkillsContainer = null;

let $jobDropdownMenu = null;
let $similarityAxisLabel = null;


const defaultSceneSetting = {'cx':'',
														 'cy':'',
													 	 'r':'',
													 	 'fill':'',
													 	 'yScale':'',
													 	 'opacityCircles':'',
														 'opacityAnnotations':''
													 	 }


// Key objects for displaying values based on job id
const keyObjectJobName = {}
const keyObjectJobNumber = {}
const keyObjectJobAuto = {}
const keyObjectJobWage = {}
const keyObjectSkillName = {}

let crosswalk = null;
let crosswalkSkills = null;
let selectedJobSkills = [0,0,0,0,0]
let skills = []

// creating array of files to load
const pathData = 'assets/data/'
const fileNames = ['crosswalk_jobs','similarity','crosswalk_skills','skills']
let files = []
fileNames.forEach((category)=>{
	files.push(pathData+category+'.csv')
})

const $chartContainer = d3.select('figure.svg-container')
const $chartSvg = $chartContainer.select('svg.scatter')

let xScale = null;

const wageRatioArray = [0.2,0.5, 0.75, 0.9,1.1, 1.25, 2, 5]
const wageColors = ['#a50026','#d73027','#f46d43','#fee090','#e0f3f8','#74add1','#4575b4','#313695']

function setupAnnotations(){

	const ambulanceDriversCoords = {};
	const sailorsCoords = {};
	const electricalPowerLineInstallersAndRepairersCoords = {};
	const shipEngineersCoords = {};
	const electriciansCoords = {};
	const supervisorsCoords = {}

	const aD_id = 218;
	const s_id = 445;
	const ePLIAR_id = 161;
	const sE_id = 125;
	const e_id = 187;
	const sup_id = 194;

	const auto_ambulanceDrivers = keyObjectJobAuto[aD_id]
	const auto_sailors = keyObjectJobAuto[s_id]
	const auto_electricalPowerLineInstallersAndRepairers = keyObjectJobAuto[ePLIAR_id]
	const auto_shipEngineers = keyObjectJobAuto[sE_id]
	const auto_electricians = keyObjectJobAuto[e_id]
	const auto_supervisors = keyObjectJobAuto[sup_id]

	const similarity_ambulanceDrivers = selectedJobData.filter(job=>+job.id_compared===+aD_id)
	const similarity_sailors = selectedJobData.filter(job=>+job.id_compared===+s_id)
	const similarity_electricalPowerLineInstallersAndRepairers = selectedJobData.filter(job=>+job.id_compared===+ePLIAR_id)
	const similarity_shipEngineers = selectedJobData.filter(job=>+job.id_compared===+sE_id)
	const similarity_electricians = selectedJobData.filter(job=>+job.id_compared===+e_id)
	const similarity_supervisors = selectedJobData.filter(job=>+job.id_compared===+sup_id)


	ambulanceDriversCoords.xCoord = xScale(+similarity_ambulanceDrivers[0].similarity)
	sailorsCoords.xCoord = xScale(+similarity_sailors[0].similarity)
	// electricalPowerLineInstallersAndRepairersCoords.xCoord = xScale(similarity_electricalPowerLineInstallersAndRepairers[0].similarity)
	shipEngineersCoords.xCoord = xScale(similarity_shipEngineers[0].similarity)
	electriciansCoords.xCoord = xScale(similarity_electricians[0].similarity)
	supervisorsCoords.xCoord = xScale(similarity_supervisors[0].similarity)

	yScale.domain([0,1])
	sailorsCoords.yCoord = yScale(+auto_sailors)

	yScale.domain([0,0.79])
	ambulanceDriversCoords.yCoord = yScale(+auto_ambulanceDrivers)
	// electricalPowerLineInstallersAndRepairersCoords.yCoord = yScale(auto_electricalPowerLineInstallersAndRepairers)
	shipEngineersCoords.yCoord = yScale(auto_shipEngineers)
	electriciansCoords.yCoord = yScale(auto_electricians)
	supervisorsCoords.yCoord = yScale(auto_supervisors)


	const ambulance_AnnotationYBump = -40;
	const ambulance_AnnotationXBump = 5

	const sailors_AnnotationYBump = -40;
	const sailors_AnnotationXBump = 0

	const powerline_AnnotationYBump = -15;
	const powerline_AnnotationXBump = 15

	const ship_AnnotationYBump = -15;
	const ship_AnnotationXBump = 0;

	const electrician_AnnotationYBump = -30;
	const electrician_AnnotationXBump = 30

	const supervisors_AnnotationYBump = 30;
	const supervisors_AnnotationXBump = 30

	let annoConnector="arrow";

	const ambulanceAnno = [
		{note: {title:'Ambulance Drivers',wrap:100,align:"middle",},
			connector:{end:annoConnector},
    			x:ambulanceDriversCoords.xCoord,y:ambulanceDriversCoords.yCoord,dx:ambulance_AnnotationXBump,dy:ambulance_AnnotationYBump
  		}
	];

	const sailorsAnno = [
		{note: {title:'Sailors',wrap:100,align:"middle",},
			connector:{end:annoConnector},
    			x:sailorsCoords.xCoord,y:sailorsCoords.yCoord,dx:sailors_AnnotationXBump,dy:sailors_AnnotationYBump
  		}
	];

	const shipEngineersAnno = [
		{note: {title:'Ship Engineers',wrap:100,align:"middle",},
			connector:{end:annoConnector},
    			x:shipEngineersCoords.xCoord,y:shipEngineersCoords.yCoord,dx:ship_AnnotationXBump,dy:ship_AnnotationYBump
  		}
	];

	const electriciansAnno = [
		{note: {title:'Electricians',wrap:100,align:"middle",},
			connector:{end:annoConnector},
			x:electriciansCoords.xCoord,y:electriciansCoords.yCoord,dx:electrician_AnnotationXBump,dy:electrician_AnnotationYBump
		}
	];

	const supervisorsAnno = [
		{note: {title:'Construction Supervisors',wrap:100,align:"middle",},
			connector:{end:annoConnector},
			x:supervisorsCoords.xCoord,y:supervisorsCoords.yCoord,dx:supervisors_AnnotationXBump,dy:supervisors_AnnotationYBump
		}
	];


	const makeAmbulanceJobAnno = d3.annotation()
  			.type(d3.annotationCallout)
  			.annotations(ambulanceAnno)

	const makeSailorsJobAnno = d3.annotation()
  			.type(d3.annotationCallout)
  			.annotations(sailorsAnno)

	const makeShipEngineersJobAnno = d3.annotation()
  			.type(d3.annotationCallout)
  			.annotations(shipEngineersAnno)

	const makeElectriciansJobAnno = d3.annotation()
  			.type(d3.annotationCallout)
  			.annotations(electriciansAnno)

	const makeSupervisorsJobAnno = d3.annotation()
		.type(d3.annotationCallout)
		.annotations(supervisorsAnno)



	$chartSvg.append("g")
  			// .attr("transform",`translate("${0}","${-30}")`)
  			.attr("class","anno-group-ambulance anno-group")
  			.call(makeAmbulanceJobAnno)


	$chartSvg.append("g")
	// .attr("transform",`translate("${0}","${-30}")`)
		.attr("class","anno-group-sailors anno-group")
		.call(makeSailorsJobAnno)

	$chartSvg.append("g")
	// .attr("transform",`translate("${0}","${-30}")`)
		.attr("class","anno-group-shipengineers anno-group")
		.call(makeShipEngineersJobAnno)

	$chartSvg.append("g")
	// .attr("transform",`translate("${0}","${-30}")`)
		.attr("class","anno-group-electricians anno-group anno-group-final")
		.call(makeElectriciansJobAnno)

	$chartSvg.append("g")
	// .attr("transform",`translate("${0}","${-30}")`)
		.attr("class","anno-group-supervisors anno-group anno-group-final")
		.call(makeSupervisorsJobAnno)

	$chartSvg
		.selectAll('g.anno-group')
		.st('opacity',0)

}

function numberWithCommas(x){
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function selectJobData(data, selectedJobID){
	const selectedJobDataAllJobs = data.filter(item=> +item.id_selected === +selectedJobID)
	const selectedJobData = selectedJobDataAllJobs.filter(item=> +item.id_compared != +item.id_selected)
	return selectedJobData
}

function setupXScale(selectedJobData){
	svgWidth = $chartSvg.at('width')
	widthPercentage = 0.9;
	xMaxScaleValue = svgWidth * widthPercentage;
	xPadding = isMobile? (1-widthPercentage+0.1)*svgWidth:(1-widthPercentage)*svgWidth;

	const xScale = d3.scaleLinear()
		.domain(d3.extent(selectedJobData, d=> d.similarity))
		.range([0+xPadding, xMaxScaleValue]);
	return xScale;
}

function compare(a,b) {
	if (a.imp < b.imp)
		return 1;
	if (a.imp > b.imp)
		return -1;
	return 0;
}

function compareJobNames(a,b) {
	if (a.job_name < b.job_name)
		return -1;
	if (a.job_name > b.job_name)
		return 1;
	return 0;
}


function findLeastSimilarJob(selectedJobData){
	const leastSimilarJobValue = d3.min(selectedJobData, d=> d.similarity);
	const leastSimilarJob = selectedJobData.filter(job=>job.similarity===leastSimilarJobValue)
	return leastSimilarJob;
}

function findMostSimilarJob(selectedJobData){
	const mostSimilarJobValue = d3.max(selectedJobData, d=> d.similarity);
	const mostSimilarJob = selectedJobData.filter(job=>job.similarity===mostSimilarJobValue)
	return mostSimilarJob;
}


function formatCrosswalk(crosswalk){
	crosswalk.forEach((item)=>{
		item.id    = +item.id;
		item.auto  = +item.auto;
		item.wage  = +item.wage;
		item.number= +item.number;
	})
}

function formatSimilarityValues(similarity){
	similarity.forEach((item)=>{
		item.similarity = +item.similarity;
		item.id_compared= +item.id_compared;
		item.id_selected= +item.id_selected;
	})
}

function formatCrosswalkSkills(crosswalkSkills){
	crosswalkSkills.forEach(item=>{
		item.skill_id= +item.skill_id
	})
}

function formatTopSkillsByJob(skills){
	skills.forEach(item=>{
		item.id_selected= +item.id_selected;
		item.imp        = +item.imp;
		item.skill_id   = +item.skill_id;
		item.rank       = +item.rank;
	})
}


function keySetupJobName(crosswalk, keyObject){
	crosswalk.forEach(job=>{
		keyObject[job.id]=job.job_name;
	})
}

function keySetupJobNumber(crosswalk, keyObject){
	crosswalk.forEach(job=>{
		keyObject[job.id]=job.number;
	})
}

function keySetupJobAutomation(crosswalk, keyObject){
	crosswalk.forEach(job=>{
		keyObject[job.id]=job.auto;
	})
}

function keySetupJobWage(crosswalk, keyObject){
	crosswalk.forEach(job=>{
		keyObject[job.id]=job.wage;
	})
}

function keySetupJobSkills(crosswalkSkills, keyObject){
	crosswalkSkills.forEach(skill=>
		keyObject[skill.skill_id]=skill.skill
	)
}


function setupScales(){


	scalesObject.radiusScale= d3.scaleSqrt()
		.domain([0,d3.max(crosswalk, (d)=>{return d.wage})])
		.range([2,8])

	scalesObject.colorScale = d3.scaleLinear()
		.domain(wageRatioArray)
		.range(wageColors)

	return scalesObject;

}

function setupLegends(radiusScale, colorScale){


	// Label arrays for wage and job number
	const wageRatioIncreaseArray = [
		{'value':1.1, 'label':'10'},
		{'value':1.25, 'label':'25'},
		{'value':2, 'label':'100'},
		{'value':5, 'label':'400%'}]

	const jobNumberLabelArray = [
		{'size':10000, 'label':'10K'},
		{'size':100000, 'label':'500K'},
		{'size':1000000, 'label':'1M'}
	]

	// LEGENDS
	// Creating and positioning the wage legend
	$legendWages = $chartSvg.append('g.legend__wages')

	$legendWages.at('transform', 'translate('+ svgWidth*0.75 +','+yPadding/6+')')

	const $legendWages_title= $legendWages.append('text.legend-wages__title')

	const $legendWages_category_groups = $legendWages
		.selectAll('g.legend-wages__category')
		.data(wageRatioIncreaseArray)
		.enter()
		.append('g.legend-wages__category')

	const LEGEND_WAGE_RECTANGLE_WIDTH = isMobile? svgWidth/15 : svgWidth/40;
	const LEGEND_WAGE_RECTANGLE_HEIGHT = yPadding/10;

	const $legendWages_groups_y_coord = radiusScale(1000000);

	// Moving each category group
	$legendWages_category_groups
		.at('transform', (d,i)=>{
			const xTranslate = isMobile? (i* LEGEND_WAGE_RECTANGLE_WIDTH-LEGEND_WAGE_RECTANGLE_WIDTH) : (i* LEGEND_WAGE_RECTANGLE_WIDTH) ;
			const yTranslate = $legendWages_groups_y_coord;
			return 'translate('+xTranslate+','+yTranslate+')'
		})

	const $legendWages_rectangles = $legendWages_category_groups
		.append('rect.legend-wages__rectangle')

	$legendWages_rectangles
		.at('width', LEGEND_WAGE_RECTANGLE_WIDTH)
		.at('height', yPadding/10)
		.st('fill', d=> colorScale(d.value))

	const $legendWages_text_annotations= $legendWages_category_groups
		.append('text.legend-wages__text-annotation')


	const $legendWages_text_annotations_y_coord = LEGEND_WAGE_RECTANGLE_HEIGHT*3

	$legendWages_text_annotations
		.text(d=>d.label)
		.at('y', $legendWages_text_annotations_y_coord)
		.at('x', LEGEND_WAGE_RECTANGLE_WIDTH)
		.st('text-anchor', (d,i)=>{
			if(i===3){return 'start'}
			else {return 'middle'}
		})

	const legendWagesZeroValue = $legendWages
		.append('text.legend-wages__zero')

	legendWagesZeroValue
		.text('1%')
		.at('y', $legendWages_text_annotations_y_coord + $legendWages_groups_y_coord)
		.at('x', (d,i)=>{
			if(isMobile){return -LEGEND_WAGE_RECTANGLE_WIDTH}
			else{}
		})



	const WAGE_LABEL_LOCATION = isMobile? wageRatioIncreaseArray.length/2 *LEGEND_WAGE_RECTANGLE_WIDTH - LEGEND_WAGE_RECTANGLE_WIDTH :wageRatioIncreaseArray.length/2 *LEGEND_WAGE_RECTANGLE_WIDTH ;

	$legendWages_title
		.text('SALARY INCREASE %')
		.at('x', WAGE_LABEL_LOCATION)



	// LEGENDS
	// rendering job number legend
	$legendjobNumber = $chartSvg.append('g.legend-job-number')

	$legendjobNumber
		.at('transform', 'translate('+ xPadding +','+yPadding/6+')')

	const $legendjobNumber_category_groups = $legendjobNumber
		.selectAll('g.legend-job-number__category')
		.data(jobNumberLabelArray)
		.enter()
		.append('g.legend-job-number__category')

	const RADIUS_MULTIPLIER = 4

	$legendjobNumber_category_groups
		.at('transform', (d,i)=>{
			const xTranslate = RADIUS_MULTIPLIER*i*radiusScale(1000000)
			const yTranslate = radiusScale(1000000);
			return 'translate('+xTranslate+','+yTranslate+')'
		})

	const $legendjobNumber_circles = $legendjobNumber_category_groups
		.append('circle.legend-job-number__circle')

	$legendjobNumber_circles
		.at('r', d=> radiusScale(d.size))
		.st('fill', '#FFF')
		.st('stroke', '#C6C6C6')

	const $legendjobNumber_text_annotations = $legendjobNumber_category_groups
		.append('text.legend-job-number__text')

	$legendjobNumber_text_annotations
		.text(d=>d.label)
		.at('y', (RADIUS_MULTIPLIER/2) *radiusScale(1000000))


	const JOB_NUMBER_LABEL_LOCATION = RADIUS_MULTIPLIER * Math.round((jobNumberLabelArray.length-1) /2 )  *radiusScale(1000000)

	const $legendjobNumber_title_background= $legendjobNumber.append('text.job-number-title-background')
	const $legendjobNumber_title= $legendjobNumber.append('text.job-number-title')

	$legendjobNumber_title_background
		.text('JOBS IN 2026')
		.at('x', JOB_NUMBER_LABEL_LOCATION)
		.st('stroke', '#FFF')
		.st('stroke-width', '1px')

	$legendjobNumber_title
		.text('JOBS IN 2026')
		.at('x', JOB_NUMBER_LABEL_LOCATION)

	$legendjobNumber
		.st('opacity',0)
	// .st('visibility','hidden')

	$legendWages
		.st('visibility','hidden')
}


function resize(){



	const fullSVGHeight = $chartSvg.at('height')
	const REDUCED_VIEWPORT_HEIGHT_PERCENTAGE = 0.875
	const REMAINING_VIEWPORT_HEIGHT_PERCENTAGE = 1-REDUCED_VIEWPORT_HEIGHT_PERCENTAGE

	// Mobile check

	isMobile = viewportWidth <700 ? true : false

	// console.log("mobile? " + isMobile)

	// $chartSvg.at('height', (REDUCED_VIEWPORT_HEIGHT_PERCENTAGE*fullSVGHeight))

	// Setting up max width and height parameters for x and y scales
	// svgWidth = $chartSvg.at('width')
	// const maxWidthPercentage = 0.9;
	// xMaxScaleValue = svgWidth * maxWidthPercentage;
	// xPadding = isMobile? (1-maxWidthPercentage+0.1)*svgWidth:(1-maxWidthPercentage)*svgWidth;


	const svgHeight = $chartSvg.at('height')
	const maxHeightPercentage = 0.9;
	yMaxScaleValue = svgHeight * maxHeightPercentage;

	const Y_PADDING_MULTIPLIER = 1.25
	yPadding = REMAINING_VIEWPORT_HEIGHT_PERCENTAGE * Y_PADDING_MULTIPLIER * svgHeight;

	// const Y_SCALE_MIN = 10

	INTRO_Y_AXIS_LOCATION = svgHeight/2;

	yScale = d3.scaleLinear()
		.domain([MIN_AUTO,MAX_AUTO])
		.range([0+yPadding, yMaxScaleValue]);

	xScale = setupXScale(selectedJobData)


	VERTICAL_LABEL_POSITION_SHORTER =INTRO_Y_AXIS_LOCATION*0.8;

	VERTICAL_LABEL_POSITION_TALLER =INTRO_Y_AXIS_LOCATION*0.6;

	LINE_HEIGHT_LEAST_SIMILAR_JOB = INTRO_Y_AXIS_LOCATION - VERTICAL_LABEL_POSITION_SHORTER
	LINE_HEIGHT_MOST_SIMILAR_JOB = INTRO_Y_AXIS_LOCATION - VERTICAL_LABEL_POSITION_TALLER



}

function dropDownChange(){

	let selectedJobID = null;

	if (dropdownDefaultTrigger===true){
		selectedJobID = 415
	}
	else {selectedJobID = $chartContainer.select('.job-selector__dropdown').property('value');}



	const updatedData = selectJobData(similarity, selectedJobID);
	const currentJobId=updatedData[0].id_selected;

	console.log('selected job id: '+ selectedJobID);
	console.log('updated data ' +updatedData);
	console.log('current job '+currentJobId);
	console.log('current job auto '+keyObjectJobAuto[selectedJobID]);


	// Updating xScale with new data
	const xScale = setupXScale(updatedData);


	// const $miscChartSections = $chartSvg.select('.misc-chart-elements-container')
	const $miscChartSectionTitle = $chartContainer.select('div.chart-title-div')
	// Updating main label text
	$miscChartSectionTitle.select('.chart-title-pt2').text(numberWithCommas(keyObjectJobNumber[currentJobId]))
	$miscChartSectionTitle.select('.chart-title-pt3').text(keyObjectJobName[currentJobId])
	$miscChartSectionTitle.select('.chart-title-pt5').text('$'+numberWithCommas(keyObjectJobWage[currentJobId]))

	// Updating yScale domain to exclude all items with a worse automation outcome
	yScale.domain([0,keyObjectJobAuto[currentJobId]])

	yAxisGroup
		.transition()
		.call(yAxisLabel)

	// Removing all previously created circles
	const $chartSvg = d3.select('svg.scatter')

	$chartSvg.selectAll('circle.job').remove()

	let $jobCircles = $chartSvg
		.selectAll('circle.job')
		.data(updatedData)
		.enter()
		.append('circle.job')


	$jobCircles
		.at('cx', d=>{return xScale(d.similarity)})
		.at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
		.st('fill', d=>{
			const jobSelectedWage = keyObjectJobWage[d.id_selected]
			const jobComparedWage = keyObjectJobWage[d.id_compared]
			const wageChange = jobComparedWage/jobSelectedWage;
			return scalesObject.colorScale(wageChange)
		})
		.st('opacity', d=>{
			if (
				(keyObjectJobWage[d.id_selected]<keyObjectJobWage[d.id_compared])
            &&
            (keyObjectJobAuto[d.id_selected]>keyObjectJobAuto[d.id_compared])
			){return 1}
			else {return 0}
		})
	// .st('stroke', 'black')
		.at('r', d=>{
			const wage=keyObjectJobNumber[d.id_compared];
			return scalesObject.radiusScale(wage)
		})

	$jobCircles
		.on('mouseenter', showTooltip)
		.on('click', showTooltip)
			  .on('mouseleave', hideTooltip)
}

function hideTooltip(d,i,n){
	jobTooltip.st('visibility','hidden')

	const currentCircle = d3.select(n[i])

	currentCircle
		// .st('stroke-opacity',1)
		.st('stroke', 'gray')
		.st('stroke-width', 0.5)
		// .st('stroke-width','2px')
}

function showTooltip(d,i,n){

	const currentCircle = d3.select(n[i])

	currentCircle
		.st('stroke','black')
		.st('stroke-width',2)

	selectedJobSkills = selectJobData(skills, d.id_compared);
	selectedJobSkills = selectedJobSkills.sort(compare);

	const jobComparedName = d3.select("div.job-compared-name");
	jobComparedName.text(keyObjectJobName[d.id_compared])

	const jobComparedNumber = d3.select("div.job-compared-number");
	jobComparedNumber.text(numberWithCommas(keyObjectJobNumber[d.id_compared])+' jobs in 2026')

	const jobSkillsContainer = jobTooltip.select('div.job-skills-container')

	const jobSkillsBarRow = jobSkillsContainer.selectAll('div.bar-container')

	const jobSkillsNames = jobSkillsContainer.selectAll("div.job-bar-name")
		.data(selectedJobSkills)

	const jobSkillsBars  = jobSkillsContainer.selectAll("div.job-bar")
		.data(selectedJobSkills)

	const jobSkillsValues= jobSkillsContainer.selectAll("div.job-bar-value")
		.data(selectedJobSkills)

	const tooltipWidth = $('.jobTooltip').width()
	const tooltipHeight = $('.jobTooltip').height()

	tooltipXScale
		.range([0,(tooltipWidth*0.8)])

	jobSkillsBars.st('height','4px')
		.st('width', skill=> {
			return tooltipXScale(skill.imp)+'px'
		})
		.st('background','#D928BC')

	jobSkillsNames.text((skill,i)=>{
		return (i+1)+'. '+keyObjectSkillName[skill.skill_id]
	})

	jobSkillsValues.text(skill=>{
		return skill.imp.toFixed(0)+'%';
	})



	const xCoord = +d3.select(n[i])
		.at("cx")

	const yCoord = +d3.select(n[i])
		.at("cy")




	let tooltipBump_X = null;
	let tooltipBump_Y = null;

	if(xCoord < (viewportWidth/2)){
		tooltipBump_X = isMobile? 50 : 120;
	}
	else {
		tooltipBump_X = -tooltipWidth -50
	}

	if(yCoord < (viewportHeight/2)){
		tooltipBump_Y = 50
	}
	else {
		tooltipBump_Y = -tooltipHeight
	}

	jobTooltip.st("left", (xCoord+tooltipBump_X)+"px")
		.st("top", (yCoord+tooltipBump_Y)+"px")

	jobTooltip.st('visibility','visible')

	chartTooltipClosingTrigger = true;

}

function createDropdown(){

// Creating job dropdown menu
	$jobDropdownMenu=d3.select('div.job-selector__container')
		.append('select')


	$jobDropdownMenu
		.at('class', 'job-selector__dropdown')
		.st('opacity',0)
		// .at('data-placeholder', 'Select another job')

	// .st('visibility','hidden')

	crosswalk.sort(compareJobNames)

	const $jobButtons = $jobDropdownMenu.selectAll('option.job-selector__job-button')
		.data(crosswalk)
		.enter()
		.append('option.job-selector__job-button')
		.at('value', d=>d.id)

	$jobDropdownMenu
		.insert("option",":first-child")
		.at('selected','selected')
		.text('Pick another job')


	$jobButtons.text((d)=>{
		return d.job_name;
	})


	$(".job-selector__dropdown")
		.chosen({
			placeholder_text_single:'Select another job'
		})
		.on('change',dropDownChange)
}



function createCircles(){
	$jobCircles = $chartSvg
		.selectAll('circle.job')
		.data(selectedJobData)
		.enter()
		.append('circle.job')

	$jobCircles
		.at('cx', d=>{return xScale(d.similarity)})
		.at('cy', INTRO_Y_AXIS_LOCATION)
		.st('fill', 'white')
		.st('stroke', 'black')
		.st('stroke-width', 0.5)
		.st('opacity', 0)
		.at('r','3')
		.on('mouseenter', showTooltip)
		.on('click',showTooltip)
		.on('mouseleave', hideTooltip)
}

function setupTooltip(){

	const jobSkillsBarRow = jobSkillsContainer.selectAll('div.job-bar-container')
		.data(selectedJobSkills)
		.enter()
		.append('div.bar-container')

	const jobSkillsNames = jobSkillsBarRow.append("div.job-bar-name").data(selectedJobSkills).enter()

	const jobDataContainer = jobSkillsBarRow.append('div.job-data-container')
	const jobSkillsBarsContainers  = jobDataContainer.append("div.job-bar-box")

	const jobSkillsBars  = jobSkillsBarsContainers.append("div.job-bar").data(selectedJobSkills).enter()
	const jobSkillsValues= jobDataContainer.append("div.job-bar-value").data(selectedJobSkills).enter()

}

function setupDOMElements(leastSimilarJob,mostSimilarJob){

	$chartSvg
		.on('click', ()=>{
			if(chartTooltipClosingTrigger){hideTooltip}
			else{}
		})

	$truckerDeveloperXAxis = $chartSvg
		.select('g.intro-x-axis')

	// Creating annotations elements for similarity-only views
	const leastSimilarJob_ANNOTATION = $chartSvg.append('g.least-similar-annotation similarity-annotation')
	const mostSimilarJob_ANNOTATION = $chartSvg.append('g.most-similar-annotation similarity-annotation')

	const leastSimilarJob_LINE = leastSimilarJob_ANNOTATION.append('line')
	const mostSimilarJob_LINE = mostSimilarJob_ANNOTATION.append('line')

	const leastSimilarJob_TEXT = leastSimilarJob_ANNOTATION.append('text')
	const mostSimilarJob_TEXT = mostSimilarJob_ANNOTATION.append('text')

	$similarityAnnotations = $chartSvg.selectAll('g.similarity-annotation')

	leastSimilarJob_TEXT.text(keyObjectJobName[(leastSimilarJob[0].id_compared)])
	mostSimilarJob_TEXT.text(keyObjectJobName[(mostSimilarJob[0].id_compared)]).st('text-anchor', 'end')

	// Positioning annotation elements
	leastSimilarJob_ANNOTATION
		.at('transform', d=>{
			const xTranslate = xScale(leastSimilarJob[0]['similarity']);
			return 'translate('+xTranslate+','+VERTICAL_LABEL_POSITION_SHORTER +')'
		})

	mostSimilarJob_ANNOTATION
		.at('transform', d=>{
			const xTranslate = xScale(mostSimilarJob[0]['similarity']);
			return 'translate('+xTranslate+','+VERTICAL_LABEL_POSITION_TALLER +')'
		})

	leastSimilarJob_LINE
		.at('x1',0)
		.at('y1',0)
		.at('x2',0)
		.at('y2',LINE_HEIGHT_LEAST_SIMILAR_JOB)
		.st('stroke-width',1)
		.st('stroke','black')

	mostSimilarJob_LINE
		.at('x1',0)
		.at('y1',0)
		.at('x2',0)
		.at('y2',LINE_HEIGHT_MOST_SIMILAR_JOB)
		.st('stroke-width',1)
		.st('stroke','black')

	// Adding an x axis label to the chart
	$xAxisTextLabel = $chartSvg.append('text.axis-label similarity')
	X_AXIS_LABEL_HEIGHT = INTRO_Y_AXIS_LOCATION * 1.1
	// const svgWidth = $chartSvg.at('width')

	$xAxisTextLabel
		.at('x', ()=>{
			if(isMobile){
				const widthOfChart = xPadding+xMaxScaleValue;
				return widthOfChart/2
			}
			else {return svgWidth/2 }
		})
		.at('y',X_AXIS_LABEL_HEIGHT)
		.text('SKILL SIMILARITY')
		.st('text-anchor','middle')

	// Adding max and min similarity/ y-axis labels
	maxSimilarityLabel = $chartSvg.append('text.axis-label max-similarity')
	minSimilarityLabel = $chartSvg.append('text.axis-label min-similarity')

	maxSimilarityLabel
		.at('x', xMaxScaleValue )
		.at('y',X_AXIS_LABEL_HEIGHT)
		.text('→ SIMILAR')
		.st('text-anchor','middle')

	minSimilarityLabel
		.at('x', xPadding )
		.at('y',X_AXIS_LABEL_HEIGHT)
		.text('DIFFERENT ←')
		.st('text-anchor','middle')

	leastSimilarJob_ANNOTATION
		.st('opacity',0)

	mostSimilarJob_ANNOTATION
		.st('opacity',0)

	maxSimilarityLabel
		.st('opacity',0)

	minSimilarityLabel
		.st('opacity',0)

	$xAxisTextLabel
		.st('opacity',0)


	$similarityAxisLabel = $chartSvg
		.selectAll('.axis-label')


	// Adding automatability/x-axis, and max and min automatability labels
	const formatPercent = d3.format(".0%");

	yAxisLabel = d3.axisLeft(yScale).ticks(4).tickFormat(formatPercent);

	yAxisGroup = $chartSvg.append("g.scatter-y-axis")
		.attr("transform", "translate("+xPadding+",0)")
		.call(yAxisLabel)
		.st('opacity',0)

	$automatability_LABEL = $chartSvg.append('text.scatter-label-y-axis')

	$automatability_LABEL
		.at('transform',`translate(${(xPadding/3)},${INTRO_Y_AXIS_LOCATION}) rotate(270)`)
		.st('opacity',0)
		.text('AUTOMATABILITY LIKELIHOOD')


	jobTooltip = d3.select("figure.svg-container").append("div.jobTooltip").on('click', hideTooltip)


	const jobSelectedName = d3.select("div.job-selected-name").on('click', hideTooltip)

	const jobComparedNumber = jobTooltip.append("div.job-compared-number").on('click', hideTooltip)
	const jobComparedName = jobTooltip.append("div.job-compared-name").on('click', hideTooltip)

	jobSkillsContainer =jobTooltip.append("div.job-skills-container")
	const jobSkillsSectionNames =jobSkillsContainer.append('div.tooltip-section-names').on('click', hideTooltip)
	const jobSkillsSectionNamesSkill = jobSkillsSectionNames.append('div.section-name-skills').text('SKILL').on('click', hideTooltip)
	const jobSkillsSectionNamesImportance = jobSkillsSectionNames.append('div.section-name-importance').text('IMPORTANCE').on('click', hideTooltip)


	// Automatability group labels

	$automatabilityBisectingGroup = $chartSvg.append('g.bisecting-automation-group')
	$automatabilityBisectingGroup
		.at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')



	let $automatabilityBisectingLine = $automatabilityBisectingGroup.append('line.bisecting-line')
	$automatabilityBisectingLine.at('x1',xPadding)
		.at('y1',0)
		.at('x2',xMaxScaleValue)
		.at('y2',0)


	let $automatabilityBisectingLabelBackground =$automatabilityBisectingGroup.append('text.bisecting-line-label-background')
	$automatabilityBisectingLabelBackground.text('TRUCKERS')

	let $automatabilityBisectingLabel =$automatabilityBisectingGroup.append('text.bisecting-line-label')
	$automatabilityBisectingLabel.text('TRUCKERS')


	$automatabilityBisectingGroup
		.st('opacity',0)

	d3.selectAll('div.section__scene')
		.st('padding-bottom',(d,i)=>{
			if(i>12){return '5vh'}
			else{return '100vh'}
		})

}

function updateStep(step){
	if(step==='x-axis-base'){

		$chartSvg
			.selectAll('g.annotation-group-stacked')
			.st('opacity',0)

		$chartSvg
			.selectAll('g.anno-group')
			.st('opacity',0)

		$similarityAnnotations
			.classed('invisible',false)

		$truckerDeveloperXAxis
			.classed('invisible',true)
		// restoring job circle hover tooltip
		$jobCircles
			.on('mouseenter', showTooltip)
			.on('click', showTooltip)
			.on('mouseleave', hideTooltip)

		d3.selectAll('span.secondary-title')
			.st('display','inline')

		d3.select('.chart-title-pt1')
			.text('What should')

		d3.select('.chart-title-pt2')
			.text('1,871,700')
			.classed('red-text',false)

		d3.select('.chart-title-pt3')
			.text('truckers')

		d3.select('.chart-title-pt4')
			.text('earning')
			.classed('blue-text',false)

		d3.select('.chart-title-pt5')
			.text('$43,590')

		d3.select('.chart-title-pt6')
			.text('yearly, transition to?')


		$chartSvg
			.selectAll('g.annotation-group-different')
			.st('visibility','hidden')

		$chartSvg
			.selectAll('g.annotation-group-similar')
			.st('visibility','hidden')

		$chartSvg
			.selectAll('g.skill-section__two-jobs')
			.transition()
			// .at('transform',`translate(0,${INTRO_Y_AXIS_LOCATION})`)
			.st('opacity',0)

		$chartSvg
			.selectAll('g.all-jobs')
			.transition()
			// .delay((d,i)=>{i*100})
			// .at('transform',`translate(0,${INTRO_Y_AXIS_LOCATION})`)
			.st('opacity',0)

		$chartSvg.selectAll('g.trucker-developer-groups')
			.classed('invisible', true)

		$chartSvg.selectAll('circle.job')
			.classed('invisible', false)

		$chartSvg.selectAll('g.similarity-annotation')
			.classed('invisible', false)

		$chartContainer.selectAll('.misc-elements')
			.st('visibility','visible')

		$chartContainer.selectAll('.job-selector__container')
			.st('visibility','hidden')

		const $staticImageDiv = $chartContainer
		 .select('img.images-many-jobs-many-skills')

	  $staticImageDiv
		 .st('display','none')

		$chartSvg.st('display', 'block')

		defaultSceneSetting.cy = function(){return INTRO_Y_AXIS_LOCATION}
		// defaultSceneSetting.cy = function(d){return yScale(keyObjectJobAuto[d.id_compared])}
		defaultSceneSetting.r = function(){return 3}
		defaultSceneSetting.fill = function(){return '#FFF'}
		defaultSceneSetting.yScale = function(){yScale.domain([0,1])}
		defaultSceneSetting.opacityCircles = function(){return 1}
		defaultSceneSetting.opacityAnnotations = function(){return 0}

		defaultSceneSetting.yScale()

		$jobCircles
			.transition()
			.at('cy', defaultSceneSetting.cy)
			.at('r', defaultSceneSetting.r)
			.st('fill', defaultSceneSetting.fill)
			.st('opacity',defaultSceneSetting.opacityCircles)

		$chartSvg.selectAll('g.similarity-annotation')
			.transition()
			.st('opacity',defaultSceneSetting.opacityCircles)

		yAxisGroup
			.st('opacity',defaultSceneSetting.opacityAnnotations)

		$automatability_LABEL
			.transition()
			.st('opacity',defaultSceneSetting.opacityAnnotations)

		$automatabilityBisectingGroup
			.transition()
			.st('opacity',defaultSceneSetting.opacityAnnotations)

		$similarityAxisLabel
			.transition()
			.st('opacity',1)
			.at('y', X_AXIS_LABEL_HEIGHT)

	}
	else if(step==='xy-axis-scatter'){

		$chartSvg
			.selectAll('g.similarity-annotation')
			.st('opacity',0)

		$chartSvg
			.selectAll('g.annotation-group-stacked')
			.st('opacity',0)

		$chartSvg
			.selectAll('g.anno-group')
			.st('opacity',0)

		$chartSvg
			.selectAll('g.anno-group-sailors')
			.st('opacity',1)

		$similarityAnnotations
			.classed('invisible',true)

		yScale.domain([0,1])
		yAxisGroup
			.transition()
			.call(yAxisLabel)


		const Y_AXIS_ANNOTATION_HEIGHT =yMaxScaleValue*1.05

		yAxisGroup
			.transition()
			.st('opacity',1)

		$automatability_LABEL
			.transition()
			.st('opacity',1)

		$chartSvg.selectAll('text.axis-label')
			.transition()
			.at('y',Y_AXIS_ANNOTATION_HEIGHT)

		$jobCircles
			.classed('invisible',false)
			.transition()
			.at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
			.st('opacity',1)



		$automatabilityBisectingGroup
		// .st('visibility', 'visible')
			.transition()
			.st('opacity', defaultSceneSetting.opacityCircles)
			.at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')
	}
	else if(step==='xy-axes-scatter'){

		$chartSvg
			.selectAll('g.annotation-group-stacked')
			.st('opacity',0)

		$chartSvg
			.selectAll('g.anno-group')
			.st('opacity',0)

		$chartSvg
			.selectAll('g.anno-group-ambulance')
			.st('opacity',1)

		$jobCircles
			.classed('invisible',false)

		$similarityAnnotations
			.classed('invisible',true)

		yScale.domain([0,0.79])

		yAxisGroup
			.transition()
			.call(yAxisLabel)

		// $jobCircles
		//   .transition()
		//   .at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
		//   .st('opacity',d=>{
		//     if (+keyObjectJobAuto[d.id_compared]>+keyObjectJobAuto[d.id_selected]){return 0}
		//     else {return 1}
		//   })


		$automatabilityBisectingGroup
			.transition()
			.at('transform', 'translate(0,'+yScale(keyObjectJobAuto[selectedJobID])+')')
			.st('opacity',0)

		$jobCircles
			.transition()
	    .st('opacity',d=> +keyObjectJobAuto[d.id_compared]>+keyObjectJobAuto[d.id_selected]? 0 : 1)
	    // .transition()
	    .at('cy', d=>{return yScale(keyObjectJobAuto[d.id_compared])})
			.st('fill','#FFF')
			.at('r', 3)

		$legendWages
			.st('visibility','hidden')
	}
	else if(step==='xy-axes-scatter-filtered'){

		$chartSvg
			.selectAll('g.legend__wages')
			.st('opacity', 1)

		$chartSvg
			.selectAll('g.annotation-group-stacked')
			.st('opacity',0)

		$chartSvg
			.selectAll('g.anno-group')
			.st('opacity',0)

		$chartSvg
			.selectAll('g.anno-group-shipengineers')
			.st('opacity',1)

		$jobCircles
			.classed('invisible',false)

		$similarityAnnotations
			.classed('invisible',true)

		$legendjobNumber
			.transition()
			.st('opacity',0)
		// .st('visibility','hidden')

		$legendWages
			.transition()
			.st('visibility','visible')



		$jobCircles
			.transition()
			.at('r', 3)
			.st('fill', d=>{
				const jobSelectedWage = keyObjectJobWage[d.id_selected]
				const jobComparedWage = keyObjectJobWage[d.id_compared]
				const wageChange = jobComparedWage/jobSelectedWage;
				return scalesObject.colorScale(wageChange)
			})
			.st('opacity', d=>{
				if (
					(keyObjectJobWage[d.id_selected]<keyObjectJobWage[d.id_compared])
            &&
            (keyObjectJobAuto[d.id_selected]>keyObjectJobAuto[d.id_compared])
				){return 1}
				else {return 0}
			})

	}
	else if(step==='show-similarity-auto-wage'){
		$chartSvg
			.selectAll('g.legend__wages')
			.st('opacity',1)


		$chartSvg
			.selectAll('g.annotation-group-stacked')
			.st('opacity',0)

		dropdownDefaultTrigger=true;

		$chartSvg
			.selectAll('g.anno-group')
			.st('opacity',0)

		$chartSvg
			.selectAll('g.anno-group-final')
			.st('opacity',1)

		if($chartContainer.select('.job-selector__dropdown').property('value')!=='Pick another job'){
			dropDownChange()
		}
		else{}

		$jobCircles = $chartSvg
			.selectAll('circle.job')
			.st('stroke', 'gray')

		$jobDropdownMenu
			.transition()
			.st('opacity',0)

		$legendjobNumber
			.transition()
			.st('opacity', 1)

		$jobCircles
			.transition()
			.at('r', d=>{
				const wage=keyObjectJobNumber[d.id_compared];
				return scalesObject.radiusScale(wage)
			})

		$chartContainer
			.selectAll('.job-selector__container')
			.st('visibility','hidden')
	}
	else if(step==='show-similarity-auto-wage-number'){

		$chartSvg
			.selectAll('g.legend__wages')
			.st('opacity',1)


		$chartSvg
			.selectAll('g.annotation-group-stacked')
			.st('opacity',0)

		$chartSvg
			.selectAll('g.anno-group')
			.st('opacity',0)

		dropdownDefaultTrigger=false;

		$chartContainer
			.selectAll('.job-selector__container')
			.st('visibility','visible')
		// .st('position','absolute')
		// .st('top', '1%')
		// .st('left', '25%')

		$jobDropdownMenu
			.transition()
			.st('opacity',1)
		// .st('visibility','visible')
	}
	else if(step==='show-similarity-auto-wage-number'){
		d3.select('figure')
			.classed('sticky',false)
	}
	else if(step==='conclusion'){
		if(isMobile){$chartContainer
			.selectAll('.job-selector__container')
			.st('visibility','hidden')}
	}
}


function init(){
	return new Promise((resolve, reject) =>{
		d3.loadData(...files, (err, response)=>{
			if(err) reject()
			else{
				crosswalk = response[0];
				similarity  = response[1];
				crosswalkSkills= response[2];
				skills = response[3]

				selectedJobData =	selectJobData(similarity, selectedJobID);
				const leastSimilarJob = findLeastSimilarJob(selectedJobData)
				const mostSimilarJob = findMostSimilarJob(selectedJobData)

				// Making sure crosswalk and top skill data is in the right format
				formatCrosswalk(crosswalk)
				formatSimilarityValues(similarity)
				formatCrosswalkSkills(crosswalkSkills)
				formatTopSkillsByJob(skills)


				// Filling out key object data
				keySetupJobName(crosswalk, keyObjectJobName)
				keySetupJobNumber(crosswalk, keyObjectJobNumber)
				keySetupJobAutomation(crosswalk, keyObjectJobAuto)
				keySetupJobWage(crosswalk, keyObjectJobWage)
				keySetupJobSkills(crosswalkSkills, keyObjectSkillName)

				resize()
				scalesObject = setupScales()
				setupDOMElements(leastSimilarJob,mostSimilarJob)
				setupLegends(scalesObject.radiusScale, scalesObject.colorScale)
				createDropdown()
				setupTooltip()

				createCircles()
				setupAnnotations()

				resolve(skills)
			}
		})
	})

}


export default {init, updateStep}
