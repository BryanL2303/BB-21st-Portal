# frozen_string_literal: true

module Api
  # The AwardController is responsible for handling functions for Award
  # within the API, such as CRUD functions.
  class DemoAwardController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_award
      find_award = DemoAward.find_by(badge_name: params[:badge_name])

      if find_award.nil?
        if !params[:has_mastery]
          details = params[:details][0]
          award = DemoAward.new(badge_name: params[:badge_name], badge_requirements: details['badge_requirements'],
                            results_description: details['results_description'],
                            recommended_level: details['recommended_level'], has_mastery: params[:has_mastery],
                            require_certification: params[:require_certification])
          if award.save
            render json: award, status: :created
          else
            render json: { error: award.errors.messages }, status: 422
          end
        else
          basic_details = params[:details][0]
          advanced_details = params[:details][1]
          master_details = params[:details][2]
          award = DemoAward.new(badge_name: params[:badge_name], has_mastery: params[:has_mastery])
          if award.save
            basic_mastery = DemoMastery.new(mastery_name: 'Basic',
                                        mastery_requirements: basic_details['badge_requirements'],
                                        results_description: basic_details['results_description'],
                                        recommended_level: basic_details['recommended_level'],
                                        require_certification: basic_details['require_certification'],
                                        demo_award_id: award.id)
            basic_mastery.save
            advanced_mastery = DemoMastery.new(mastery_name: 'Advanced',
                                           mastery_requirements: advanced_details['badge_requirements'],
                                           results_description: advanced_details['results_description'],
                                           recommended_level: advanced_details['recommended_level'],
                                           require_certification: advanced_details['require_certification'],
                                           demo_award_id: award.id)
            advanced_mastery.save
            master_mastery = DemoMastery.new(mastery_name: 'Master',
                                         mastery_requirements: master_details['badge_requirements'],
                                         results_description: master_details['results_description'],
                                         recommended_level: master_details['recommended_level'],
                                         require_certification: master_details['require_certification'],
                                         demo_award_id: award.id)
            master_mastery.save

            render json: award, status: :created
          else
            render json: { error: award.errors.messages }, status: 422
          end
        end
      else
        render json: false, status: :reserved
      end
    end

    def award
      award = DemoAward.find_by(id: params[:id])

      render json: award, status: :ok
    end

    def awards
      awards = DemoAward.all.order('id')
      masteries = []
      awards.each do |award|
        mastery = DemoMastery.where(demo_award_id: award.id).order('id')
        masteries.push(mastery)
      end

      render json: { 'awards': awards, 'masteries': masteries }, status: :ok
    end

    def edit_award
      award = DemoAward.find_by(id: params[:id])

      if !award.has_mastery && !params[:has_mastery]
        details = params[:details][0]
        award['badge_name'] = params[:badge_name]
        award['badge_requirements'] = details['badge_requirements']
        award['results_description'] = details['results_description']
        award['recommended_level'] = details['recommended_level']
        award['require_certification'] = details['require_certification']
        if award.save
          render json: award, status: :accepted
        else
          render json: { error: award.errors.messages }, status: 422
        end
      elsif award.has_mastery && params[:has_mastery]
        award['badge_name'] = params[:badge_name]
        award.save
        basic_details = params[:details][0]
        advanced_details = params[:details][1]
        master_details = params[:details][2]
        basic_mastery = DemoMastery.find_by(id: basic_details['id'])
        basic_mastery['mastery_requirements'] = basic_details['mastery_requirements']
        basic_mastery['results_description'] = basic_details['results_description']
        basic_mastery['recommended_level'] = basic_details['recommended_level']
        basic_mastery['require_certification'] = basic_details['require_certification']
        basic_mastery.save
        advanced_mastery = DemoMastery.find_by(id: advanced_details['id'])
        advanced_mastery['mastery_requirements'] = advanced_details['mastery_requirements']
        advanced_mastery['results_description'] = advanced_details['results_description']
        advanced_mastery['recommended_level'] = advanced_details['recommended_level']
        advanced_mastery['require_certification'] = advanced_details['require_certification']
        advanced_mastery.save
        master_mastery = DemoMastery.find_by(id: master_details['id'])
        master_mastery['mastery_requirements'] = master_details['mastery_requirements']
        master_mastery['results_description'] = master_details['results_description']
        master_mastery['recommended_level'] = master_details['recommended_level']
        master_mastery['require_certification'] = master_details['require_certification']
        master_mastery.save

        render json: award, status: :accepted
      elsif award.has_mastery
        masteries = DemoMastery.where(demo_award_id: params[:id])
        masteries.destroy_all
        award['badge_name'] = params[:badge_name]
        award['badge_requirements'] = details['badge_requirements']
        award['results_description'] = details['results_description']
        award['has_mastery'] = false
        award['recommended_level'] = details['recommended_level']
        award['require_certification'] = details['require_certification']
        if award.save
          render json: award, status: :accepted
        else
          render json: { error: award.errors.messages }, status: 422
        end
      else
        award['badge_name'] = params[:badge_name]
        award['has_mastery'] = true

        basic_details = params[:details][0]
        advanced_details = params[:details][1]
        master_details = params[:details][2]
        basic_mastery = DemoMastery.new(mastery_name: 'Basic', mastery_requirements: basic_details['badge_requirements'],
                                    results_description: basic_details['results_description'],
                                    recommended_level: basic_details['recommended_level'],
                                    require_certification: basic_details['require_certification'], demo_award_id: award.id)
        basic_mastery.save
        advanced_mastery = DemoMastery.new(mastery_name: 'Advanced',
                                       mastery_requirements: advanced_details['badge_requirements'],
                                       results_description: advanced_details['results_description'],
                                       recommended_level: advanced_details['recommended_level'],
                                       require_certification: advanced_details['require_certification'],
                                       demo_award_id: award.id)
        advanced_mastery.save
        master_mastery = DemoMastery.new(mastery_name: 'Master', mastery_requirements: master_details['badge_requirements'],
                                     results_description: master_details['results_description'],
                                     recommended_level: master_details['recommended_level'],
                                     require_certification: master_details['require_certification'],
                                     demo_award_id: award.id)
        master_mastery.save
        if award.save
          render json: award, status: :accepted
        else
          render json: { error: award.errors.messages }, status: 422
        end
      end
    end

    def masteries
      masteries = DemoMastery.where(demo_award_id: params[:award_id]).order('id')

      render json: masteries, status: :ok
    end

    def columns
      columns = DemoCustomColumn.where(demo_award_id: params[:id])

      render json: columns, status: :ok
    end

    def delete_award
      award = DemoAward.find_by(id: params[:id])
      masteries = DemoMastery.where(demo_award_id: award['id'])
      masteries.destroy_all
      quizzes = DemoQuiz.where(demo_award_id: award['id'])
      assignments = DemoAssignment.where(demo_quiz_id: quizzes['id'])
      assigned_accounts = DemoAssignedAccount.where(demo_assignment_id: assignments['id'])
      assigned_accounts.destroy_all
      assignments.destroy_all
      quizzes.destroy_all
      questions = DemoQuestion.where(demo_award_id: award['id'])
      questions.destroy_all

      if award.destroy
        head :no_content
      else
        render json: { error: award.errors.messages }, status: 422
      end
    end
  end
end
