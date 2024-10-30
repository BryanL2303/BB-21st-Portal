# frozen_string_literal: true

module Api
  # The QuestionController is responsible for handling functions for Question
  # within the API, such as CRUD functions.
  #
  # This api is currently not in use by production
  class DemoQuestionController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_question
      question = if params[:award][:masteryId] == '0'
                   DemoQuestion.new(question_type: params[:question_type], question: params[:question],
                                marks: params[:marks], demo_award_id: params[:award][:awardId], permanent: true,
                                assigned: false)
                 else
                   DemoQuestion.new(question_type: params[:question_type], question: params[:question],
                                marks: params[:marks],
                                demo_mastery_id: params[:award][:masteryId], permanent: true, assigned: false)
                 end
      if question.save
        if params[:question_type] == 'MCQ' || params[:question_type] == 'MRQ'
          params[:answer].each do |option|
            question_option = DemoQuestionOption.new(answer: option[:option], correct: option[:correct],
                                                 demo_question_id: question.id)
            render json: { error: question_option.errors.messages }, status: 422 unless question_option.save
          end
        elsif params[:question_type] == 'Open-ended'
          answer_rubric = DemoAnswerRubric.new(rubric: params[:answer][0], demo_question_id: question.id)
          render json: { error: answer_rubric.errors.message }, status: 422 unless answer_rubric.save
        end
        render json: true, status: :created
      else
        render json: { error: question.errors.messages }, status: 422
      end
    end

    def question
      question = DemoQuestion.find_by(id: params[:question_id])

      render json: question, status: :ok
    end

    def questions
      questions = if params[:award]['masteryId'] == '0'
                    DemoQuestion.where(demo_award_id: params[:award]['awardId'],
                                   question_type: params[:question_type]).order('permanent')
                  else
                    DemoQuestion.where(demo_mastery_id: params[:award]['masteryId'],
                                   question_type: params[:question_type]).order('permanent')
                  end

      render json: questions, status: :ok
    end

    def options
      question_options = DemoQuestionOption.where(demo_question_id: params[:question_id])

      render json: question_options, status: :ok
    end

    def rubric
      rubric = DemoAnswerRubric.find_by(demo_question_id: params[:question_id])

      if rubric.nil?
        render json: false, status: :not_found
      else
        render json: rubric, status: :ok
      end
    end

    def edit_question
      question = DemoQuestion.find_by(id: params[:question_id])
      question['question'] = params[:question]
      question['marks'] = params[:marks]

      if question.question_type == 'MCQ' || question.question_type == 'MRQ'
        options = DemoQuestionOption.where(demo_question_id: question.id)
        options.destroy_all
        params[:answer].each do |option|
          question_option = DemoQuestionOption.new(answer: option[:option], correct: option[:correct],
                                               demo_question_id: question.id)
          render json: { error: question_option.errors.messages }, status: 422 unless question_option.save
        end
      elsif question.question_type == 'Open-ended'
        rubric = DemoAnswerRubric.find_by(demo_question_id: question.id)
        rubric.destroy
        answer_rubric = DemoAnswerRubric.new(rubric: params[:rubric], demo_question_id: question.id)
        render json: { error: answer_rubric.errors.message }, status: 422 unless answer_rubric.save
      end

      if question.save
        render json: true, status: :accepted
      else
        render json: { error: question.errors.messages }, status: 422
      end
    end

    def set_permanent
      question = DemoQuestion.find_by(id: params[:question_id])
      question['permanent'] = true
      question.save

      render json: question, status: :accepted
    end

    def delete_question
      question = DemoQuestion.find_by(id: params[:question_id])

      if question.question_type == 'MCQ'
        question_options = DemoQuestionOption.where(demom_question_id: params[:question_id])
        question_options.destroy_all
      else
        rubric = DemoAnswerRubric.find_by(demo_question_id: params[:question_id])
        rubric.destroy
      end

      quiz_questions = DemoQuizQuestion.where(demo_question_id: params[:question_id])
      quiz_questions.destroy_all

      if question.destroy
        render json: true, status: :ok
      else
        render json: { error: question.errors.messages }, status: 422
      end
    end
  end
end
