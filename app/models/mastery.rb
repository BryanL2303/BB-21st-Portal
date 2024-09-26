class Mastery < ApplicationRecord
  belongs_to :award
  has_many :questions
  has_many :quizzes
  has_many :custom_columns
end
