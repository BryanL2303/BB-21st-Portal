# frozen_string_literal: true

module Api
  # The QuizController is responsible for handling functions for Quiz
  # within the API which includes QuizQuestion, such as CRUD functions.
  #
  # This api is currently not in use by production
  class DemoQuizController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_quiz
      # Check that there are no quizes with the same name within the same topic
      find_quiz = if params[:award]['masteryId'] == '0'
                    DemoQuiz.where(demo_award_id: params[:award]['awardId']).find_by(quiz_name: params[:quiz_name])
                  else
                    DemoQuiz.where(demo_mastery_id: params[:award]['masteryId']).find_by(quiz_name: params[:quiz_name])
                  end

      if find_quiz.nil?
        quiz = if params[:award]['masteryId'] == '0'
                 DemoQuiz.new(quiz_name: params[:quiz_name], marks: params[:marks], demo_award_id: params[:award]['awardId'],
                          assigned: false)
               else
                 DemoQuiz.new(quiz_name: params[:quiz_name], marks: params[:marks], demo_mastery_id: params[:award]['masteryId'],
                          assigned: false)
               end
        if quiz.save
          associate_existing_qeustions(quiz)
        else
          render json: { error: quiz.errors.messages }, status: 422
        end
      else
        render json: false, status: :reserved
      end
    end

    def associate_existing_qeustions(quiz)
      # Create joint table associations with questions
      params[:existing_questions].each do |id|
        quiz_question = DemoQuizQuestion.new(demo_quiz_id: quiz.id, demo_question_id: id)
        question = DemoQuestion.find_by(id:)
        question['assigned'] = true
        question.save
        render json: { error: quiz_question.errors.messages }, status: 422 unless quiz_question.save
      end
      params[:new_questions].each do |question|
        new_question = if params[:award]['masteryId'] == '0'
                         DemoQuestion.new(question_type: question['question_type'], question: question['question'],
                                      marks: question['marks'], demo_award_id: params[:award]['awardId'],
                                      permanent: false, assigned: true)
                       else
                         DemoQuestion.new(question_type: question['question_type'], question: question['question'],
                                      marks: question['marks'], demo_mastery_id: params[:award]['masteryId'],
                                      permanent: false, assigned: true)
                       end
        if new_question.save
          if question['question_type'] == 'MCQ' || question['question_type'] == 'MRQ'
            (question['answer']).each do |option|
              question_option = DemoQuestionOption.new(answer: option[:option], correct: option[:correct],
                                                   demo_question_id: new_question.id)
              render json: { error: question_option.errors.messages }, status: 422 unless question_option.save
            end
          elsif question['question_type'] == 'Open-ended'
            answer_rubric = DemoAnswerRubric.new(rubric: question.answer, demo_question_id: new_question.id)
            render json: { error: answer_rubric.errors.message }, status: 422 unless answer_rubric.save
          end
          quiz_question = DemoQuizQuestion.new(demo_quiz_id: quiz.id, demo_question_id: new_question.id)
          render json: { error: quiz_question.errors.messages }, status: 422 unless quiz_question.save
        else
          render json: { error: new_question.errors.messages }, status: 422
        end
      end
      render json: { quiz: }, status: :ok
    end

    def quiz
      quiz = DemoQuiz.find_by(id: params[:id])

      render json: quiz, status: :ok
    end

    def quizzes
      quizzes = if params[:award]['masteryId'] == '0'
                  DemoQuiz.where(demo_award_id: params[:award]['awardId'])
                else
                  DemoQuiz.where(demo_mastery_id: params[:award]['masteryId'])
                end

      render json: quizzes, status: :ok
    end

    def questions
      quiz_questions = DemoQuizQuestion.where(demo_quiz_id: params[:quiz_id]).order('id')
      questions = []
      quiz_questions.each do |quiz_question|
        question = DemoQuestion.find_by(id: quiz_question.demo_question_id)
        questions.push(question)
      end

      render json: questions, status: :ok
    end

    # This is only for submission of random questions from question bank
    def submit_quiz; end

    def delete_quiz
      quiz = DemoQuiz.find_by(id: params[:id])
      quiz_questions = DemoQuizQuestion.where(demo_quiz_id: quiz.id)
      quiz_questions.each do |quiz_question|
        question = DemoQuestion.find_by(id: quiz_question['question_id'])
        if question['permanent'] == false
          if question['question_type'] == 'Open-ended'
            rubric = DemoAnswerRubric.find_by(demo_question_id: question.id)
            rubric.destroy
          else
            options = DemoQuestionOption.where(demo_question_id: question.id)
            options.destroy_all
          end
          question.destroy
        else
          question = DemoQuestion.find_by(id: quiz_question['question_id'])
          quizzes = DemoQuizQuestion.find_by(['demo_question_id = :questionId and demo_quiz_id != :quizId',
                                          { questionId: question.id, quizId: quiz.id }])
          if quizzes.nil?
            question['assigned'] = false
            question.save
          end
        end
      end
      quiz_questions.destroy_all

      if quiz.destroy
        head :no_content
      else
        render json: { error: quiz.errors.messages }, status: 422
      end
    end
  end
end
