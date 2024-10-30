# frozen_string_literal: true

module Api
  # The QuestionOptionController is responsible for handling functions for QuestionOption
  # within the API, such as CRUD functions.
  #
  # This api is currently not in use by production
  class DemoQuestionOptionController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_option
      question_option = DemoQuestionOption.new(question: params[:question], answer: params[:answer],
                                           correct: params[:correct], demo_question_id: params[:question_id])

      if question_option.save
        render json: true, status: :created
      else
        render json: { error: question_option.errors.messages }, status: 422
      end
    end

    def edit_option
      question_option = DemoQuestionOption.find_by(id: params[:question_option_id])
      question_option.question = params[:question]
      question_option.answer = params[:answer]
      question_option.correct = params[:correct]

      if question_option.save
        render json: true, status: :accepted
      else
        render json: { error: question_option.errors.messages }, status: 422
      end
    end

    def delete_option
      question_option = DemoQuestionOption.find_by(id: params[:question_option_id])

      if question_option.destroy
        render json: true, status: :ok
      else
        render json: { error: question_option.errors.messages }, status: 422
      end
    end
  end
end
