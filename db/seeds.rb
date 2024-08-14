# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

ComponentField.all.each do |field|
	field.destroy
end
UniformComponent.all.each do |component|
	component.destroy
end

# Creating administrator account for instantiation of website
#administratorAccount = Account.new(password: "manager", account_name: "Administrator",
#	account_type: "Admin")
#administratorAccount.save

uniformComponent = UniformComponent.new(component_name: "Haircut", total_score: 3)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Neat, not covering ears and eyebrows")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Hair is above the collar at the back")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"No artificial coloring")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Personal Grooming", total_score: 2)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Fingernails must be kept short and clean")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Body ornaments such as earrings or necklace should not be worn")
componentField.save

uniformComponent = UniformComponent.new(component_name: "General", total_score: 3)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Frayed threads should be trimmed")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"All fabric should be kept clean and free from stain")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Metal parts such as cap badge, badges, haversack loop, slide, button hole and belt buckle should be shiny and free from stain, rust and mold")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Field Service Cap", total_score: 4)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The cap badge is to be pinned on the left side of the cap")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The field service cap is worn tilted to the right side of the head, two finger breadths above the right ear and right eyebrow")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"White lines should be clean")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"No hair exposed above the forehead")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Uniform", total_score: 6)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Boy should wear the BB Uniform Shirt with the base neatly tucked into his pants")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Shirt must not be torn")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Uniform shirt and pants should be ironed and free from creases")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The sleaves should be rolled up to 4 fingers from elbow joint")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Boy should wear Uniform Pants of the correct length, i.e. just above the ankles while standing")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Pants must not be torn")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Name Tag", total_score: 3)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The regulation silver name tag with black wordings (80mm x 20mm x 1.5mm Silver Gravoply nametag) is worn slightly above the left breast pocket on the Uniform Shirt")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"No stains should be found on the name tag")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Name tag should be aligned straight and parallel to the horizontal edge of the left breast pocket, not slanted")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Haversack", total_score: 5)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The white haversack is worn over the right shoulder with the sling passing under the belt on the left")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The slide should be aligned to the second button of the uniform shirt")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The pouch should rest on the left hip with the top edge of the pouch in line with the top edge of the belt")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The haversack must be washed and kept generally white, free from stains")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Metal parts should be shiny and free from rust or stains")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing or missing parts")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Belt", total_score: 2)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The black leather belt with chrome buckle should be worn fairly tightly around the waist")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The buckle should be in the centre")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Shoes", total_score: 2)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Black leather laced shoes (similar to SAF No. 3 shoes)")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Shoes should be free from mud and stain and relatively shiny")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Socks", total_score: 2)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Boys should only wear dark blue (not black) socks in BB Uniform")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Socks should be long enough to cover any exposed skin when the knees are bent (e.g. when seated)")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Senior's Lanyard", total_score: 4)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The white lanyard is worn around the left shoulder with the long end to the back, secured by a knot to prevent it from slipping")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The end of the remaining length is affixed to the left breast pocket button")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The loop should be aligned to the bottom of the left chest pocket")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Only white-coloured lanyards are to be worn at all times. No coloured lanyards are permitted")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Chevron", total_score: 3)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The chevron is secured by pre-sewn velcro to the uniform")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Chevrons are to be worn on the right arm above the elbow with the V pointing downwards")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The white strip should always be in its original white colour")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Badges", total_score: 2)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The Target Badge is placed first in the first line of the Proficiency badges")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Badges are arranged neatly in alphabetical order, with no more than five in a row")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: -1,
	description: 
"The Anti-Drug Abuse, Heritage, Remembrance Day, Energy Conservation and Civil Defence badges are worn")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: -1,
	description: 
"Missing badges or white and red cloths")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Left Breast Pocket", total_score: 1)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The Total Defence and Link badges, if awarded, should be worn above the name tag, in a central alignment")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing or wrongly arranged")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Not applicable")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Left Arm", total_score: 1)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Only the Senior Proficiency Award, Intermediary Proficiency Award and Juniors Programme Gold Award (in descending order) are to be worn on the left arm")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing or wrongly arranged")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Not applicable")
componentField.save

uniformComponent = UniformComponent.new(component_name: "Cross Belt (SSGs and WOs)", total_score: 3)
uniformComponent.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"Cross belt is worn over the left shoulder, across and above the white haversack")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The front metal boss should be at the intersection of the white haversack")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 1,
	description: 
"The cross belt’s pouch at the back should be hanging diagonally at the bottom right side of the upper body, above the leather belt")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 0,
	description: 
"Missing")
componentField.save
componentField = ComponentField.new(uniform_component_id: uniformComponent.id, score: 3,
	description: 
"Not applicable")
componentField.save