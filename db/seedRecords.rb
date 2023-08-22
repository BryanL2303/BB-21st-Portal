# This is a record, cannot be run since it will affect other tables entries

CustomColumn.all.each do |custom_column|
	custom_column.destroy
end
Mastery.all.each do |mastery|
	mastery.destroy
end
Award.all.each do |award|
	award.destroy
end

award = Award.new(badge_name: "Target", recommended_level: "1", has_mastery: 0, custom_description: 0, has_custom_columns: 0, has_results: true, has_pass: 0, 
	badge_requirements: 
"Boys' must go through assignments and worksheets to cover the following content: 
1. Brief history and tradition of the BB 
2. The BB Singapore Story 
3. Overview of BB International and BB Asia 
4. BB vesper and table grace 
5. BB Songs: The Anchor Song and Mighty Band of Brothers 
6. BB object, motto and logo 
7. Uniform: wearing and cleaning 
8. Introduction to awards scheme 
9. Company life and history 
10. Company organisation and ranks", 
	results_description: "Boys completed 2 induction parades and are oriented with basic knowledge of The Boys' Brigade")
award.save

award = Award.new(badge_name: "Christian Education", recommended_level: "3", has_mastery: false, custom_description: false, has_custom_columns: false, has_results: true, has_pass: false, 
	badge_requirements: 
"DEDICATED CHRISTIAN EDUCATION SESSIONS

- Awarded to Boys who have undergone a minimum of 24 sessions of an approved Christian Education syllabus over a period of 3 years.
- Companies opting for this track are to send a copy of the following to the BBHQ’s Programmes Department for approval before the implementation of the Christian Education syllabus:
1. An outline of the syllabus listing course aims, learning outcomes and assessment modes.
2. Samples of 3 lesson plans.
3. Samples of worksheets and activities.", 
	results_description: "Boys have undergone over 24 sessions of approved Christian Education syllabus over a period of 3 years.")
award.save

award = Award.new(badge_name: "Total Defence", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false, 
	mastery_requirements: 
"Awarded to Boys who have:

1. Completed a lesson on TD via Student Learning Space (SLS) . (30 mins)
2. Played “Guardians of the City II” (GOTC II) TD strategy card game. (60 mins)
3. Designed and shared a new “Action” card for the GOTC II card game. (30 mins)
4. Completed an introduction to CPR-AED (as part of the school’s PE curriculum).

Officers may download the latest TD Lesson Plans from Officers Portal > Resources > Seniors > New SP Curriculum > Total Defence.", 
	results_description: "Boys have completed SLS lessons, played GOTC II, designed and shared a new \"Action\" card for the game and also completed an introduction to CPR-AED as part of school's PE curriculum.")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false, 
	mastery_requirements: 
"Awarded to Boys who have attained TD (Basic) and:

1. Submitted a storyboard for N.E.mation! on one of the 6 TD pillars. (90 mins)
2. Taught at least a pair of peers how to play the GOTC II card game or assisted in the facilitation of gameplay of at least a pair of peers at a GOTC II gameplay session and completed a reflection. (90 mins)

Officers may download the latest TD Lesson Plans from Officers Portal > Resources > Seniors > New SP Curriculum > Total Defence.", 
	results_description: "Boys have submitted storyboard for N.E.mation! on one of the 6 TF pillers and also facilitated a pair of peers in GOTC II gameplay.")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Master", recommended_level: "3", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false, 
	mastery_requirements: 
"Awarded to Boys who have attained TD (Advanced) and:

1. Initiated, planned, and executed a TD-related VIA project that benefits the  community at large (individually or in groups) and completed a reflection or joined a volunteer scheme approved by Nexus.
2. Completed CPR-AED certification. (4 hours) In addition, Boys may choose to complete an optional Psychological First Aid certification. (8 hours)

Officers may download the latest TD Lesson Plans from Officers Portal > Resources > Seniors > New SP Curriculum > Total Defence.", 
	results_description: "Boys have planned and executed a TD related VIA project benefiting the community and also completed CPR-AED certification.")
mastery.save

