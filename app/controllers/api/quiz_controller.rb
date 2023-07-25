module Api
	class QuizController < ApplicationController
		protect_from_forgery with: :null_session

		def createQuiz
			#Check that there are no quizes with the same name within the same topic
			if (params[:award]['masteryId'] == 0)
				findQuiz = Quiz.where(award_id: params[:award]['awardId']).find_by(quiz_name: params[:quiz_name])
			else
				findQuiz = Quiz.where(mastery_id: params[:award]['masteryId']).find_by(quiz_name: params[:quiz_name])
			end

			if findQuiz == nil
				if (params[:award]['masteryId'] == 0)
					quiz = Quiz.new(quiz_name: params[:quiz_name], marks: params[:marks], award_id: params[:award]['awardId'], assigned: false)
				else
					quiz = Quiz.new(quiz_name: params[:quiz_name], marks: params[:marks], mastery_id: params[:award]['masteryId'], assigned: false)
				end
				if quiz.save
					#Create joint table associations with questions
					for id in params[:existing_questions]
						quizQuestion = QuizQuestion.new(quiz_id: quiz.id, question_id: id)
						if quizQuestion.save
						else
							render json: {error: quizQuestion.errors.messages}, status: 422
						end
					end
					for question in params[:new_questions]
						newQuestion = Question.new(question_type: question['question_type'], question: question['question'], marks: question['marks'], topic_id: topic.id, permanent: false)
						if newQuestion.save
							if question['question_type'] == 'MCQ' || question['question_type'] == 'MRQ' 
								for option in question['answer']
									questionOption = QuestionOption.new(answer: option[:option], correct: option[:correct], question_id: newQuestion.id)
									if questionOption.save
									else
										render json: {error: questionOption.errors.messages}, status: 422
									end
								end
							elsif question['question_type'] == 'Open-ended'
								answerRubric = AnswerRubric.new(rubric: question.answer, question_id: newQuestion.id)
								if answerRubric.save
								else
									render json: {error: answerRubric.errors.message}, status: 422
								end
							end
							quizQuestion = QuizQuestion.new(quiz_id: quiz.id, question_id: newQuestion.id)
							if quizQuestion.save
							else
								render json: {error: quizQuestion.errors.messages}, status: 422
							end
						else
							render json: {error: newQuestion.errors.messages}, status: 422
						end
					end
					render json: {quiz: quiz}
				else
					render json: {error: quiz.errors.messages}, status: 422
				end
			else
				render json: false
			end
		end

		def getQuiz
			quiz = Quiz.find_by(id: params[:id])
			
			render json: quiz
		end

		def getQuizzes
			if (params[:award]['masteryId'] == 0)
				quizzes = Quiz.where(award_id: params[:award]['awardId'])
			else
				quizzes = Quiz.where(mastery_id: params[:award]['masteryId'])
			end			
			
			render json: quizzes
		end

		def getQuestions
			quizQuestions = QuizQuestion.where(quiz_id: params[:quiz_id]).order('id')
			questions = []
			for quizQuestion in quizQuestions
				question = Question.find_by(id: quizQuestion.question_id)
				questions.push(question)
			end

			render json: questions
		end

		#This is only for submission of random questions from question bank
		def submitQuiz
		end

		def deleteQuiz
			quiz = Quiz.find_by(id: params[:quiz_id])

			if quiz.destroy
				head :no_content
			else
				render json: {error: quiz.errors.messages}, status: 422
			end
		end
	end
end