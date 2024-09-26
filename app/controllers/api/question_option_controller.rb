# frozen_string_literal: true

module Api
  # The QuestionOptionController is responsible for handling functions for QuestionOption
  # within the API, such as CRUD functions.
  #
  # This api is currently not in use by production
  class QuestionOptionController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_option
      question_option = QuestionOption.new(question: params[:question], answer: params[:answer],
                                           correct: params[:correct], question_id: params[:question_id])

      if question_option.save
        render json: true
      else
        render json: { error: question_option.errors.messages }, status: 422
      end
    end

    def edit_option
      question_option = QuestionOption.find_by(id: params[:question_option_id])
      question_option.question = params[:question]
      question_option.answer = params[:answer]
      question_option.correct = params[:correct]

      if question_option.save
        render json: true
      else
        render json: { error: question_option.errors.messages }, status: 422
      end
    end

    def delete_option
      question_option = QuestionOption.find_by(id: params[:question_option_id])

      if question_option.destroy
        render json: true
      else
        render json: { error: question_option.errors.messages }, status: 422
      end
    end
  end
end