award = Award.new(badge_name: "Community Spiritedness", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: true, has_custom_columns: true, has_results: true, has_pass: false, description_cue: "Title and date of the stakeholder event, also provide a brief description of the stakeholderevent as well as which stakeholder was engaged",
	mastery_requirements: 
"Awarded to Boys who have

1. Completed the following 3 CS lessons:
    1. C1.1 - Identifying Who & How to Help
    2. C1.2 - Identifying Ways to Serve
    3. C1.3 - Working Together
2. Carried out at least 15 hours of community service through BB CARES and/or BBSG.
3. Raised awareness / participated in an *event with a stakeholder at a level that requires low-level coordination and no client interaction. Examples include:
    1. Distributing flyers for a church funfair.
    2. Participating in a parent-child bonding activity run by other organisations (e.g. paintball, trekking, futsal/ soccer match).
    3. Serving in the school’s Founder’s Day celebrations.

**This event should not coincide with the BB CARES or BBSG event used to fulfill the 15 hours of community service.*", 
	results_description: "Boys have completed 15 hours of community service through BB CARES or BBSG and also participated in a stakeholder event")
mastery.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "BB Cares hrs")
custom_column.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "SGB hrs")
custom_column.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "Role in stakeholder event")
custom_column.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: true, has_custom_columns: true, has_results: true, has_pass: false, description_cue: "Title and date of the stakeholder event, also provide a brief description of the stakeholderevent as well as which stakeholder was engaged",
	mastery_requirements: 
"Awarded to Boys who attained CS (Basic) and

1. Completed the following 3 CS lessons:
    1. C2.1 - Who to Help – Profiling
    2. C2.2 - Organising Help – Priorities
    3. C2.3 - Finishing Well – Reflections
2. Carried out at least an additional 15 hours of community service through BB CARES and/or BBSG.
3. Raised support / provided support to the organising committee in an *event with a stakeholder at a level that requires mid-level coordination and some client interaction. Examples include:
    1. Participating in an old clothes collection (e.g. give out pamphlets beforehand and collect old clothes for mission trip needs).
    2. Hosting a segment of a parent-child bonding activity / appreciation lunch.
    3. Assisting to pack and deliver goodie bags to the school staff or construction workers working on the school expansion program.

**This event should not coincide with the BB CARES or BBSG event used to fulfill the 15 hours of community service.*", 
	results_description: "Boys have completed 15 hours of community service through BB CARES or BBSG and also supported the organising committee in a stakeholder event")
mastery.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "BB Cares hrs")
custom_column.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "SGB hrs")
custom_column.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "Role in stakeholder event")
custom_column.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Master", recommended_level: "3", custom_description: true, has_custom_columns: true, has_results: true, has_pass: false, description_cue: "Title and date of the stakeholder event, also provide a brief description of the stakeholderevent as well as which stakeholder was engaged",
	mastery_requirements: 
"Awarded to Boys who attained CS (Advanced) and

1. Completed the following 3 CS lessons:
    1. C3.1 - Serving the Church
    2. C3.2 - Celebrating Family
    3. C3.3 - Serving The School
2. Completed the required FAA duties as part of BBSG.
3. Provided direct service / organised and executed an event with a stakeholder at a level that requires high-level coordination and close client interaction. Examples include:
    1. Lead a home-spring cleaning project for low-income families that the church is supporting.
    2. Organise and execute a Family Day event where the Boys’ parents are invited to mingle with the Company through a series of fun activities.
    3. Partner with a VWO to co-organise an outing for down syndrome or autistic children, with Boys coming alongside as helpers during the outing.

**This event should not coincide with the BB CARES or BBSG event used to fulfill the 15 hours of community service.*", 
	results_description: "Boys have completed FAA duties for BBSG and also organised and executed a stakeholder event")
mastery.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "Role in stakeholder event")
custom_column.save

award = Award.new(badge_name: "Global Awareness", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false,
	mastery_requirements: 
"Awarded to Boys who have completed lessons on any 2 of the following 13 global issues selected by BBHQ and completed their reflections*:

- G1.1 - Literacy
- G1.2 - Poverty
- G1.3 - Food
- G1.4 - Health
- G1.5 - Pollution
- G1.6 - Climate Change
- G1.7 - Resource Depletion
- G1.8 - Animal Exploitation
- G1.9 - Energy
- G1.10 - Water
- G1.11 - Terrorism
- G1.12 - Global Cities
- G1.13 - Artificial Intelligence

**Companies may choose to adopt Borton’s Reflection Model (refer to “Additional Notes”) but are free to tailor the reflection questions to their Boys.*", 
	results_description: "Boys have completed lessons on 2 global issues and completed their reflections on the lessons.")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false,
	mastery_requirements: 
