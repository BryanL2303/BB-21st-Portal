# frozen_string_literal: true

module Api
  class AssignedAccountController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def createAssignedAccount
      account = Account.new(account_name: params[:account_name], password: params[:password],
                            account_type: params[:account_type])
      findAccount = Account.find_by(account_name: params[:account_name])

      if findAccount.nil?
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

    def getAssignedAccount
      accountId = @current_user.id
      assigned_accounts = AssignedAccount.where(account_id: accountId)
      assignments = Assignment.where(quiz_id: params[:quiz_id])
      assignments.each do |assignment|
        assigned_account = assigned_accounts.find_by(assignment_id: assignment.id)
        unless assigned_account.nil?
          render json: assigned_account
          break
        end
      end
    end

    def getAssignedAccounts
      assigned_accounts = AssignedAccount.where(assignment_id: params[:assignment_id]).order('account_id')

      render json: assigned_accounts
    end

    def updateAccountAssigment
      assigned_account = AssignedAccount.find_by(id: params[:id])
      assigned_account.score = params[:new_score]
      assigned_account.attempts = params[:new_attempts]
      if assigned_account.save
        render json: true
      else
        render json: false
      end
    end

    def getAssignmentAnswers
      data = {}
      assigned_account = AssignedAccount.find_by(id: params[:id])
      data['assigned_account'] = assigned_account
      data['account'] = Account.find_by(id: assigned_account.account_id)
      assignment = Assignment.find_by(id: assigned_account.assignment_id)
      data['assignment'] = assignment
      quiz = Quiz.find_by(id: assignment.quiz_id)
      data['quiz'] = quiz

      attemptScore = AttemptScore.where(assigned_account_id: assigned_account.id).find_by(attempt: params[:attempt])
      data['attempt_score'] = attemptScore

      quizQuestions = QuizQuestion.where(quiz_id: quiz.id).order('question_id')

      data['questions'] = []
      assignmentAnswers = AssignmentAnswer.where(account_id: assigned_account.account_id).where(assignment_id: assigned_account.assignment_id).where(attempt: params[:attempt])
      quizQuestions.each do |quizQuestion|
        answer = {}
        question = Question.find_by(id: quizQuestion.question_id)
        if question.question_type != 'Open-ended'
          rubric = QuestionOption.where(question_id: question.id).order('id')
          answer = []
          rubric.each do |option|
            assignmentAnswer = assignmentAnswers.where(question_id: question.id).find_by(question_option_id: option.id)
            answer.push({ "rubric": option, "answer": assignmentAnswer })
          end
        else
          rubric = AnswerRubric.where(question_id: question.id)
          answer['rubric'] = rubric
          assignmentAnswer = assignmentAnswers.where(question_id: question.id)
          answer['answer'] = assignmentAnswer
        end

        data['questions'].append({ 'question': question, 'answer': answer })
      end

      render json: data
    end

    def setGraded
      attemptScore = AttemptScore.find_by(id: params[:attempt_score_id])
      attemptScore.graded = true
      attemptScore.save

      render json: attemptScore
    end

    def deleteAssignedAccount
      assigned_account = AssignedAccount.find_by(id: params[:id])

      if assigned_account.destroy
        head :no_content
      else
        render json: { error: assigned_account.errors.messages }, status: 422
      end
    end
  end
end
