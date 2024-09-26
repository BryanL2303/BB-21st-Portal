# frozen_string_literal: true

module Api
  class QuizQuestionController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :authenticate_request
  end
end