"Awarded to Boys who attained GA (Basic) and

1. Completed the following 3 GA keystone lessons:
    1. G2.1 - Global Relations
    2. G2.2 - Social Entrepreneurship
    3. G2.3 - Research Skills
2. Completed a guided research and write-up/presentation on any 1 of the above 13 global issues selected by BBHQ.", 
	results_description: "Boys have completed all 3 keystone lessons followed by a guided research and presentation on 1 of the global issues")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Master", recommended_level: "3", custom_description: false, has_custom_columns: false, has_results: false, has_pass: false,
	mastery_requirements: 
"Awarded to Boys who attained GA (Advanced) and completed a Social Entrepreneurship Project with action plans to solve problems of a chosen topic (from the list of 13 issues). The project’s topic and chosen country/community of interest should be of a global (not local) setting. The project is to be submitted to BBHQ for assessment and may adopt, though not restricted to, the following presentation formats:

1. Presentation Slides
2. Video of Presentation
3. Infographic / Poster
4. Vlog / Short Documentary / Recorded Skit")
mastery.save

award = Award.new(badge_name: "Leadership", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false,
	mastery_requirements: 
"Complete the following 6 lessons

Relationship (L1)
1. L1.1 - Team Building
2. L1.2 - Resolving Conflict
3. L1.3 - Affirming and Appreciation
Communication (L2)
1. L2.1 - Public Speaking
2. L2.2 - Representing Ideas
3. L2.3 - Audience Awareness", 
	results_description: "Boys have completed 6 leadership lessons")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false,
	mastery_requirements: 
"Complete the following 6 lessons

Planning (L3)
1. L3.1 - Organising and Executing
2. L3.2 - Managing Resources
3. L3.3 - Visioning
Facilitation (L4)
1. L4.1 - Leading Group Reflection
2. L4.2 - Dealing with Differences
3. L4.3 - Concluding with Agreement", 
	results_description: "Boys have completed an additional 6 leadership lessons")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Master", recommended_level: "3", custom_description: false, has_custom_columns: false, has_results: false, has_pass: false,
	mastery_requirements: "Pass National Leadership Camp (NLC)")
mastery.save

award = Award.new(badge_name: "Adventure", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false,
	mastery_requirements: 
"Awarded to Boys who have

1. Completed the following 5 Adventure lessons and demonstrated practical competency in the specified fields:
- P1.1 - Compass, Topographical Map
- P1.2 - Using a Map and Compass
- P1.3 - Basic Knots
- P1.4 - [Country Code](https://www.notion.so/9e82abe1330840f18e3d9286c7169186?pvs=21), Movement on Terrain
- P1.5 - Expedition Log, Packing for Extended Expedition

2. Completed a 10 km expedition on foot which requires the above 5 lessons to be put into practice.", 
	results_description: "Boys have completed 5 Adventure lessons and completed 10km expedition on foot, displaying practical competency in the process.")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false,
	mastery_requirements: 
"Awarded to Boys who have attained Adventure (Basic) and

1. Completed the following 5 Adventure lessons and demonstrated practical competency in the specified fields:
    - P1.6 - Recap Compass and Map
    - P1.7 - Knots, Hitches and Lashings
    - P1.8 - Tents and shelters
    - P1.9 - Choosing a Campsite
    - P1.10 - Expedition Planning

2. Completed a 16 km expedition on foot through which the 10 Adventure lessons (across Basic and Advanced levels) may be put into practice.", 
	results_description: "Boys have completed 5 Adventure lessons and completed 16km expedition on foot, putting into practice everything they have learnt across all 10 Adventure lessons.")
mastery.save

award = Award.new(badge_name: "Drill", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false,
	mastery_requirements: 
"Awarded to Boys who have completed the following 10 Drill lessons and passed the practical assessment:
1. Attention, Stand at Ease, Stand Easy
2. Salute, Dismissal
3. Turns, Marching in Quick Time
4. Marking Time, Marching off from Slow Time
5. Recap Lessons for the above
6. Change Direction by wheeling, Saluting on the March
7. Pledge Taking, Receiving Awards, Caps Off
8. Fall In, Roll Call
9. Recap Lessons for the above
10. Assessment", 
	results_description: "Boys' have completed the curriculum and passed the practical assessment")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: false, has_custom_columns: false, has_results: true, has_pass: false,
	mastery_requirements: 
