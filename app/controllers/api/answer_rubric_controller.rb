# frozen_string_literal: true

module Api
  # The AnswerRubricController is responsible for handling functions for AnswerRubric
  # within the API, such as CRUD functions for AnswerRubric.
  #
  # This controller should include functions for the table AnswerRubric
  # This api is currently not in use by production
  class AnswerRubricController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_rubric
      rubric = AnswerRubric.new(rubric: params[:rubric], question_id: params[:question_id])

      if rubric.save
        render json: rubric, status: :created
      else
        render json: { error: rubric.errors.messages }, status: 422
      end
    end

    def edit_rubric
      rubric = AnswerRubric.find_by(id: params[:answer_rubric_id])
      rubric.rubric = params[:rubric]

      if rubric.save
        render json: true, status: :ok
      else
        render json: { error: rubric.errors.messages }, status: 422
      end
    end

    def delete_rubric
      rubric = AnswerRubric.find_by(id: params[:answer_rubric_id])

      if rubric.destroy
        head :no_content
      else
        render json: { error: rubric.errors.messages }, status: 422
      end
    end
  end
end
