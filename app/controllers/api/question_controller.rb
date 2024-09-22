module Api
	class QuestionController < ApplicationController
		protect_from_forgery with: :null_session
		before_action :authenticate_request

		def createQuestion
			if params[:award][:masteryId] == '0'
				question = Question.new(question_type: params[:question_type], question: params[:question], marks: params[:marks], award_id: params[:award][:awardId], permanent: true, assigned: false)
			else
				question = Question.new(question_type: params[:question_type], question: params[:question], marks: params[:marks], mastery_id: params[:award][:masteryId], permanent: true, assigned: false)
			end			
			if question.save
				if params[:question_type] == 'MCQ' || params[:question_type] == 'MRQ' 
					for option in params[:answer]
						questionOption = QuestionOption.new(answer: option[:option], correct: option[:correct], question_id: question.id)
						if questionOption.save
						else
							render json: {error: questionOption.errors.messages}, status: 422
						end
					end
			 	else
					if params[:question_type] == 'Open-ended'
						answerRubric = AnswerRubric.new(rubric: params[:answer][0], question_id: question.id)
						if answerRubric.save
						else
							render json: {error: answerRubric.errors.message}, status: 422
						end
					end
				end
				render json: true
			else
				render json: {error: question.errors.messages}, status: 422
			end
		end

		def getQuestion
			question = Question.find_by(id: params[:question_id])
			
			render json: question
		end

		def getQuestions
			if params[:award]['masteryId'] == '0'
				questions = Question.where(award_id: params[:award]['awardId'], question_type: params[:question_type]).order('permanent')
			else
				questions = Question.where(mastery_id: params[:award]['masteryId'], question_type: params[:question_type]).order('permanent')
			end
			
			render json: questions
		end

		def getOptions
			questionOptions = QuestionOption.where(question_id: params[:question_id])
			
			render json: questionOptions
		end

		def getRubric
			rubric = AnswerRubric.find_by(question_id: params[:question_id])
			
			if rubric == nil
				render json: false
			else
				render json: rubric
			end
		end

		def editQuestion
			question = Question.find_by(id: params[:question_id])
			question['question'] = params[:question]
			question['marks'] = params[:marks]

			if question.question_type == 'MCQ' || question.question_type == 'MRQ' 
				options = QuestionOption.where(question_id: question.id)
				options.destroy_all
				for option in params[:answer]
					questionOption = QuestionOption.new(answer: option[:option], correct: option[:correct], question_id: question.id)
					if questionOption.save
					else
						render json: {error: questionOption.errors.messages}, status: 422
					end
				end
			elsif question.question_type == 'Open-ended'
				rubric = AnswerRubric.find_by(question_id: question.id)
				rubric.destroy
				answerRubric = AnswerRubric.new(rubric: params[:rubric], question_id: question.id)
				if answerRubric.save
				else
					render json: {error: answerRubric.errors.message}, status: 422
				end
			end

			if question.save
				
				render json: true
			else
				render json: {error: question.errors.messages}, status: 422
			end
		end

		def setPermanent
			question = Question.find_by(id: params[:question_id])
			question['permanent'] = true
			question.save

			render json: question
		end

		def deleteQuestion
			question = Question.find_by(id: params[:question_id])

			if question.question_type == 'MCQ'
				questionOptions = QuestionOption.where(question_id: params[:question_id])
				questionOptions.destroy_all
			else
				rubric = AnswerRubric.find_by(question_id: params[:question_id])
				rubric.destroy
			end

			quizQuestions = QuizQuestion.where(question_id: params[:question_id])
			quizQuestions.destroy_all

			if question.destroy
				render json: true
			else
				render json: {error: question.errors.messages}, status: 422
			end
		end
	end
end