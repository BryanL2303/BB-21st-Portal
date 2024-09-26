# frozen_string_literal: true

class Topic < ApplicationRecord
  has_many :questions
  has_many :quizzes
end
