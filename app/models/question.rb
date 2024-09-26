class Question < ApplicationRecord
  belongs_to :award, optional: true
  belongs_to :mastery, optional: true
  has_many :question_options
  has_many :answer_rubrics
  has_and_belongs_to_many :quizzes, join_table: 'quiz_questions'
end
