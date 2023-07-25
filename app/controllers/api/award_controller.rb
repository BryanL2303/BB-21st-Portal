module Api
	class AwardController < ApplicationController
		protect_from_forgery with: :null_session

		def createAward
			findAward = Award.find_by(badge_name: params[:badge_name])

			if findAward == nil
				if !params[:has_mastery]
					details = params[:details][0]
					award = Award.new(badge_name: params[:badge_name], badge_requirements: details['badge_requirements'], results_description: details['results_description'], recommended_level: details['recommended_level'], has_mastery: params[:has_mastery], require_certification: params[:require_certification])
					if award.save
						render json: award
					else
						render json: {error: award.errors.messages}, status: 422
					end
				else
					basicDetails = params[:details][0]
					advancedDetails = params[:details][1]
					masterDetails = params[:details][2]
					award = Award.new(badge_name: params[:badge_name], has_mastery: params[:has_mastery])
					if award.save
						basicMastery = Mastery.new(mastery_name: "Basic", mastery_requirements: basicDetails['badge_requirements'], results_description: basicDetails['results_description'], recommended_level: basicDetails['recommended_level'], require_certification: basicDetails['require_certification'], award_id: award.id)
						basicMastery.save
						advancedMastery = Mastery.new(mastery_name: "Advanced", mastery_requirements: advancedDetails['badge_requirements'], results_description: advancedDetails['results_description'], recommended_level: advancedDetails['recommended_level'], require_certification: advancedDetails['require_certification'], award_id: award.id)
						advancedMastery.save
						masterMastery = Mastery.new(mastery_name: "Master", mastery_requirements: masterDetails['badge_requirements'], results_description: masterDetails['results_description'], recommended_level: masterDetails['recommended_level'], require_certification: masterDetails['require_certification'], award_id: award.id)
						masterMastery.save

						render json: award
					else
						render json: {error: award.errors.messages}, status: 422
					end
				end
			else
				render json: false
			end
		end

		def getAward
			award = Award.find_by(id: params[:id])
			
			render json: award
		end

		def getAwards
			awards = Award.all.order('badge_name')
			
			render json: awards
		end

		def editAward
			award = Award.find_by(id: params[:id])

			if !award.has_mastery && !params[:has_mastery]
				details = params[:details][0]
				award['badge_name'] = params[:badge_name]
				award['badge_requirements'] = details['badge_requirements']
				award['results_description'] = details['results_description']
				award['recommended_level'] = details['recommended_level']
				award['require_certification'] = details['require_certification']
				if award.save
					render json: award
				else
					render json: {error: award.errors.messages}, status: 422
				end
			else
				if award.has_mastery && params[:has_mastery]
					award['badge_name'] = params[:badge_name]
					award.save
					basicDetails = params[:details][0]
					advancedDetails = params[:details][1]
					masterDetails = params[:details][2]
					basicMastery = Mastery.find_by(id: basicDetails['id'])
					basicMastery['mastery_requirements'] = basicDetails['mastery_requirements']
					basicMastery['results_description'] = basicDetails['results_description']
					basicMastery['recommended_level'] = basicDetails['recommended_level']
					basicMastery['require_certification'] = basicDetails['require_certification']
					basicMastery.save
					advancedMastery = Mastery.find_by(id: advancedDetails['id'])
					advancedMastery['mastery_requirements'] = advancedDetails['mastery_requirements']
					advancedMastery['results_description'] = advancedDetails['results_description']
					advancedMastery['recommended_level'] = advancedDetails['recommended_level']
					advancedMastery['require_certification'] = advancedDetails['require_certification']
					advancedMastery.save
					masterMastery = Mastery.find_by(id: masterDetails['id'])
					masterMastery['mastery_requirements'] = masterDetails['mastery_requirements']
					masterMastery['results_description'] = masterDetails['results_description']
					masterMastery['recommended_level'] = masterDetails['recommended_level']
					masterMastery['require_certification'] = masterDetails['require_certification']
					masterMastery.save

					render json: award
				else
					if award.has_mastery
						masteries = Mastery.where(award_id: params[:id])
						masteries.destroy_all
						award['badge_name'] = params[:badge_name]
						award['badge_requirements'] = details['badge_requirements']
						award['results_description'] = details['results_description']
						award['has_mastery'] = false
						award['recommended_level'] = details['recommended_level']
						award['require_certification'] = details['require_certification']
						if award.save
							render json: award
						else
							render json: {error: award.errors.messages}, status: 422
						end
					else
						award['badge_name'] = params[:badge_name]
						award['has_mastery'] = true

						basicDetails = params[:details][0]
						advancedDetails = params[:details][1]
						masterDetails = params[:details][2]
						basicMastery = Mastery.new(mastery_name: "Basic", mastery_requirements: basicDetails['badge_requirements'], results_description: basicDetails['results_description'], recommended_level: basicDetails['recommended_level'], require_certification: basicDetails['require_certification'], award_id: award.id)
						basicMastery.save
						advancedMastery = Mastery.new(mastery_name: "Advanced", mastery_requirements: advancedDetails['badge_requirements'], results_description: advancedDetails['results_description'], recommended_level: advancedDetails['recommended_level'], require_certification: advancedDetails['require_certification'], award_id: award.id)
						advancedMastery.save
						masterMastery = Mastery.new(mastery_name: "Master", mastery_requirements: masterDetails['badge_requirements'], results_description: masterDetails['results_description'], recommended_level: masterDetails['recommended_level'], require_certification: masterDetails['require_certification'], award_id: award.id)
						masterMastery.save
						if award.save
							render json: award
						else
							render json: {error: award.errors.messages}, status: 422
						end
					end
				end
			end
		end

		def getMasteries
			masteries = Mastery.where(award_id: params[:award_id]).order('id')

			render json: masteries
		end

		def getQuizzes
			
		end

		def getQuestions
			
		end

		def deleteAward
			award = Award.find_by(id: params[:id])
			masteries = Mastery.where(award_id: award['id'])
			masteries.destroy_all
			quizzes = Quiz.where(award_id: award['id'])
			quizzes.destroy_all
			questions = Question.where(award_id: award['id'])
			questions.destroy_all

			if award.destroy
				head :no_content
			else
				render json: {error: award.errors.messages}, status: 422
			end
		end
	end
end