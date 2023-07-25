class Award < ApplicationRecord
	has_many :masteries
	has_many :questions
	has_many :quizzes
end