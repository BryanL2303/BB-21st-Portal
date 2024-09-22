module Api
	class QuestionOptionController < ApplicationController
		protect_from_forgery with: :null_session
		before_action :authenticate_request

		def createOption
			questionOption = QuestionOption.new(question: params[:question], answer: params[:answer], correct: params[:correct], question_id: params[:question_id])

			if questionOption.save
				render json: true
			else
				render json: {error: questionOption.errors.messages}, status: 422
			end			
		end

		def editOption
			questionOption = QuestionOption.find_by(id: params[:question_option_id])
			questionOption.question = params[:question]
			questionOption.answer = params[:answer]
			questionOption.correct = params[:correct]

			if questionOption.save
				render json: true
			else
				render json: {error: questionOption.errors.messages}, status: 422
			end
		end

		def deleteOption
			questionOption = QuestionOption.find_by(id: params[:question_option_id])

			if questionOption.destroy
				render json: true
			else
				render json: {error: questionOption.errors.messages}, status: 422
			end
		end
	end
end