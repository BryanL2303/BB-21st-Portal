# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

award = Award.new(badge_name: 'Intermediary Proficiency Award', recommended_level: '2', has_mastery: false,
                  custom_description: false,
                  has_custom_columns: false, has_results: false, has_pass: false, badge_requirements:
                 "Refer to the awards tracker table for all the badges required for IPA.
                  Once all badges required have been approved through 32A application for IPA can be done.")
award.save

award = Award.new(badge_name: 'Senior Proficiency Award', recommended_level: '2', has_mastery: false,
                  custom_description: false,
                  has_custom_columns: false, has_results: false, has_pass: false, badge_requirements:
                 "Refer to the awards tracker table for all the badges required for SPA.
                  Once all badges required have been approved through 32A application for SPA can be done.")
award.save

award = Award.new(badge_name: "Founder's Award (only SSGs and WOs can apply)", recommended_level: '4',
                  has_mastery: false, custom_description: false,
                  has_custom_columns: false, has_results: false, has_pass: false, badge_requirements:
                 "Refer to the awards tracker table for all the prerequisites to begin applications for Founder's Award.
                  The application form must be opened by the Captain to begin the process of application.
                  A series of assessments will begin afterwards taking into account but not limited to the
                  Boys leadership, general performance, school records, contributions to the company.
                  As such attaining all the badges required is just a
                  prerequisite and there are no guarantees for attainment of the award.")
award.save

award = Award.new(badge_name: 'Link Badge', recommended_level: '1', has_mastery: false, custom_description: false,
                  has_custom_columns: false, has_results: true, has_pass: true, badge_requirements:
                 "Awarded to Sec 1 Boys who were members of the Juniors Programme.",
                  results_description:
                 "Boys were members in the Juniors Programme and have completed the requirements for the award during
                  their last session in the Juniors Programme.")
award.save

award = Award.new(badge_name: '1 Year Service (First Year)', recommended_level: '1', has_mastery: false,
                  custom_description: false,
                  has_custom_columns: false, has_results: false, has_pass: false, badge_requirements:
                 "Awarded to Boys who have served with good conduct and have attended a minimum of 25 parades.
                  Attach the attendance file for the year as 32A results.")
award.save

award = Award.new(badge_name: '1 Year Service (Second Year)', recommended_level: '2', has_mastery: false,
                  custom_description: false,
                  has_custom_columns: false, has_results: false, has_pass: false, badge_requirements:
                 "Awarded to Boys who have served with good conduct and have attended a minimum of 25 parades.
                  Attach the attendance file for the year as 32A results.")
award.save

award = Award.new(badge_name: '1 Year Service (Third Year)', recommended_level: '3', has_mastery: false,
                  custom_description: false,
                  has_custom_columns: false, has_results: false, has_pass: false, badge_requirements:
                 "Awarded to Boys who have served with good conduct and have attended a minimum of 25 parades.
                  Attach the attendance file for the year as 32A results.")
award.save

award = Award.new(badge_name: '3 Year Service', recommended_level: '3', has_mastery: false,
                  custom_description: false,
                  has_custom_columns: false, has_results: false, has_pass: false, badge_requirements:
                 "Awarded to Boys who have achieved 1 Year Service (Third Year).
                  Once 32A for 1 Year Service (Third Year) has been approved application for 3 Year Service
                  can be done.")
award.save

award = Award.new(badge_name: 'National Event', has_mastery: false,
                  custom_description: true,
                  description_cue: 'Provide a description of the event attended.',
                  has_custom_columns: false, has_results: true, has_pass: true, badge_requirements:
                 "Awarded to Boys who have represented The Boys' Brigade in Singapore in the National Day Parade or
                  other national events approved by the Seniors Programme Committee.
                  For other events check with the Captain if it has been approved before submitting the 32A.")
award.save
