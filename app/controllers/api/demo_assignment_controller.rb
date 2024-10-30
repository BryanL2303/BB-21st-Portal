# frozen_string_literal: true

module Api
  # The AssignmentController is responsible for handling functions for Assignment
  # within the API, such as CRUD functions.
  #
  # This controller should include functions for the table Assignment
  # This api is currently not in use by production
  class DemoAssignmentController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request

    def create_assignment
      if params[:award][:masteryId] == '0'
        assignment = DemoAssignment.new(demo_account_id: @current_user.id, demo_quiz_id: params[:quiz_id],
                                    demo_award_id: params[:award][:awardId], assignment_name: params[:assignment_name],
                                    attempt_limit: params[:attempt_limit], show_answer: params[:show_answer])
      else
        assignment = DemoAssignment.new(demo_account_id: @current_user.id, demo_quiz_id: params[:quiz_id],
                                    demo_mastery_id: params[:award][:masteryId], assignment_name: params[:assignment_name],
                                    attempt_limit: params[:attempt_limit], show_answer: params[:show_answer])
      end

      if assignment.save
        quiz = DemoQuiz.find_by(id: params[:quiz_id])
        quiz['assigned'] = true
        quiz.save
        params[:accounts].each do |account_id|
          assigned_account = AssignedAccount.new(demo_account_id: account_id, demo_assignment_id: assignment.id, score: 0,
                                                 attempts: 0)
          assigned_account.save
        end
        render json: assignment, status: :created
      else
        render json: { error: assignment.errors.messages }, status: 422
      end
    end

    def assignment
      if params[:id] == '0'
        account_id = @current_user.id
        assignments = DemoAssignment.where(demo_quiz_id: params[:quiz_id])
        data = {}
        assignments.each do |assignment|
          assigned_account = DemoAssignedAccount.find_by(demo_account_id: account_id, demo_assignment_id: assignment.id)
          next if assigned_account.nil?

          attempt_score = DemoAttemptScore.find_by(attempt: assigned_account.attempts,
                                               demo_assigned_account_id: assigned_account.id)
          data['assigned_account'] = assigned_account
          data['attempt_score'] = attempt_score
        end
        render json: data, status: :ok
      else
        assignment = DemoAssignment.find_by(id: params[:id])
        render json: assignment, status: :ok
      end
    end

    def assignments
      assignments = if params[:award]['masteryId'] == '0'
                      DemoAssignment.where(demo_award_id: params[:award]['awardId']).order('id')
                    else
                      DemoAssignment.where(demo_mastery_id: params[:award]['masteryId']).order('id')
                    end

      render json: assignments, status: :ok
    end

    def submit_assignment
      account_id = @current_user.id
      assignments = DemoAssignment.where(demo_quiz_id: params[:quiz_id])
      graded = true
      assignments.each do |assignment|
        assigned_accounts = DemoAssignedAccount.where(demo_assignment_id: assignment.id)
        assigned_account = assigned_accounts.find_by(account_id:)
        next if assigned_account.nil?

        _
        assigned_account.attempts += 1
        marks = 0.0
        params[:answers].each do |answer|
          question = DemoQuestion.find_by(id: answer['question_id'])
          if question.question_type == 'MCQ'
            assignment_answer = DemoAssignmentAnswer.new(demo_account_id: account_id, demo_assignment_id: assigned_account.demo_assignment_id,
                                                     demo_question_id: answer['question_id'],
                                                     attempt: assigned_account.attempts,
                                                     question_type: question.question_type)
            option = DemoQuestionOption.find_by(id: answer['selected'][0])
            assignment_answer.demo_question_option_id = option.id
            if option.correct
              marks += question.marks
              assignment_answer.score = question.marks
            else
              assignment_answer.score = 0
            end
            assignment_answer.save
          end
          if question.question_type == 'MRQ'
            partial = 0.0
            correct_answers = 0
            temporary = 0.0
            options = DemoQuestionOption.where(demo_question_id: answer['question_id'])
            options.each do |mrq_option|
              correct_answers += 1 if mrq_option.correct
            end
            partial = question.marks / correct_answers
            (answer['selected']).each do |option_id|
              option = DemoQuestionOption.find_by(id: option_id)
              assignment_answer = DemoAssignmentAnswer.new(demo_account_id: account_id, demo_assignment_id: assigned_account.demo_assignment_id,
                                                       demo_question_id: answer['question_id'],
                                                       attempt: assigned_account.attempts,
                                                       question_type: question.question_type)
              assignment_answer.demo_question_option_id = option.id
              assignment_answer.score = 0
              assignment_answer.save
              if option.correct
                temporary += partial
              else
                temporary -= partial
              end
            end
            if temporary >= 0.0
              assignment_answers = DemoAssignmentAnswer.where(demo_account_id: account_id, demo_assignment_id: assigned_account.demo_assignment_id,
                                                        demo_question_id: answer['question_id'])
              assignment_answers.each do |mrq_assignment_answer|
                mrq_assignment_answer.score = temporary
                mrq_assignment_answer.save
              end
              marks += temporary
            end
          end
          next unless question.question_type == 'Open-ended'

          graded = false
          assignment_answer = DemoAssignmentAnswer.new(demo_account_id: account_id, demo_assignment_id: assigned_account.demo_assignment_id,
          demo_question_id: answer['question_id'],
                                                   attempt: assigned_account.attempts,
                                                   question_type: question.question_type, score: 0, comments: '')
          assignment_answer.answer = answer['selected']
          assignment_answer.save
        end
        assigned_account.score = marks if marks > assigned_account.score
        attempt_score = DemoAttemptScore.new(demo_assigned_account_id: assigned_account.id, attempt: assigned_account.attempts,
                                         score: marks, graded:)
        attempt_score.save
        assigned_account.save

        render json: assigned_account, status: :accepted
      end
    end

    def grade_question
      assignment_answer = DemoAssignmentAnswer.find_by(id: params[:id])
      assignment_answer.comments = params[:comments]

      assigned_account = DemoAssignedAccount.where(demo_assignment_id: assignment_answer.demo_assignment_id)
                                        .find_by(demo_account_id: assignment_answer.demo_account_id)
      attempt_score = DemoAttemptScore.where(demo_assigned_account_id: assigned_account.id)
                                  .find_by(attempt: assignment_answer.attempt)

      old_score = assignment_answer.score
      attempt_score.score -= old_score
      attempt_score.score += params[:score].to_f
      attempt_score.save

      attempt_scores = DemoAttemptScore.where(demo_assigned_account_id: assigned_account.id)
      highest_score = 0
      attempt_scores.each do |past_attempt_score|
        highest_score = past_attempt_score.score if past_attempt_score.score > highest_score
      end
      assigned_account.score = highest_score
      assigned_account.save

      assignment_answer.score = params[:score]
      assignment_answer.save

      render json: assignment_answer, status: :accepted
    end

    def results_information
      data = {}
      @current_user.id
      account = @current_user
      data['account'] = account
      assignment = DemoAssignment.find_by(id: params[:id])
      data['assignment'] = assignment
      assigned_accounts_temp = DemoAssignedAccount.where(demo_assignment_id: assignment.id)
      assigned_accounts = []
      assigned_accounts_temp.each do |assigned_account|
        account = DemoAccount.find_by(id: assigned_account.demo_account_id)
        assigned_accounts.push(account)
      end
      data['assigned_accounts'] = assigned_accounts
      quiz = DemoQuiz.find_by(id: assignment.demo_quiz_id)
      if quiz.demo_mastery_id.nil?
        award = DemoAward.find_by(id: quiz.demo_award_id)
        data['award'] = award
      else
        mastery = DemoMastery.find_by(id: quiz.demo_mastery_id)
        award = DemoAward.find_by(id: mastery.demo_award_id)
        data['award'] = award
        data['mastery'] = mastery
      end

      render json: data, status: :ok
    end

    def delete_assignment
      assignment = DemoAssignment.find_by(id: params[:id])

      assigned_accounts = DemoAssignedAccount.where(demo_assignment_id: params[:id])
      assigned_accounts.each do |assigned_account|
        attempt_scores = DemoAttemptScore.where(demo_assigned_account_id: assigned_account.id)
        attempt_scores.destroy_all
        assignment_answers = DemoAssignmentAnswer.where(demo_account_id: assigned_account.demo_account_id)
                                             .where(demo_assignment_id: assigned_account.demo_assignment_id)
        assignment_answers.destroy_all
      end
      assigned_accounts.destroy_all

      quiz_id = assignment['quiz_id']

      if assignment.destroy
        assignments = DemoAssignment.where(demo_quiz_id: quiz_id)
        if assignments.nil?
          quiz = DemoQuiz.find_by(id: quiz_id)
          quiz['assigned'] = false
          quiz.save
        end
        head :no_content
      else
        render json: { error: assignment.errors.messages }, status: 422
      end
    end
  end
end
