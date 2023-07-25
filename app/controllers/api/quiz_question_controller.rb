module Api
	class QuizQuestionController < ApplicationController
		protect_from_forgery with: :null_session
	end
end