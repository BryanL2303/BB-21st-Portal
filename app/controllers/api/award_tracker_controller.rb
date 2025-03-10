# frozen_string_literal: true

module Api
  # The AwardTrackerController is responsible for handling functions for AttainedAward
  # within the API, such as CRUD functions.
  class AwardTrackerController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def attainments
      attained_awards = AttainedAward.all

      attainments = {}

      attained_awards.each do |award|
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

      render json: attainments, status: :ok
    end

    def process_changes
      params[:add].each do |values|
        award = Award.find_by(badge_name: values[:award_name])
        next if award.nil?

        attained_award = AttainedAward.new(account_id: values[:account_id], award_id: award.id)
        check_copy = AttainedAward.where(account_id: values[:account_id], award_id: award.id)
        unless values[:mastery_name].nil?
          mastery = Mastery.where(award_id: award.id, mastery_name: values[:mastery_name])[0]
          next if mastery.nil?

          attained_award.mastery_id = mastery.id
          check_copy = AttainedAward.where(account_id: values[:account_id], award_id: award.id,
                                           mastery_id: mastery.id)
        end
        attained_award.save if check_copy == []
      end
      params[:delete].each do |values|
        award = Award.find_by(badge_name: values[:award_name])
        next if award.nil?

        if !values[:mastery_name].nil?
          mastery = Mastery.where(award_id: award.id, mastery_name: values[:mastery_name])[0]
          next if mastery.nil?

          attained_award = AttainedAward.where(account_id: values[:account_id], award_id: award.id,
                                               mastery_id: mastery.id)
        else
          attained_award = AttainedAward.where(account_id: values[:account_id], award_id: award.id)
        end
        attained_award.destroy_all
      end
      attained_awards = AttainedAward.all

      attainments = {}

      attained_awards.each do |award|
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

      render json: attainments, status: :accepted
    end

    def user_awards
      awarded_awards = AttainedAward.where(account_id: @current_user.id).select(:award_id, :mastery_id)

      render json: awarded_awards, status: :ok
    end

    def all_awards
      awards = {}
      all_awards = Award.select(:id, :badge_name, :has_mastery)

      all_awards.each do |award|
        masteries =
          if award.has_mastery
            Mastery
              .where(award_id: award.id)
              .pluck(:id, :mastery_name)
              .map { |id, name| { id:, name: } }
          else
            []
          end

        image_url = find_badge_image(award.badge_name)

        awards[award.badge_name] = { award:, masteries:, image_url: }
      end

      render json: awards, status: :ok
    end

    private

    def find_badge_image(badge_name)
      formatted_name = badge_name.downcase.gsub(/\s+/, '-')
      file = Dir.glob(Rails.root.join("public/assets/*#{formatted_name}*.webp")).first
      file ? "/assets/#{File.basename(file)}" : ''
    end
  end
end
