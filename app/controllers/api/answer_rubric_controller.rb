# frozen_string_literal: true

module Api
  class AnswerRubricController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def createRubric
      rubric = AnswerRubric.new(rubric: params[:rubric], question_id: params[:question_id])

      if rubric.save
        render json: rubric
      else
        render json: { error: rubric.errors.messages }, status: 422
      end
    end

    def editRubric
      rubric = AnswerRubric.find_by(id: params[:answer_rubric_id])
      rubric.rubric = params[:rubric]

      if rubric.save
        render json: true
      else
        render json: { error: rubric.errors.messages }, status: 422
      end
    end

    def deleteRubric
      rubric = AnswerRubric.find_by(id: params[:answer_rubric_id])

      if rubric.destroy
        head :no_content
      else
        render json: { error: rubric.errors.messages }, status: 422
      end
    end
  end
end
