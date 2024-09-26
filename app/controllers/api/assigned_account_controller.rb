# frozen_string_literal: true

module Api
  # The AssignedAccountController is responsible for handling functions for assigning quizzes to Boys
  # within the API, such as CRUD functions for AssignedAccount.
  #
  # This controller should include functions for the table AssignedAccount
  # This api is currently not in use by production
  class AssignedAccountController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_assigned_account
      account = Account.new(account_name: params[:account_name], password: params[:password],
                            account_type: params[:account_type])
      find_account = Account.find_by(account_name: params[:account_name])

      if find_account.nil?
        if account.save
          token = encode_token({ user_id: account.id })
          render json: { account_name: account.account_name, type: account.account_type, token: }
        else
          render json: { error: account.errors.messages }, status: 422
        end
      else
        render json: false
      end
    end

    def assigned_account
      account_id = @current_user.id
      assigned_accounts = AssignedAccount.where(account_id:)
      assignments = Assignment.where(quiz_id: params[:quiz_id])
      assignments.each do |assignment|
        assigned_account = assigned_accounts.find_by(assignment_id: assignment.id)
        unless assigned_account.nil?
          render json: assigned_account
          break
        end
      end
    end

    def assigned_accounts
      assigned_accounts = AssignedAccount.where(assignment_id: params[:assignment_id]).order('account_id')

      render json: assigned_accounts
    end

    def update_account_assigment
      assigned_account = AssignedAccount.find_by(id: params[:id])
      assigned_account.score = params[:new_score]
      assigned_account.attempts = params[:new_attempts]
      if assigned_account.save
        render json: true
      else
        render json: false
      end
    end

    def assignment_answers
      data = {}
      assigned_account = AssignedAccount.find_by(id: params[:id])
      data['assigned_account'] = assigned_account
      data['account'] = Account.find_by(id: assigned_account.account_id)
      assignment = Assignment.find_by(id: assigned_account.assignment_id)
      data['assignment'] = assignment
      quiz = Quiz.find_by(id: assignment.quiz_id)
      data['quiz'] = quiz

      attempt_score = AttemptScore.where(assigned_account_id: assigned_account.id).find_by(attempt: params[:attempt])
      data['attempt_score'] = attempt_score

      quiz_questions = QuizQuestion.where(quiz_id: quiz.id).order('question_id')

      data['questions'] = []
      assignment_answers = AssignmentAnswer.where(account_id: assigned_account.account_id)
                                           .where(assignment_id: assigned_account.assignment_id)
                                           .where(attempt: params[:attempt])
      quiz_questions.each do |quiz_question|
        answer = {}
        question = Question.find_by(id: quiz_question.question_id)
        if question.question_type != 'Open-ended'
          rubric = QuestionOption.where(question_id: question.id).order('id')
          answer = []
          rubric.each do |option|
            assignment_answer = assignment_answers.where(question_id: question.id)
                                                  .find_by(question_option_id: option.id)
            answer.push({ "rubric": option, "answer": assignment_answer })
          end
        else
          rubric = AnswerRubric.where(question_id: question.id)
          answer['rubric'] = rubric
          assignment_answer = assignment_answers.where(question_id: question.id)
          answer['answer'] = assignment_answer
        end

        data['questions'].append({ 'question': question, 'answer': answer })
      end

      render json: data
    end

    def set_graded
      attempt_score = AttemptScore.find_by(id: params[:attempt_score_id])
      attempt_score.graded = true
      attempt_score.save

      render json: attempt_score
    end

    def delete_assigned_account
      assigned_account = AssignedAccount.find_by(id: params[:id])

      if assigned_account.destroy
        head :no_content
      else
        render json: { error: assigned_account.errors.messages }, status: 422
      end
    end
  end
end
