class Assignment < ApplicationRecord
  belongs_to :account
  belongs_to :quiz
  belongs_to :award, optional: true
  belongs_to :mastery, optional: true
end