"Awarded to Boys who have attained Drill Basic and completed the following 10 Drill lessons with practical competency in the specified commands:
1. Paces, Turns on the March
2. Salute Right
3. Sizing
4. Forming Squad
5. Practice lessons 1-2
6. Practice lessons 3-4
7. Flag Party and Escorts, Guard of Honour
8. Roles of Different Commanders
9. Cane Drill
10. Recap Lessons 1-4

Drill (Advanced) does not require a practical assessment and can be attained as long as the Boy attends all 10 Drill (Advanced) lessons and can execute the specified drill movements.", 
	results_description: "Boys' have completed the curriculum and can execute the specified drill movements")
mastery.save

award = Award.new(badge_name: "Arts & Crafts", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: true, has_custom_columns: false, has_results: true, has_pass: true, description_cue: "Description of the Arts and Crafts activity done.", 
	mastery_requirements: 
"Officers are to facilitate the learning of the badgework and reflection in 4 lessons for each level, inclusive of a Character Excellence value per lesson.

Awarded to Boys who have participated in an Arts or Crafts activity where a minimum of 7 hours of practical work is required.")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: true, has_custom_columns: false, has_results: true, has_pass: true, description_cue: "Description of the Arts and Crafts activity done.", 
	mastery_requirements: 
"Officers are to facilitate the learning of the badgework and reflection in 4 lessons for each level, inclusive of a Character Excellence value per lesson.

Awarded to Boys who have attained the Basic Arts & Crafts award and haveparticipated in an Arts or Crafts activity where a minimum of additional 12 hours of practicalwork is required.")
mastery.save

award = Award.new(badge_name: "Athletics", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: false, has_custom_columns: true, has_results: true, has_pass: true,
	mastery_requirements: 
"Officers are to facilitate the learning of the badgework and reflection in 2 lessons for each level, inclusive of a Character Excellence value per lesson.

Awarded to Boys who attain a minimum of Level 1 in any two of the eventsmentioned in the table below.", 
	results_description: "Boys' have attain level 1 for at least 2 of the events provided by HQ.")
mastery.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "Date of assessment")
custom_column.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: false, has_custom_columns: true, has_results: true, has_pass: true,
	mastery_requirements: 
"Officers are to facilitate the learning of the badgework and reflection in 2 lessons for each level, inclusive of a Character Excellence value per lesson.

Awarded to Boys who have attained the Basic Athletics award and attained Level2 in any two of the events mentioned in the table below", 
	results_description: "Boys' have attain level 2 for at least 2 of the events provided by HQ.")
mastery.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "Date of assessment")
custom_column.save

