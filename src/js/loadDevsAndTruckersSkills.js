

export default function loadDevsAndTruckersSkills(){

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isMobile = viewportWidth < 700? true : false;

  const JOB_LABEL_MARGIN_LEFT = 60;

  const ALL_JOBS_STARTING_Y_LOCATION = 15;

  let allData = null;




  const fileNames = ["devs_and_truckers_skills",
    "Choreographers",
    "Dentists",
    "Nurses",
    "Chiropractors",
    "Farmers",
    "Construction_Managers",
    "Firefighters",
    "Geographers",
    "Embalmers",
    "Piplayers",
    "Podiatrists",
    "Fabric_Patternmakers",
    "Clergy",
    "Makeup_Artists",
    "Family_Therapists",
    "CEOs",
    "Art_Directors",
    "Interior_Designers",
    "Craft_Artists",
    "Event_Planners",
    "Veterinarians",
    "Writers",
    "Political_Scientists",
    "Ship_Engineers",
    "Paramedics",
    "Mathematicians",
    "Florists",
    "Travel_Guides",
    "News_Analysts",
    "Musicians",
    "Fitness_Trainers",
    "Graphic_Designers",
    "Childcare_Workers",
    "Police_Officers",
    "Hairdressers",
    "Journalists",
    "Air_Traffic_Controllers",
    "Dancers",
    "Optometrists",
    "Physician_Assistants",
    "Electricians",
    "Ambulance_Drivers",
    "Athletes",
    "Skincare_Specialists",
    "Private_Cooks",
    "Funeral_Attendants",
    "Actors",
    "Judges",
    "Economists",
    "historians",
    "Dental_Assistants",
    "Cobblers",
    "Massage_Therapists",
    "Millwrights",
    "Librarians",
    "Maids",
    "Bartenders",
    "Dishwashers",
    "Fast_Food_Cooks",
    "Barbers",
    "Real_Estate_Agents",
    "Proofreaders"]
  // const fileNames = ['devs_and_truckers_skills',
  //                   'choreographer',
  //                   'dentists',
  //                   'nurses',
  //                   'chiropractors',
  //                   'farmers',
  //                   'construction_managers',
  //                   'firefighters',
  //                   'geographers',
  //                   'embalmers',
  //                   'pipelayers']
  const pathData = 'assets/data/'

  let files=[]

  fileNames.forEach((fileName)=>{
    files.push(pathData+fileName + '.csv')
  })

  d3.loadData(...files, (err, response)=>{
    const controllerSkills = new ScrollMagic.Controller();

    const BUTTON_Skill_Difference = d3.select("div.skill-difference")
    const BUTTON_Stack_SkillDifference = d3.select("div.skill-stack-difference")
    const BUTTON_Stack_AllJobs_Skills =d3.select('div.all-skills-difference')
    const BUTTON_Skills_Similarity_Single_Axis=d3.select('div.only-similarity-axis')

    const devAndTruckerSkills = response[0];

    let allJobSkillsRaw=[]

// Note: i=1 here to exclude first entry in data loaded, which reprensents devs comparison
    for (i=1;i<response.length;i++){
      allJobSkillsRaw.push(response[i])
    }

    // const allJobSkillsNames=['choreographers','dentists','nurses','chiropractors','farmers','construction_managers',
    //                       'firefighters','geographers','embalmers','pipelayers']

    const allJobSkillsName=["Choreographers",
      "Dentists","Nurses","Chiropractors","Farmers","Construction_Managers","Firefighters","Geographers","Embalmers","Piplayers","Podiatrists",
      "Fabric_Patternmakers","Clergy","Makeup_Artists","Family_Therapists","CEOs","Art_Directors","Interior_Designers","Craft_Artists","Event_Planners","Veterinarians","Writers",
      "Political_Scientists","Ship_Engineers","Paramedics","Mathematicians","Florists","Travel_Guides","News_Analysts","Musicians","Fitness_Trainers","Graphic_Designers","Childcare_Workers",
      "Police_Officers","Hairdressers","Journalists","Air_Traffic_Controllers","Dancers","Optometrists","Physician_Assistants","Electricians","Ambulance_Drivers","Athletes","Skincare_Specialists",
      "Private_Cooks","Funeral_Attendants","Actors","Judges","Economists","historians","Dental_Assistants","Cobblers","Massage_Therapists","Millwrights","Librarians","Maids","Bartenders",
      "Dishwashers","Fast_Food_Cooks","Barbers","Real_Estate_Agents","Proofreaders"]

    devAndTruckerSkills.forEach(skill=>{
      skill.difference = Math.abs(+skill.devs- +skill.truckers)
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

    const chartSvg = d3.select('svg.scatter')

    // Removing previously visible content
    const truckerDeveloperCircles = chartSvg.selectAll('circle.truckers-devs-circles');
    const truckerDeveloperYAxis = chartSvg.select('g.intro-y-axis');
    const truckerDeveloperXAxis = chartSvg.select('g.intro-x-axis');
    const truckerDeveloperSkillValues = chartSvg.selectAll('text.two-job-skill-value');

    truckerDeveloperCircles.st('opacity',0)
    truckerDeveloperYAxis.st('opacity',0);
    truckerDeveloperXAxis.st('opacity',0);
    truckerDeveloperSkillValues.st('opacity',0);

    // Concatenating all the CSVS for previously loaded jobs and making a new array
    // of objects from them, w/ each job name used as a key.

    const allJobSkillsFlat = [].concat.apply([], allJobSkillsRaw);
    const allJobSkillsGrouped = d3.nest()
      .key(d=>d.job_compared_name)
      .entries(allJobSkillsFlat)

    // Setting scales
    const svgWidth = chartSvg.at('width')
    const svgHeight = chartSvg.at('height')

    const widthPercentage = 0.7;
    const heightPercentage = 0.7;

    const yMaxScaleValue = svgHeight * heightPercentage;
    const xMaxScaleValue = svgWidth * widthPercentage;

    const xPadding = (1-widthPercentage)*svgWidth;
    const yPadding = (1-heightPercentage)*svgHeight;

    const xScale = d3.scaleLinear()
  		.domain([0,100])
  		.range([xPadding, xMaxScaleValue]);

    const xScaleRectangle = d3.scaleLinear()
  		.domain([0,100])
  		.range([0, (xMaxScaleValue-xPadding)]);


    // Creating group elements for each skill, both for developers and for other jobs
    const skillSections = chartSvg.selectAll('g.skill-section')
      .data(devAndTruckerSkills)
      .enter()
      .append('g.skill-section')

    const skillSectionsAllJobs = chartSvg.selectAll('g.all-skills')
      .data(allJobSkillsGrouped)
      .enter()
      .append('g')
      .at('class',d=> 'all-skills '+d.key)

    const skillItemsAllJobs = skillSectionsAllJobs.selectAll('g.skill-item')
      .data(d=>d.values)
      .enter()
      .append('g')
      .at('class',d=>'skill-item-'+d.skills.replace(/ /g,'_'))

    const XBUMP = 250;

    const devCircles = skillSections.append('circle.devs-skill-circle')
    const truckerCircles = skillSections.append('circle.truckers-skill-circle')

    const skillSectionsText= skillSections.append("text.job-name")
    const axisLines = skillSections.append('line.skill-axis')

    const skillSectionsTextAllJobs = skillSectionsAllJobs
      .append("text.job-name")

    const sceneShowTwoJobsAllSkills = new ScrollMagic.Scene({triggerElement: ".two-jobs-all-skills",offset:  0,duration: 1,triggerHook: 0})
    .on("enter", (e)=>{
      devCircles.at('cx',(d)=> xScale(d.devs))
        .at('r',5)
        .st('fill','#0B24FB')
        .on('mouseenter')

      truckerCircles.at('cx',(d)=>xScale(d.truckers))
        .at('r',5)
        .st('fill','#EB5757')
        .st('opacity',1)

      skillSections.st('opacity',1)
      .at('transform', (d,i)=>{return 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (ALL_JOBS_STARTING_Y_LOCATION+(i*ALL_JOBS_STARTING_Y_LOCATION)) +')'});

      skillSectionsText.text(d=>d.skills)
        .st('text-anchor','right')
        .st('opacity',1)

      axisLines.at('x1',()=>xScale(0))
       .at('y1',0)
       .at('x2',()=>xScale(100))
       .at('y2',0)
       .at('stroke-width', 1)
       .st('stroke','black')
       .st('opacity',1)

     skillSectionsTextAllJobs.at('transform','translate('+JOB_LABEL_MARGIN_LEFT+',0)')
       .text(d=>d.key.replace(/_/g,' '))
       .st('text-anchor','right')
    })
    .on("leave", (e)=>{
      if(e.target.controller().info("scrollDirection") == "REVERSE"){
        devCircles.at('cx',(d)=> xScale(d.devs))
          .at('r',5)
          .st('fill','#0B24FB')

        truckerCircles.st('opacity',0)

        skillSections.st('opacity',0)

        skillSectionsText.st('opacity',0)

        axisLines.st('opacity',0)

        skillSectionsTextAllJobs.st('opacity',0)

        // d3.selectAll('circle.truckers-devs-circles').st('opacity',1)

        truckerDeveloperCircles.st('opacity',1);
        truckerDeveloperYAxis.st('opacity',1);
        truckerDeveloperXAxis.st('opacity',1);
        truckerDeveloperSkillValues.st('opacity',1);
      }
      else{}})
    .addTo(controllerSkills)






// Original bars signifying different skills
    const axisDifferenceRects = skillSections.append('rect.skill-difference-axis')

    const axisDifferenceRectsAllJobs = skillItemsAllJobs.append('rect.skill-difference-axis-all-jobs')

// Adding difference rectangles for devs and truckers
    axisDifferenceRects
    .at('x', d=>{
      if (+d.devs>=+d.truckers){
        return xScale(+d.truckers)
      }
      else{
        return xScale(+d.devs)
      }
      })
    .at('width',d=>{
      return xScaleRectangle(d.difference);
    })
    .at('height',3)
    .st('fill','#E530BE')
    .st('opacity',0)



// Adding difference retangles for all other jobs


    // showing skill difference
    const sceneShowDifferences = new ScrollMagic.Scene({triggerElement: ".two-jobs-skills-difference",offset:  0,duration: 1,triggerHook: 0})
    .on("enter", (e)=>{
      axisDifferenceRects
       .transition()
       .st('opacity',1)
    })
    .on("leave", (e)=>{
      if(e.target.controller().info("scrollDirection") == "REVERSE"){
        axisDifferenceRects
         .transition()
         .st('opacity',0)
      }
      else{}})
    .addTo(controllerSkills)

    const xCoordsArray = []
    const xOffsetsForHorizontalBars = allJobSkillsFlat.map(d=> d.xCoordStacked)
    const maxSumBarWidth = d3.max(xOffsetsForHorizontalBars);
    const maxPartBarWidth= maxSumBarWidth/68;
    const xScaleEuclidean = d3.scaleLinear()
  		.domain([0,100])
  		.range([0, maxPartBarWidth]);



  const sceneStackDifferences = new ScrollMagic.Scene({triggerElement: ".two-jobs-stack-difference",offset:  0,duration: 1,triggerHook: 0})
  .on("enter", (e)=>{

    axisLines
      .transition()
      .st('opacity',0)

    skillSectionsText
      .transition()
      .st('opacity',0)
      .text((d,i)=> {
        if (i===devAndTruckerSkills.length-1){return 'Developers'}
        else return ''
      })
      .at('transform','translate('+JOB_LABEL_MARGIN_LEFT+ ',0)')
      .transition()
      .st('opacity',1)

    devCircles
      .transition()
      .st('opacity',0)

    truckerCircles
      .transition()
      .st('opacity',0)


    axisDifferenceRects
    .transition()
    .delay(1000)
    .at('x',d=> xScaleEuclidean(d.xCoordStacked))
    .at('width',d=> xScaleEuclidean(d.difference))
    .at('transform',(d,i)=>{
      return 'translate('+XBUMP+',0)'
    })

    skillSections
      .transition()
        .delay(2000)
        .duration(500)
        .at('transform',()=> 'translate('+JOB_LABEL_MARGIN_LEFT+','+ (viewportHeight/2) +')')

    axisDifferenceRects
      .on('mouseenter',d=>console.log(d.skills))})
      .on("leave", (e)=>{
        if(e.target.controller().info("scrollDirection") == "REVERSE"){}
        else{}})
      .addTo(controllerSkills)


const sceneStackAllSkills = new ScrollMagic.Scene({triggerElement: ".many-jobs-stack-difference",offset:  0,duration: 1,triggerHook: 0})
.on("enter", (e)=>{


    skillSections.at('transform',()=> 'translate('+0+','+ 2*ALL_JOBS_STARTING_Y_LOCATION +')')

    axisDifferenceRectsAllJobs
    .at('x',d=> xScaleEuclidean(d.xCoordStacked))
    .at('width',d=> xScaleEuclidean(d.difference))
    .at('height',3)
    .st('fill','#E530BE')
    .at('transform',(d,i)=>{
      return 'translate('+XBUMP+',0)'
    })
    .on('mouseenter',d=>console.log(d.skills))

    skillSectionsAllJobs.at('transform',(d,i)=>{
      return 'translate(0,'+(i*ALL_JOBS_STARTING_Y_LOCATION+ 3*ALL_JOBS_STARTING_Y_LOCATION)+')'
    })
})
.on("leave", (e)=>{
  if(e.target.controller().info("scrollDirection") == "REVERSE"){}
  else{}})
.addTo(controllerSkills)



  // BUTTON_Skills_Similarity_Single_Axis.on('click',()=>{
  //
  // })


  })
}
