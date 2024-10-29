# frozen_string_literal: true

module Api
  # The QuestionController is responsible for handling functions for Question
  # within the API, such as CRUD functions.
  #
  # This api is currently not in use by production
  class QuestionController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_question
      question = if params[:award][:masteryId] == '0'
                   Question.new(question_type: params[:question_type], question: params[:question],
                                marks: params[:marks], award_id: params[:award][:awardId], permanent: true,
                                assigned: false)
                 else
                   Question.new(question_type: params[:question_type], question: params[:question],
                                marks: params[:marks],
                                mastery_id: params[:award][:masteryId], permanent: true, assigned: false)
                 end
      if question.save
        if params[:question_type] == 'MCQ' || params[:question_type] == 'MRQ'
          params[:answer].each do |option|
            question_option = QuestionOption.new(answer: option[:option], correct: option[:correct],
                                                 question_id: question.id)
            render json: { error: question_option.errors.messages }, status: 422 unless question_option.save
          end
        elsif params[:question_type] == 'Open-ended'
          answer_rubric = AnswerRubric.new(rubric: params[:answer][0], question_id: question.id)
          render json: { error: answer_rubric.errors.message }, status: 422 unless answer_rubric.save
        end
        render json: true, status: :created
      else
        render json: { error: question.errors.messages }, status: 422
      end
    end

    def question
      question = Question.find_by(id: params[:question_id])

      render json: question, status: :ok
    end

    def questions
      questions = if params[:award]['masteryId'] == '0'
                    Question.where(award_id: params[:award]['awardId'],
                                   question_type: params[:question_type]).order('permanent')
                  else
                    Question.where(mastery_id: params[:award]['masteryId'],
                                   question_type: params[:question_type]).order('permanent')
                  end

      render json: questions, status: :ok
    end

    def options
      question_options = QuestionOption.where(question_id: params[:question_id])

      render json: question_options, status: :ok
    end

    def rubric
      rubric = AnswerRubric.find_by(question_id: params[:question_id])

      if rubric.nil?
        render json: false, status: :not_found
      else
        render json: rubric, status: :ok
      end
    end

    def edit_question
      question = Question.find_by(id: params[:question_id])
      question['question'] = params[:question]
      question['marks'] = params[:marks]

      if question.question_type == 'MCQ' || question.question_type == 'MRQ'
        options = QuestionOption.where(question_id: question.id)
        options.destroy_all
        params[:answer].each do |option|
          question_option = QuestionOption.new(answer: option[:option], correct: option[:correct],
                                               question_id: question.id)
          render json: { error: question_option.errors.messages }, status: 422 unless question_option.save
        end
      elsif question.question_type == 'Open-ended'
        rubric = AnswerRubric.find_by(question_id: question.id)
        rubric.destroy
        answer_rubric = AnswerRubric.new(rubric: params[:rubric], question_id: question.id)
        render json: { error: answer_rubric.errors.message }, status: 422 unless answer_rubric.save
      end

      if question.save
        render json: true, status: :accepted
      else
        render json: { error: question.errors.messages }, status: 422
      end
    end

    def set_permanent
      question = Question.find_by(id: params[:question_id])
      question['permanent'] = true
      question.save

      render json: question, status: :accepted
    end

    def delete_question
      question = Question.find_by(id: params[:question_id])

      if question.question_type == 'MCQ'
        question_options = QuestionOption.where(question_id: params[:question_id])
        question_options.destroy_all
      else
        rubric = AnswerRubric.find_by(question_id: params[:question_id])
        rubric.destroy
      end

      quiz_questions = QuizQuestion.where(question_id: params[:question_id])
      quiz_questions.destroy_all

      if question.destroy
        render json: true, status: :ok
      else
        render json: { error: question.errors.messages }, status: 422
      end
    end
  end
end
