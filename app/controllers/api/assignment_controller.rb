module Api
	class AssignmentController < ApplicationController
		protect_from_forgery with: :null_session
		before_action :authenticate_request

		def createAssignment
			if params[:award][:masteryId] == '0'
				assignment = Assignment.new(account_id: @current_user.id, quiz_id: params[:quiz_id], award_id: params[:award][:awardId], assignment_name: params[:assignment_name], attempt_limit: params[:attempt_limit], show_answer: params[:show_answer])
			else
				assignment = Assignment.new(account_id: @current_user.id, quiz_id: params[:quiz_id], mastery_id: params[:award][:masteryId], assignment_name: params[:assignment_name], attempt_limit: params[:attempt_limit], show_answer: params[:show_answer])
			end

			if assignment.save
				quiz = Quiz.find_by(id: params[:quiz_id])
				quiz['assigned'] = true
				quiz.save
				for accountId in params[:accounts]
					assigned_account = AssignedAccount.new(account_id: accountId, assignment_id: assignment.id, score: 0, attempts: 0)
					assigned_account.save
				end
				render json: assignment
			else
				render json: {error: assignment.errors.messages}, status: 422
			end			
		end

		def getAssignment
			if params[:id] == '0'
				accountId = @current_user.id
				assignments = Assignment.where(quiz_id: params[:quiz_id])
				data = {}
				for assignment in assignments
					assigned_account = AssignedAccount.find_by(account_id: accountId, assignment_id: assignment.id)
					if assigned_account != nil
						attemptScore = AttemptScore.find_by(attempt: assigned_account.attempts, assigned_account_id: assigned_account.id)
						data['assigned_account'] = assigned_account
						data['attemptScore'] = attemptScore
					end
				end
				render json: data
			else
				assignment = Assignment.find_by(id: params[:id])
				render json: assignment
			end
		end

		def getAssignments
			if params[:award]['masteryId'] == '0'
				assignments = Assignment.where(award_id: params[:award]['awardId']).order('id')
			else
				assignments = Assignment.where(mastery_id: params[:award]['masteryId']).order('id')
			end

			render json: assignments
		end

		def submitAssignment
			accountId = @current_user.id
			assignments = Assignment.where(quiz_id: params[:quiz_id])
			graded = true
			for assignment in assignments
				assigned_accounts = AssignedAccount.where(assignment_id: assignment.id)
				assigned_account = assigned_accounts.find_by(account_id: accountId)
				if assigned_account != nil
					quiz = Quiz.find_by(id: params[:quiz_id])
					assigned_account.attempts += 1
					marks = 0.0
					for answer in params[:answers]
						question = Question.find_by(id: answer['question_id'])
						if question.question_type == 'MCQ'
							assignmentAnswer = AssignmentAnswer.new(account_id: accountId, assignment_id: assigned_account.assignment_id, question_id: answer['question_id'], attempt: assigned_account.attempts, question_type: question.question_type)
							option = QuestionOption.find_by(id: answer['selected'][0])
							assignmentAnswer.question_option_id = option.id
							if option.correct
								marks += question.marks
								assignmentAnswer.score = question.marks
							else
								assignmentAnswer.score = 0
							end
							assignmentAnswer.save
						end
						if question.question_type == 'MRQ'
							partial = 0.0
							correctAnswers = 0
							temporary = 0.0
							options = QuestionOption.where(question_id: answer['question_id'])
							for option in options
								if option.correct
									correctAnswers += 1
								end
							end
							partial = question.marks / correctAnswers
							for optionId in answer['selected']
								option = QuestionOption.find_by(id: optionId)
								assignmentAnswer = AssignmentAnswer.new(account_id: accountId, assignment_id: assigned_account.assignment_id, question_id: answer['question_id'], attempt: assigned_account.attempts, question_type: question.question_type)
								assignmentAnswer.question_option_id = option.id
								assignmentAnswer.score = 0
								assignmentAnswer.save
								if option.correct
									temporary += partial
								else
									temporary -= partial
								end
							end
							if temporary >= 0.0
								assignmentAnswers = AssignmentAnswer.where(account_id: accountId, assignment_id:assigned_account.assignment_id, question_id: answer['question_id'])
								for assignmentAnswer in assignmentAnswers
									assignmentAnswer.score = temporary
									assignmentAnswer.save
								end
								marks += temporary
							end
						end
						if question.question_type == 'Open-ended'
							graded = false
							assignmentAnswer = AssignmentAnswer.new(account_id: accountId, assignment_id: assigned_account.assignment_id, question_id: answer['question_id'], attempt: assigned_account.attempts, question_type: question.question_type, score: 0, comments: '')
							assignmentAnswer.answer = answer['selected']
							assignmentAnswer.save
						end	
					end
					if marks > assigned_account.score
						assigned_account.score = marks
					end
					attemptScore = AttemptScore.new(assigned_account_id: assigned_account.id, attempt: assigned_account.attempts, score: marks, graded: graded)
					attemptScore.save
					assigned_account.save
					
					render json: assigned_account
				end
			end
		end

		def gradeQuestion
			assignmentAnswer = AssignmentAnswer.find_by(id: params[:id])
			assignmentAnswer.comments = params[:comments]

			assigned_account = AssignedAccount.where(assignment_id: assignmentAnswer.assignment_id).find_by(account_id: assignmentAnswer.account_id)
			attemptScore = AttemptScore.where(assigned_account_id: assigned_account.id).find_by(attempt: assignmentAnswer.attempt)

			oldScore = assignmentAnswer.score
			attemptScore.score -= oldScore
			attemptScore.score += params[:score].to_f
			attemptScore.save

			attemptScores = AttemptScore.where(assigned_account_id: assigned_account.id)
			highestScore = 0
			for attemptScore in attemptScores
				if attemptScore.score > highestScore
					highestScore = attemptScore.score
				end
			end
			assigned_account.score = highestScore
			assigned_account.save

			assignmentAnswer.score = params[:score]
			assignmentAnswer.save

			render json: assignmentAnswer
		end

		def getResultsInformation
			data = {}
			accountId = @current_user.id
			account = @current_user
			data['account'] = account
			assignment = Assignment.find_by(id: params[:id])
			data['assignment'] = assignment
			assigned_accounts_temp = AssignedAccount.where(assignment_id: assignment.id)
			assigned_accounts = []
			for assigned_account in assigned_accounts_temp
				account = Account.find_by(id: assigned_account.account_id)
				assigned_accounts.push(account)
			end
			data['assigned_accounts'] = assigned_accounts
			quiz = Quiz.find_by(id: assignment.quiz_id)
			if quiz.mastery_id == nil
				award = Award.find_by(id: quiz.award_id)
				data['award'] = award
			else
				mastery = Mastery.find_by(id: quiz.mastery_id)
				award = Award.find_by(id: mastery.award_id)
				data['award'] = award
				data['mastery'] = mastery
			end

			render json: data
		end

		def deleteAssignment
			assignment = Assignment.find_by(id: params[:id])

			assigned_accounts = AssignedAccount.where(assignment_id: params[:id])
			for assigned_account in assigned_accounts
				attemptScores = AttemptScore.where(assigned_account_id: assigned_account.id)
				attemptScores.destroy_all
				assignmentAnswers = AssignmentAnswer.where(account_id: assigned_account.account_id).where(assignment_id: assigned_account.assignment_id)
				assignmentAnswers.destroy_all
			end
			assigned_accounts.destroy_all

			quiz_id = assignment["quiz_id"]

			if assignment.destroy
				assignments = Assignment.where(quiz_id: quiz_id)
				if assignments == nil
					quiz = Quiz.find_by(id: quiz_id)
					quiz["assigned"] = false
					quiz.save
				end
				head :no_content
			else
				render json: {error: assignment.errors.messages}, status: 422
			end
		end
	end
end