award = Award.new(badge_name: "First Aid", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "2", custom_description: false, has_custom_columns: false, has_results: false, has_pass: false,
	mastery_requirements: 
"Officers are to facilitate reflection and guidance in one pre-course and one post-courseCharacter Excellence lesson.

The list of pre-approved first aid courses is available in the Annex of this document (page 7) https://bbsp.notion.site/Personal-Mastery-e8a79eb739934efabf2b0d1481a5f6ae.
	
Awarded to Boys who:
a. Attend a 2-day first aid course lasting about 15 hours; and
b. Pass with certification the necessary theory and practical assessments administeredby the vendor")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "3", custom_description: false, has_custom_columns: false, has_results: false, has_pass: false,
	mastery_requirements: 
"Officers are to facilitate reflection and guidance in one pre-course and one post-courseCharacter Excellence lesson.

The list of pre-approved first aid courses is available in the Annex of this document (page 7) https://bbsp.notion.site/Personal-Mastery-e8a79eb739934efabf2b0d1481a5f6ae.
	
Awarded to Boys who (either i. or ii.):
i. attend a 2-day first aid course that includes AED (automated external defibrillator) component, lasting about 15 hours; or
ii. have attained the Basic First Aid award and attend the 4-hour CPR+AED coursefunded by Temasek Foundation as part of the Total Defence programme;

and Pass with certification the necessary theory and practical assessments administeredby the vendor; and
Perform 8 hours of First Aid duty in the school or community, after completion of first 2 requirements")
mastery.save

award = Award.new(badge_name: "Hobbies", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: true, has_custom_columns: false, has_results: true, has_pass: true, description_cue: "Description of activity and work done.", 
	mastery_requirements: 
"Officers are to facilitate the learning of the badgework and reflection in 4 lessons for eachlevel, inclusive of a Character Excellence value per lesson.

Awarded to Boys who have participated in a Hobbies activity over a period of at least 3 months, with a minimum of 7 hours of practical work required.

Boys may carry out work on an individual or group basis. Boys must comply with the following:
a. Submit work at regular intervals when required for inspection.
b. Keep a logbook of time spent and work done.
c. Present the end result for assessment by someone knowledgeable.

List of suggested subjects:
a. Collection-Related
b. Do-It-Yourself-Related
c. Activity Related")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: true, has_custom_columns: false, has_results: true, has_pass: true, description_cue: "Description of activity and work done.", 
	mastery_requirements: 
"Officers are to facilitate the learning of the badgework and reflection in 4 lessons for eachlevel, inclusive of a Character Excellence value per lesson.

Awarded to Boys who have attained the Basic Hobbies award and haveparticipated in a Hobbies activity over a period of at least an additional 3 months, with aminimum of additional 12 hours of practical work is required.

Boys may carry out work on an individual or group basis. Boys must comply with the following:
a. Submit work at regular intervals when required for inspection.
b. Keep a logbook of time spent and work done.
c. Present the end result for assessment by someone knowledgeable.

List of suggested subjects:
a. Collection-Related
b. Do-It-Yourself-Related
c. Activity Related")
mastery.save

award = Award.new(badge_name: "Musketry", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: true, has_custom_columns: true, has_results: true, has_pass: true, description_cue: "Description of instructors and assessment", 
	mastery_requirements: 
"Officers are to facilitate reflection and guidance in one pre-course and one post-course Character Excellence lesson.

Due to the nature of this activity, it is imperative that all sessions are conducted by trained Rifle Instructors who are recognised by the Ministry of Education. This is to ensure proper use of weapons and overall safety of the participants and conducting Officers/instructors.

Boys should concentrate on the mastery of any one weapon for the purpose of attainingtheir Musketry Award.

An assessment should be conducted by the instructor at the end of the course with thefollowing criteria:

a. Air-Rifle or Air Pistol: Grouping size of 6 out of 10 shots within 1-ring.
b. Clay Target Shooting: 20 shots on straight away targets, 4 hits to pass.")
mastery.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "Type of weapon")
custom_column.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "Date of assessment")
custom_column.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: true, has_custom_columns: true, has_results: true, has_pass: true, description_cue: "Description of instructors and assessment", 
	mastery_requirements: 
"Officers are to facilitate reflection and guidance in one pre-course and one post-course Character Excellence lesson.

Due to the nature of this activity, it is imperative that all sessions are conducted by trained Rifle Instructors who are recognised by the Ministry of Education. This is to ensure proper use of weapons and overall safety of the participants and conducting Officers/instructors.

Boys should concentrate on the mastery of any one weapon for the purpose of attainingtheir Musketry Award.

An assessment should be conducted by the instructor at the end of the course with thefollowing criteria:

a. Air-Rifle or Air Pistol: 30 shots competition, 150 points to pass.
b. Clay Target Shooting: 20 shots on away straight targets, 6 hits to pass")
mastery.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "Type of weapon")
custom_column.save
custom_column = CustomColumn.new(mastery_id: mastery.id, column_title: "Date of assessment")
custom_column.save

award = Award.new(badge_name: "Sportsman", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "1", custom_description: true, has_custom_columns: false, has_results: true, has_pass: false, description_cue: "Description of activities", 
	mastery_requirements: 
"Officers are to facilitate the learning of the badgework and reflection in 4 lessons for each level, inclusive of a Character Excellence value per lesson.

Awarded to Boys who have learnt one team sport in at least 4 lessons.")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "2", custom_description: true, has_custom_columns: false, has_results: true, has_pass: false, description_cue: "Description of activities and intra/inter company games", 
	mastery_requirements: 
"Officers are to facilitate the learning of the badgework and reflection in 4 lessons for each level, inclusive of a Character Excellence value per lesson.

Awarded to Boys who have attained the Basic Sportsman award, learnt one other team sport in 4 lessons, and have competed in one other intra-Company competition or one inter-Company competition")
mastery.save