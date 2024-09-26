# frozen_string_literal: true

class Quiz < ApplicationRecord
  belongs_to :award, optional: true
  belongs_to :mastery, optional: true
  has_and_belongs_to_many :questions, join_table: 'quiz_questions'
end
