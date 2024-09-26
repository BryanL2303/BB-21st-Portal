# frozen_string_literal: true

module Api
  # The MasteryController is responsible for handling functions for Mastery
  # within the API, such as CRUD functions.
  class MasteryController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_mastery
      mastery = Mastery.new(mastery_name: params[:mastery_name], mastery_requirements: params[:mastery_requirements],
                            results_description: params[:results_description],
                            recommended_level: params[:recommended_level])
      if mastery.save
        render json: mastery
      else
        render json: { error: mastery.errors.messages }, status: 422
      end
    end

    def mastery
      mastery = Mastery.find_by(id: params[:id])

      render json: mastery
    end

    def columns
      columns = CustomColumn.where(mastery_id: params[:id])

      render json: columns
    end

    def questions; end

    def delete_award
      if topic.destroy
        head :no_content
      else
        render json: { error: topic.errors.messages }, status: 422
      end
    end
  end
end
