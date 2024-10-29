# frozen_string_literal: true

module Api
    # The AwardTrackerController is responsible for handling functions for AttainedAward
    # within the API, such as CRUD functions.
    class AwardTrackerController < ApplicationController
      protect_from_forgery with: :null_session
      before_action :authenticate_request
  
      def attainments
        attained_awards = DemoAttainedAward.all
  
        attainments = {}
  
        attained_awards.each do |award|
          account_id = award.demo_account_id
          award_name = DemoAward.find_by(id: award.demo_award_id).badge_name
          if attainments.key?(account_id)
            attainments[account_id][award_name] = {} unless attainments[account_id].key?(award_name)
          else
            attainments[account_id] = {}
            attainments[account_id][award_name] = {}
          end
          unless award.demo_mastery_id.nil?
            mastery_name = DemoMastery.find_by(id: award.demo_mastery_id).mastery_name
            attainments[account_id][award_name][mastery_name] = true
          end
        end
  
        render json: attainments, status: :ok
      end
  
      def process_changes
        params[:add].each do |values|
          award = DemoAward.find_by(badge_name: values[:award_name])
          next if award.nil?
  
          attained_award = DemoAttainedAward.new(demo_account_id: values[:account_id], demo_award_id: award.id)
          check_copy = DemoAttainedAward.where(demo_account_id: values[:account_id], demo_award_id: award.id)
          unless values[:mastery_name].nil?
            mastery = DemoMastery.where(demo_award_id: award.id, mastery_name: values[:mastery_name])[0]
            next if mastery.nil?
  
            attained_award.demo_mastery_id = mastery.id
            check_copy = DemoAttainedAward.where(demo_account_id: values[:account_id], demo_award_id: award.id,
                                             demo_mastery_id: mastery.id)
          end
          attained_award.save if check_copy == []
        end
        params[:delete].each do |values|
          award = DemoAward.find_by(badge_name: values[:award_name])
          next if award.nil?
  
          if !values[:mastery_name].nil?
            mastery = DemoMastery.where(demo_award_id: award.id, mastery_name: values[:mastery_name])[0]
            next if mastery.nil?
  
            attained_award = DemoAttainedAward.where(demo_account_id: values[:account_id], demo_award_id: award.id,
                                                 demo_mastery_id: mastery.id)
          else
            attained_award = DemoAttainedAward.where(demo_account_id: values[:account_id], demo_award_id: award.id)
          end
          attained_award.destroy_all
        end
        attained_awards = DemoAttainedAward.all
  
        attainments = {}
  
        attained_awards.each do |award|
          account_id = award.demo_account_id
          award_name = DemoAward.find_by(id: award.demo_award_id).badge_name
          if attainments.key?(account_id)
            attainments[account_id][award_name] = {} unless attainments[account_id].key?(award_name)
          else
            attainments[account_id] = {}
            attainments[account_id][award_name] = {}
          end
          unless award.demo_mastery_id.nil?
            mastery_name = DemoMastery.find_by(id: award.demo_mastery_id).mastery_name
            attainments[account_id][award_name][mastery_name] = true
          end
        end
  
        render json: attainments, status: :accepted
      end
    end
  end