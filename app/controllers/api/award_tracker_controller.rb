# frozen_string_literal: true

module Api
  class AwardTrackerController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def getAttainments
      attainedAwards = AttainedAward.all

      attainments = {}

      attainedAwards.each do |award|
        account_id = award.account_id
        award_name = Award.find_by(id: award.award_id).badge_name
        if attainments.key?(account_id)
          attainments[account_id][award_name] = {} unless attainments[account_id].key?(award_name)
        else
          attainments[account_id] = {}
          attainments[account_id][award_name] = {}
        end
        unless award.mastery_id.nil?
          mastery_name = Mastery.find_by(id: award.mastery_id).mastery_name
          attainments[account_id][award_name][mastery_name] = true
        end
      end

      render json: attainments
    end

    def processChanges
      params[:add].each do |values|
        award = Award.find_by(badge_name: values[:award_name])
        if award.nil?
          render json: 'Award does not exist'
          return
        end
        attainedAward = AttainedAward.new(account_id: values[:account_id], award_id: award.id)
        checkCopy = AttainedAward.where(account_id: values[:account_id], award_id: award.id)
        unless values[:mastery_name].nil?
          mastery = Mastery.where(award_id: award.id, mastery_name: values[:mastery_name])[0]
          if mastery.nil?
            render json: 'Mastery does not exist'
            return
          end
          attainedAward.mastery_id = mastery.id
          checkCopy = AttainedAward.where(account_id: values[:account_id], award_id: award.id,
                                          mastery_id: mastery.id)
        end
        attainedAward.save if checkCopy == []
      end
      params[:delete].each do |values|
        award = Award.find_by(badge_name: values[:award_name])
        if award.nil?
          render json: 'Award does not exist'
          return
        end
        if !values[:mastery_name].nil?
          mastery = Mastery.where(award_id: award.id, mastery_name: values[:mastery_name])[0]
          if mastery.nil?
            render json: 'Mastery does not exist'
            return
          end
          attainedAward = AttainedAward.where(account_id: values[:account_id], award_id: award.id,
                                              mastery_id: mastery.id)
        else
          attainedAward = AttainedAward.where(account_id: values[:account_id], award_id: award.id)
        end
        attainedAward.destroy_all
      end
      attainedAwards = AttainedAward.all

      attainments = {}

      attainedAwards.each do |award|
        account_id = award.account_id
        award_name = Award.find_by(id: award.award_id).badge_name
        if attainments.key?(account_id)
          attainments[account_id][award_name] = {} unless attainments[account_id].key?(award_name)
        else
          attainments[account_id] = {}
          attainments[account_id][award_name] = {}
        end
        unless award.mastery_id.nil?
          mastery_name = Mastery.find_by(id: award.mastery_id).mastery_name
          attainments[account_id][award_name][mastery_name] = true
        end
      end

      render json: attainments
    end
  end
end
