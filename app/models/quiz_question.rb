# frozen_string_literal: true

class QuizQuestion < ApplicationRecord
  belongs_to :quiz
  belongs_to :question
end
