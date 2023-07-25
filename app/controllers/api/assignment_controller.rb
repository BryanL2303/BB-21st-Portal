module Api
	class AssignmentController < ApplicationController
		protect_from_forgery with: :null_session

		def createAssignment
			account = decode_token(params[:token])
			assignment = Assignment.new(account_id: account, quiz_id: params[:quiz_id], topic_name: params[:topic_name], attempt_limit: params[:attempt_limit], show_answer: params[:show_answer])

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
			assignment = Assignment.find_by(id: params[:id])

			render json: assignment
		end

		def getAssignments
			assignments = Assignment.where(topic_name: params[:topic_name]).order('id')

			render json: assignments
		end

		def submitAssignment
			accountId = decode_token(params[:token])
			assignments = Assignment.where(quiz_id: params[:quiz_id])
			for assignment in assignments
				assigned_accounts = AssignedAccount.where(assignment_id: assignment.id)
				assigned_account = assigned_accounts.find_by(account_id: accountId)
				if assigned_account != nil
					quiz = Quiz.find_by(id: params[:quiz_id])
					if assignment.attempt_limit != 0
						assigned_account.attempts += 1
					end
					marks = 0
					for answer in params[:answers]
						question = Question.find_by(id: answer['question_id'])
						if question.question_type == 'MCQ'
							option = QuestionOption.find_by(id: answer['selected'][0])
							if option.correct
								marks += 1
							end
						end
						if question.question_type == 'MRQ'
							partial = 0.0
							correctAnswers = 0
							temporary = 0
							options = QuestionOption.where(question_id: answer['question_id'])
							for option in options
								if option.correct
									correctAnswers += 1
								end
							end
							partial = 1 / correctAnswers
							for optionId in answer['selected']
								option = QuestionOption.find_by(id: optionId)
								if option.correct
									temporary += partial
								else
									temporary -= partial
								end
							end
							if temporary >= 0
								marks += temporary
							end
						end	
					end
					if marks > assigned_account.score
						assigned_account.score = marks
					end
					assigned_account.save
					
					render json: assigned_account
				end
			end
		end

		def deleteAssignment
			assignment = Assignment.find_by(id: params[:id])

			assigned_accounts = AssignedAccount.where(assignment_id: params[:id])
			assigned_accounts.destroy_all

			quiz_id = assignment["quiz_id"]

			if assignment.destroy
				assignments = Assignment.where(quiz_id: quiz_id)
				if assignment == nil
					quiz = Quiz.find_by(quiz_id)
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