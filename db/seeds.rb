# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

award = Award.new(badge_name: "Kayaking", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "2", has_results: false, mastery_requirements: 
"Attained Singapore Canoe Federation’s Kayaking 1 Star Personal Skill award.")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "3", has_results: false, mastery_requirements: 
"Attained Singapore Canoe Federation’s Kayaking 2 Star Personal Skill award.")
mastery.save

award = Award.new(badge_name: "Sailing", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "2", has_results: false, mastery_requirements: 
"Participated in the DBS Sailing At The Bay programme

a. 40-50 min session on a weekend afternoon.
b. Aimed at providing more opportunities for everyone to try sailing and enliven the Marina Bay area. These sailing activities are free and open to the public.
c. Session bookings are opened one month before (i.e. the following month'sregistration will open on the 3rd Monday of every month at 12 noon).")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "3", has_results: false, mastery_requirements: 
"Attained SSF Dinghy Proficiency Level 1 Certification OR completed one of the following sailing courses:

a. SAF Yacht Club’s Get Kids Afloat Programme (4-day course for ages 7 to 15)
b. RSYC Basic Sailing Course (Optimist Junior) (4-day course for ages 7 to 13)
c. RSYC Basic Sailing Course (Adult Dinghy) (3-day course for ages 14 and up)
d. CSC Optimist Introductory Sailing Course (4-day course for ages 7 to 13)
e. CSC Adult Dinghy Sailing Course (4-day course for ages 14 and up)")
mastery.save

award = Award.new(badge_name: "Swimming", has_mastery: true)
award.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Basic", recommended_level: "2", has_results: false, mastery_requirements: 
"Attained at least Swimsafer Bronze (Stage 4).")
mastery.save
mastery = Mastery.new(award_id: award.id, mastery_name: "Advanced", recommended_level: "3", has_results: false, mastery_requirements: 
"Attained at least Swimsafer Gold (Level 6).")
mastery.save